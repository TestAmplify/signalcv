'use client'

import { useState, useEffect, DragEvent, ChangeEvent } from 'react'
import { computeAtsScore, autoFixResume, type AtsResult } from '@/lib/ats'
import { CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedButton } from '@/components/ui/animated-button'

type AtsPipelineStatus =
  | 'idle'
  | 'uploading'
  | 'scanning'
  | 'good'
  | 'ready_good'
  | 'needs_work'
  | 'fixing'
  | 'ready_review'

function AtsStepper({ status, result }: { status: AtsPipelineStatus; result: AtsResult | null }) {
  if (!result) {
    if (status === 'idle') return null
    if (status === 'uploading') {
      // Show stepper during upload even if result is null
    } else {
      // Hide if idle
      return null
    }
  }

  const isGood = Boolean(result?.passed) || status === 'good' || status === 'ready_good'

  const goodSteps = ['Pasted / Uploaded', 'Scanning', 'Good ≥ 90 ATS', 'Ready']
  const workSteps = ['Scanning', 'Needs work', 'Fixing', 'Ready to review']

  const steps = isGood ? goodSteps : workSteps

  const currentIndex = (() => {
    if (isGood) {
      if (status === 'uploading') return 0
      if (status === 'scanning') return 1
      if (status === 'good') return 2
      if (status === 'ready_good') return 3
      return 3 // Default to Ready if passed
    }
    if (status === 'scanning') return 0
    if (status === 'needs_work') return 1
    if (status === 'fixing') return 2
    if (status === 'ready_review') return 3
    return 1 // Default to Needs work
  })()

  return (
    <div className="mt-2 flex gap-3 text-xs text-muted">
      <div className="flex flex-col items-center">
        {steps.map((_, index) => {
          const state = index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'pending'
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={cn(
                  'h-2 w-2 rounded-full border',
                  state === 'done' && 'bg-green-500 border-green-500',
                  state === 'active' && 'bg-yellow-400 border-yellow-400 animate-pulse',
                  state === 'pending' && 'bg-transparent border-border'
                )}
              />
              {index < steps.length - 1 && (
                <div className="h-4 w-px bg-border/60" />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-1">
        {steps.map((label, index) => {
          const state = index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'pending'
          return (
            <div
              key={label}
              className={cn(
                'text-[11px]',
                state === 'done' && 'text-muted',
                state === 'active' && (isGood ? 'text-green-400' : 'text-yellow-400'),
                state === 'pending' && 'text-muted/70'
              )}
            >
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function isSupportedFileType(file: File): boolean {
  const type = file.type
  const name = file.name.toLowerCase()

  if (type.startsWith('text/')) return true
  if (name.endsWith('.txt') || name.endsWith('.md')) return true
  if (name.endsWith('.docx')) return true
  if (name.endsWith('.pdf')) return true

  return false
}

async function getFileText(file: File): Promise<string> {
  if (file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.md')) {
    return file.text()
  }

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/file-to-text', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Unable to read file')
  }

  const data = (await res.json()) as { text?: string }
  return data.text ?? ''
}

export default function SignalCVApp() {
  const [baseResume, setBaseResume] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/base-resume', { cache: 'no-store' })
        const data = await res.json()
        if (data?.base_resume) {
          setBaseResume(data.base_resume)
          localStorage.setItem('signalcv_base_resume', data.base_resume)
        } else {
          const stored = localStorage.getItem('signalcv_base_resume')
          if (stored) {
            setBaseResume(stored)
          }
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSaveResume = (text: string) => {
    localStorage.setItem('signalcv_base_resume', text)
    fetch('/api/base-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    }).catch(() => {})
    setBaseResume(text)
  }

  const handleClearResume = () => {
    localStorage.removeItem('signalcv_base_resume')
    setBaseResume(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted" />
      </div>
    )
  }

  if (!baseResume) {
    return <AtsScanner onSave={handleSaveResume} />
  }

  return (
    <TailoringWorkspace 
      baseResume={baseResume} 
      onClearBaseResume={handleClearResume} 
    />
  )
}

function AtsScanner({ onSave }: { onSave: (text: string) => void }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<AtsResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[] | null>(null)
  const [status, setStatus] = useState<AtsPipelineStatus>('idle')
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const runScan = (value: string) => {
    if (!value.trim()) {
      setResult(null)
      setSuggestions(null)
      setStatus('idle')
      return
    }
    setStatus('scanning')
    setTimeout(() => {
      const res = computeAtsScore(value)
      setResult(res)
      setSuggestions(null)
      if (res.passed) {
        setStatus('good')
        setTimeout(() => {
          setStatus('ready_good')
        }, 500)
      } else {
        setStatus('needs_work')
      }
    }, 600)
  }

  const handleScan = () => {
    runScan(text)
  }

  const handleAutoFix = () => {
    setStatus('fixing')
    const fix = autoFixResume(text)
    setSuggestions(fix.suggestions)
    setTimeout(() => {
      setStatus('ready_review')
    }, 800)
  }

  // Button Logic Helper
  const renderActionButtons = () => {
    if (!result) return null;
    
    if (result.passed) {
      return (
        <button 
          onClick={() => onSave(text)}
          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 animate-in fade-in zoom-in"
        >
          Continue
        </button>
      )
    }

    // Not passed (< 90)
    if (status === 'ready_review') {
      return (
        <button 
          onClick={() => setIsReviewOpen(true)}
          className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 animate-in fade-in zoom-in"
        >
          Review
        </button>
      )
    }

    if (status === 'needs_work') {
      return (
        <div className="flex gap-2">
          <button
            onClick={handleAutoFix}
            className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600"
          >
            Fix
          </button>
          <button
            onClick={() => onSave(text)}
            className="px-4 py-2 border border-default text-foreground text-sm font-semibold rounded-lg hover:bg-surface-hover"
          >
            Continue
          </button>
        </div>
      )
    }

    return null
  }

  useEffect(() => {
    if (!text.trim()) {
      setResult(null)
      setSuggestions(null)
      setStatus('idle')
      return
    }
    const handle = setTimeout(() => {
      runScan(text)
    }, 600)
    return () => clearTimeout(handle)
  }, [text])

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Resume Setup</h1>
        <p className="text-muted">Paste your base resume text to begin. We'll check it for ATS compatibility.</p>
      </div>

      <div className="space-y-4">
        <div
          className={cn(
            'w-full rounded-xl border border-dashed border-default bg-surface/80 transition-colors',
            isDragging ? 'border-brand-primary bg-surface' : ''
          )}
          onDragOver={(e: DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(e: DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            setIsDragging(false)
          }}
          onDrop={async (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files?.[0]
            if (file) {
              if (!isSupportedFileType(file)) {
                setFileError('That file type is not supported. Please upload a text, .docx, or .pdf file.')
                return
              }
              try {
                setIsReadingFile(true)
                setStatus('uploading')
                const fileText = await getFileText(file)
                setText(fileText)
                setFileError(null)
                runScan(fileText)
              } catch {
                setFileError('There was a problem reading that file.')
                setStatus('idle')
              } finally {
                setIsReadingFile(false)
              }
              return
            }
            const droppedText = e.dataTransfer.getData('text/plain')
            if (droppedText) {
              setText(droppedText)
              setFileError(null)
              runScan(droppedText)
            }
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste, drop, or upload your full resume text here..."
            className="w-full h-64 p-4 rounded-xl bg-transparent focus:ring-0 focus:border-transparent outline-none resize-y font-mono text-sm"
          />
          <div className="flex items-center justify-between border-t border-default/60 px-4 py-3 text-xs text-muted">
            <span>Paste text, drag &amp; drop a file, or upload from your computer.</span>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-default/70 px-3 py-1 text-[11px] font-medium hover:border-brand-primary hover:text-brand-primary">
              {isReadingFile ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Reading…
                </>
              ) : (
                <>
                  <span>Upload file</span>
                </>
              )}
              <input
                type="file"
                accept=".txt,.md,.docx,.pdf,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (!isSupportedFileType(file)) {
                    setFileError('That file type is not supported. Please upload a text, .docx, or .pdf file.')
                    e.target.value = ''
                    return
                  }
                  try {
                    setIsReadingFile(true)
                    setStatus('uploading')
                    const fileText = await getFileText(file)
                    setText(fileText)
                    setFileError(null)
                    runScan(fileText)
                  } catch {
                    setFileError('There was a problem reading that file.')
                    setStatus('idle')
                  } finally {
                    setIsReadingFile(false)
                  }
                  e.target.value = ''
                }}
              />
            </label>
          </div>
          {fileError && (
            <div className="px-4 pb-3 text-xs text-red-400">
              {fileError}
            </div>
          )}
        </div>

        <button
          onClick={handleScan}
          disabled={!text.trim()}
          className="w-full py-3 bg-brand-primary text-brand-inverse font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Scan Resume
        </button>
      </div>

      {result && (
        <div className={cn(
          "p-6 rounded-xl border animate-in fade-in slide-in-from-bottom-4",
          result.passed 
            ? "bg-green-500/10 border-green-500/20 text-green-500" 
            : "bg-red-500/10 border-red-500/20 text-red-500"
        )}>
          <div className="flex items-start gap-4">
            {result.passed ? <CheckCircle className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">ATS Score: {result.score}/100</h3>
                <div className="flex items-center gap-3">
                  {renderActionButtons()}
                </div>
              </div>
              <AtsStepper status={status} result={result} />
              
              {!result.passed && (
                <div className="space-y-1 text-sm text-foreground/80">
                  <p className="font-semibold text-red-400">Issues found:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg soft-card p-6 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">Review Suggestions</h2>
                <p className="text-muted text-sm">
                  Apply these fixes to improve your ATS score.
                </p>
              </div>
              <AnimatedButton variant="ghost" onClick={() => setIsReviewOpen(false)} className="px-2 py-1">
                <X className="w-5 h-5" />
              </AnimatedButton>
            </div>
            
            <div className="bg-surface-hover/50 p-4 rounded-lg border border-default/50 max-h-[300px] overflow-y-auto">
               <ul className="list-disc pl-5 space-y-2 text-sm">
                 {suggestions?.map((s, i) => (
                   <li key={i}>{s}</li>
                 ))}
               </ul>
            </div>

            <div className="flex justify-end gap-3">
              <AnimatedButton variant="ghost" onClick={() => setIsReviewOpen(false)} className="text-sm">
                Keep Editing
              </AnimatedButton>
              <AnimatedButton onClick={() => onSave(text)} className="text-sm">
                Continue
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TailoringWorkspace({ baseResume, onClearBaseResume }: { baseResume: string, onClearBaseResume: () => void }) {
  const [jd, setJd] = useState('')
  const [isTailoring, setIsTailoring] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [company, setCompany] = useState<string | null>(null)
  const [roleTitle, setRoleTitle] = useState<string | null>(null)
  const [tailoredResume, setTailoredResume] = useState<string | null>(null)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [recruiterDm, setRecruiterDm] = useState<string | null>(null)
  const [tailoredResumeId, setTailoredResumeId] = useState<string | null>(null)
  const [saved, setSaved] = useState<boolean | null>(null)
  const [saveReason, setSaveReason] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'resume' | 'cover' | 'dm'>('resume')
  const [isSaving, setIsSaving] = useState(false)
  
  const handleTailor = async () => {
    setIsTailoring(true)
    setError(null)
    setTailoredResume(null)
    setCoverLetter(null)
    setRecruiterDm(null)
    setTailoredResumeId(null)
    try {
      const keys = {
        openai: localStorage.getItem('signalcv_openai_key') || undefined,
        anthropic: localStorage.getItem('signalcv_anthropic_key') || undefined,
        gemini: localStorage.getItem('signalcv_gemini_key') || undefined,
        deepseek: localStorage.getItem('signalcv_deepseek_key') || undefined,
      }
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseResume, jd, keys }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Tailoring failed')
      }
      setSaved(Boolean(data.saved))
      setSaveReason(data.reason || null)
      setCompany(data.company || null)
      setRoleTitle(data.role_title || null)
      setTailoredResume(data.tailored_resume || '')
      setCoverLetter(data.cover_letter || '')
      setRecruiterDm(data.recruiter_dm || '')
      setTailoredResumeId(data.id || null)
      setActiveTab('resume')
    } catch (e: any) {
      setError(e?.message || 'Unexpected error')
    } finally {
      setIsTailoring(false)
    }
  }

  const handleSaveUpdates = async () => {
    setIsSaving(true)
    setError(null)
    try {
      const method = tailoredResumeId ? 'PATCH' : 'POST'
      const body = tailoredResumeId 
        ? { id: tailoredResumeId, tailoredResume, coverLetter, recruiterDm }
        : { 
            tailoredResume: tailoredResume || '', 
            coverLetter: coverLetter || '', 
            recruiterDm: recruiterDm || '',
            company,
            roleTitle,
            jd
          }

      const res = await fetch('/api/tailored-resume', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to save changes')
      }

      if (data.id) {
        setTailoredResumeId(data.id)
      }
      setSaved(true)
      setSaveReason(null)
    } catch (e: any) {
      setError(e?.message || 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Tailoring Workspace</h1>
          <p className="text-muted">Paste a job description to generate a tailored resume.</p>
        </div>
        <button 
          onClick={onClearBaseResume}
          className="text-sm text-muted hover:text-red-400 transition-colors"
        >
          Reset Base Resume
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-sm font-medium text-muted">Job Description</label>
          <div
            className={cn(
              'w-full min-h-[500px] rounded-xl border border-dashed border-default bg-surface/80 transition-colors flex flex-col',
              isDragging ? 'border-brand-primary bg-surface' : ''
            )}
            onDragOver={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault()
              setIsDragging(false)
            }}
            onDrop={async (e: DragEvent<HTMLDivElement>) => {
              e.preventDefault()
              setIsDragging(false)
              const file = e.dataTransfer.files?.[0]
              if (file) {
                if (!isSupportedFileType(file)) {
                  setFileError('That file type is not supported. Please upload a text, .docx, or .pdf file.')
                  return
                }
                try {
                  setIsReadingFile(true)
                  const fileText = await getFileText(file)
                  setJd(fileText)
                  setFileError(null)
                } catch {
                  setFileError('There was a problem reading that file.')
                } finally {
                  setIsReadingFile(false)
                }
                return
              }
              const droppedText = e.dataTransfer.getData('text/plain')
              if (droppedText) {
                setJd(droppedText)
                setFileError(null)
              }
            }}
          >
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste, drop, or upload a job description here..."
              className="w-full flex-1 p-4 rounded-xl bg-transparent focus:ring-0 focus:border-transparent outline-none resize-none font-mono text-sm"
            />
            <div className="flex items-center justify-between border-t border-default/60 px-4 py-3 text-xs text-muted">
              <span>Paste text, drag &amp; drop a file, or upload from your computer.</span>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-default/70 px-3 py-1 text-[11px] font-medium hover:border-brand-primary hover:text-brand-primary">
                {isReadingFile ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Reading…
                  </>
                ) : (
                  <>
                    <span>Upload file</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".txt,.md,text/plain"
                  className="hidden"
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (!isSupportedFileType(file)) {
                      setFileError('That file type is not supported. Please upload a text, .docx, or .pdf file.')
                      e.target.value = ''
                      return
                    }
                    try {
                      setIsReadingFile(true)
                      const fileText = await getFileText(file)
                      setJd(fileText)
                      setFileError(null)
                    } catch {
                      setFileError('There was a problem reading that file.')
                    } finally {
                      setIsReadingFile(false)
                    }
                    e.target.value = ''
                  }}
                />
              </label>
            </div>
            {fileError && (
              <div className="px-4 pb-3 text-xs text-red-400">
                {fileError}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-3">
            <AnimatedButton
              variant="ghost"
              onClick={() => setJd('')}
              className="text-sm"
            >
              Clear
            </AnimatedButton>
            <AnimatedButton
              onClick={handleTailor}
              disabled={!jd.trim() || isTailoring}
              loadingIcon={isTailoring ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            >
              Tailor Resume
            </AnimatedButton>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-muted">Output</label>
          <div className="w-full h-[500px] rounded-xl bg-surface border border-dashed border-default p-4 flex flex-col">
            {error && (
              <div className="text-red-400 text-sm mb-3">{error}</div>
            )}
            {saved === false && (
              <div className="text-yellow-400 text-xs mb-3 flex items-center justify-between">
                <span>Generated locally. {saveReason === 'profile_missing' ? 'Create your profile to enable saving and usage tracking.' : 'Not saved.'}</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('resume')}
                  className={cn(
                    'px-3 py-1 tab-pill',
                    activeTab === 'resume' ? 'tab-pill-active' : ''
                  )}
                >
                  Resume
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('cover')}
                  className={cn(
                    'px-3 py-1 tab-pill',
                    activeTab === 'cover' ? 'tab-pill-active' : ''
                  )}
                >
                  Cover Letter
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dm')}
                  className={cn(
                    'px-3 py-1 tab-pill',
                    activeTab === 'dm' ? 'tab-pill-active' : ''
                  )}
                >
                  Recruiter DM
                </button>
              </div>
              {(tailoredResume || coverLetter || recruiterDm) && (
                <AnimatedButton
                  onClick={handleSaveUpdates}
                  disabled={isSaving}
                  className="px-3 py-1 text-xs"
                  loadingIcon={isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                >
                  {saved ? 'Save Changes' : 'Save'}
                </AnimatedButton>
              )}
            </div>
            
            {(company || roleTitle) && (
              <div className="text-xs text-muted mb-2">
                {company && <span>Company: {company}</span>}
                {company && roleTitle && <span> · </span>}
                {roleTitle && <span>Role: {roleTitle}</span>}
              </div>
            )}
            
            <div className="flex-1 overflow-hidden relative">
              {activeTab === 'resume' && !tailoredResume && (
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  Generated content will appear here
                </div>
              )}
              {activeTab === 'cover' && !coverLetter && (
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  No cover letter generated yet
                </div>
              )}
              {activeTab === 'dm' && !recruiterDm && (
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  No recruiter DM generated yet
                </div>
              )}

              {activeTab === 'resume' && tailoredResume !== null && (
                <textarea
                  value={tailoredResume}
                  onChange={(e) => setTailoredResume(e.target.value)}
                  className="w-full h-full p-2 bg-transparent resize-none focus:outline-none focus:ring-0 font-mono text-sm"
                  placeholder="Edit your tailored resume..."
                />
              )}
              {activeTab === 'cover' && coverLetter !== null && (
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-full p-2 bg-transparent resize-none focus:outline-none focus:ring-0 font-mono text-sm"
                  placeholder="Edit your cover letter..."
                />
              )}
              {activeTab === 'dm' && recruiterDm !== null && (
                <textarea
                  value={recruiterDm}
                  onChange={(e) => setRecruiterDm(e.target.value)}
                  className="w-full h-full p-2 bg-transparent resize-none focus:outline-none focus:ring-0 font-mono text-sm"
                  placeholder="Edit your recruiter DM..."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
