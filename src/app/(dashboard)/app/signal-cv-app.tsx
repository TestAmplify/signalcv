'use client'

import { useState, useEffect, DragEvent, ChangeEvent } from 'react'
import { computeAtsScore, type AtsResult } from '@/lib/ats'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    // Load from localStorage on mount
    const stored = localStorage.getItem('signalcv_base_resume')
    if (stored) {
      setBaseResume(stored)
    }
    setLoading(false)
  }, [])

  const handleSaveResume = (text: string) => {
    localStorage.setItem('signalcv_base_resume', text)
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

  const handleScan = () => {
    const res = computeAtsScore(text)
    setResult(res)
    if (res.passed) {
      // Automatically save if passed? Or let user click "Continue"?
      // BUILD.md: "If score >= 90 -> mark as READY."
      // Let's show success and a button to proceed.
    }
  }

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
                const fileText = await getFileText(file)
                setText(fileText)
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
              setText(droppedText)
              setFileError(null)
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
                    const fileText = await getFileText(file)
                    setText(fileText)
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
                {result.passed && (
                  <button 
                    onClick={() => onSave(text)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"
                  >
                    Continue
                  </button>
                )}
              </div>
              
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
    </div>
  )
}

function TailoringWorkspace({ baseResume, onClearBaseResume }: { baseResume: string, onClearBaseResume: () => void }) {
  const [jd, setJd] = useState('')
  const [isTailoring, setIsTailoring] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  
  const handleTailor = async () => {
    setIsTailoring(true)
    // TODO: Implement tailoring logic
    await new Promise(r => setTimeout(r, 2000)) // Simulation
    setIsTailoring(false)
    alert('Tailoring not implemented yet!')
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
              'w-full h-[500px] rounded-xl border border-dashed border-default bg-surface/80 transition-colors',
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
              className="w-full h-full p-4 rounded-xl bg-transparent focus:ring-0 focus:border-transparent outline-none resize-none font-mono text-sm"
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
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setJd('')}
              className="px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleTailor}
              disabled={!jd.trim() || isTailoring}
              className="px-6 py-2 bg-brand-primary text-brand-inverse font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isTailoring && <Loader2 className="w-4 h-4 animate-spin" />}
              Tailor Resume
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-muted">Output</label>
          <div className="w-full h-[500px] rounded-xl bg-surface border border-dashed border-default flex items-center justify-center text-muted">
            Generated content will appear here
          </div>
        </div>
      </div>
    </div>
  )
}
