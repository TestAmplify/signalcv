'use client'

import { useState } from 'react'
import { Copy, Download, Pencil, Check } from 'lucide-react'
import { AnimatedButton } from '@/components/ui/animated-button'

type Status = 'draft' | 'applied' | 'interview' | 'accepted' | 'rejected' | 'no_reply'

type Item = {
  id: string
  company: string
  role_title: string
  status: Status
  created_at: string | null
  tailored_resume: string | null
  cover_letter: string | null
  recruiter_dm: string | null
}

export function ResultsCard({ item }: { item: Item }) {
  const [editing, setEditing] = useState(false)
  const [resume, setResume] = useState(item.tailored_resume ?? '')
  const [cover, setCover] = useState(item.cover_letter ?? '')
  const [dm, setDm] = useState(item.recruiter_dm ?? '')
  const [status, setStatus] = useState<Status>(item.status ?? 'draft')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const save = async () => {
    try {
      setSaving(true)
      setError(null)
      const res = await fetch('/api/tailored-resume', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          tailoredResume: resume,
          coverLetter: cover,
          recruiterDm: dm,
          status,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to save')
      setEditing(false)
      setSavedAt(new Date().toISOString())
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to save'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleString() : '')

  const copyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text || '')
      setError(null)
    } catch {
      setError(`Failed to copy ${label}`)
    }
  }

  const downloadText = (label: string, text: string) => {
    const blob = new Blob([text || ''], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const name = `${item.company || 'Company'}_${item.role_title || 'Role'}_${label.replace(/\s+/g, '-')}.txt`
    a.download = name
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
  }

  return (
    <div className="soft-card p-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary">
            {item.company} <span className="text-muted">·</span> {item.role_title}
          </p>
          <p className="text-xs text-muted">
            {fmtDate(item.created_at)}
            {savedAt && <span className="ml-2">· Updated {fmtDate(savedAt)}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="h-8 rounded-lg border border-default bg-surface px-2 text-xs"
            disabled={saving}
          >
            <option value="draft">Draft</option>
            <option value="applied">Applied</option>
            <option value="interview">Interviewed</option>
            <option value="accepted">Hired</option>
            <option value="rejected">Rejected</option>
            <option value="no_reply">No Reply</option>
          </select>
          <AnimatedButton
            variant="ghost"
            onClick={() => setEditing((v) => !v)}
            className="px-3 py-1 text-xs flex items-center gap-1"
            title="Edit"
          >
            <Pencil className="w-3 h-3" aria-hidden />
          </AnimatedButton>
          <AnimatedButton
            onClick={save}
            disabled={saving}
            className="px-3 py-1 text-xs flex items-center gap-1"
            title="Save"
          >
            <Check className="w-3 h-3" aria-hidden />
          </AnimatedButton>
        </div>
      </div>
      {error && <div className="text-xs text-red-400">{error}</div>}
      <details className="mt-2 text-sm group open:space-y-3">
        <summary className="cursor-pointer text-xs text-muted hover:text-primary">
          View {editing ? 'and Edit ' : ''} Resume, Cover Letter & Recruiter DM
        </summary>
        <div className="grid gap-4 md:grid-cols-3 text-xs">
          <div className="space-y-1">
            <p className="font-semibold text-primary text-xs">Resume</p>
            <div className="flex items-center gap-2 mb-1">
              <AnimatedButton
                variant="ghost"
                className="px-2 py-1 text-[10px] flex items-center gap-1"
                onClick={() => copyText('Resume', resume)}
                title="Copy Resume"
              >
                <Copy className="w-3 h-3" aria-hidden />
              </AnimatedButton>
              <AnimatedButton
                variant="ghost"
                className="px-2 py-1 text-[10px] flex items-center gap-1"
                onClick={() => downloadText('Resume', resume)}
                title="Download Resume"
              >
                <Download className="w-3 h-3" aria-hidden />
              </AnimatedButton>
            </div>
            {editing ? (
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="min-h-28 w-full rounded-lg border border-default bg-bg-canvas p-3"
              />
            ) : (
              <pre className="whitespace-pre-wrap rounded-lg border border-default/60 bg-bg-canvas p-3 max-h-64 overflow-auto">
                {resume || '—'}
              </pre>
            )}
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-primary text-xs">Cover Letter</p>
            <div className="flex items-center gap-2 mb-1">
              <AnimatedButton
                variant="ghost"
                className="px-2 py-1 text-[10px] flex items-center gap-1"
                onClick={() => copyText('Cover-Letter', cover)}
                title="Copy Cover Letter"
              >
                <Copy className="w-3 h-3" aria-hidden />
              </AnimatedButton>
              <AnimatedButton
                variant="ghost"
                className="px-2 py-1 text-[10px] flex items-center gap-1"
                onClick={() => downloadText('Cover-Letter', cover)}
                title="Download Cover Letter"
              >
                <Download className="w-3 h-3" aria-hidden />
              </AnimatedButton>
            </div>
            {editing ? (
              <textarea
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                className="min-h-28 w-full rounded-lg border border-default bg-bg-canvas p-3"
              />
            ) : (
              <pre className="whitespace-pre-wrap rounded-lg border border-default/60 bg-bg-canvas p-3 max-h-64 overflow-auto">
                {cover || '—'}
              </pre>
            )}
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-primary text-xs">Recruiter DM</p>
            <div className="flex items-center gap-2 mb-1">
              <AnimatedButton
                variant="ghost"
                className="px-2 py-1 text-[10px] flex items-center gap-1"
                onClick={() => copyText('Recruiter-DM', dm)}
                title="Copy Recruiter DM"
              >
                <Copy className="w-3 h-3" aria-hidden />
              </AnimatedButton>
              <AnimatedButton
                variant="ghost"
                className="px-2 py-1 text-[10px] flex items-center gap-1"
                onClick={() => downloadText('Recruiter-DM', dm)}
                title="Download Recruiter DM"
              >
                <Download className="w-3 h-3" aria-hidden />
              </AnimatedButton>
            </div>
            {editing ? (
              <textarea
                value={dm}
                onChange={(e) => setDm(e.target.value)}
                className="min-h-28 w-full rounded-lg border border-default bg-bg-canvas p-3"
              />
            ) : (
              <pre className="whitespace-pre-wrap rounded-lg border border-default/60 bg-bg-canvas p-3 max-h-64 overflow-auto">
                {dm || '—'}
              </pre>
            )}
          </div>
        </div>
      </details>
    </div>
  )
}
