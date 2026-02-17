'use client'

import { useState } from 'react'
import { Copy, Download, Check } from 'lucide-react'
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

export function ResultsRow({ item }: { item: Item }) {
  const [status, setStatus] = useState<Status>(item.status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveStatus = async () => {
    try {
      setSaving(true)
      setError(null)
      const res = await fetch('/api/tailored-resume', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to save')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to save'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text || '')
      setError(null)
    } catch {
      setError('Failed to copy')
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
    <div className="flex items-center gap-3 rounded-xl border border-default bg-surface px-4 py-3 text-xs">
      <div className="flex-1 min-w-0">
        <p className="truncate text-primary font-medium">
          {item.company} · {item.role_title}
        </p>
        <p className="truncate text-muted">
          {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="h-8 rounded-lg border border-default bg-surface px-2"
          disabled={saving}
        >
          <option value="draft">Draft</option>
          <option value="applied">Applied</option>
          <option value="interview">Interviewed</option>
          <option value="accepted">Hired</option>
          <option value="rejected">Rejected</option>
          <option value="no_reply">No Reply</option>
        </select>
        <AnimatedButton onClick={saveStatus} disabled={saving} className="px-3 py-1 flex items-center gap-1" title="Save">
          <Check className="w-3 h-3" aria-hidden />
        </AnimatedButton>
      </div>
      <div className="flex items-center gap-2">
        <AnimatedButton
          variant="ghost"
          className="px-3 py-1 flex items-center gap-1"
          onClick={() => copyText(item.tailored_resume || '')}
          title="Copy Resume"
        >
          <Copy className="w-3 h-3" aria-hidden />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          className="px-3 py-1 flex items-center gap-1"
          onClick={() => downloadText('Resume', item.tailored_resume || '')}
          title="Download Resume"
        >
          <Download className="w-3 h-3" aria-hidden />
        </AnimatedButton>
      </div>
      <div className="flex items-center gap-2">
        <AnimatedButton
          variant="ghost"
          className="px-3 py-1 flex items-center gap-1"
          onClick={() => copyText(item.cover_letter || '')}
          title="Copy Cover Letter"
        >
          <Copy className="w-3 h-3" aria-hidden />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          className="px-3 py-1 flex items-center gap-1"
          onClick={() => downloadText('Cover-Letter', item.cover_letter || '')}
          title="Download Cover Letter"
        >
          <Download className="w-3 h-3" aria-hidden />
        </AnimatedButton>
      </div>
      <div className="flex items-center gap-2">
        <AnimatedButton
          variant="ghost"
          className="px-3 py-1 flex items-center gap-1"
          onClick={() => copyText(item.recruiter_dm || '')}
          title="Copy Recruiter DM"
        >
          <Copy className="w-3 h-3" aria-hidden />
        </AnimatedButton>
        <AnimatedButton
          variant="ghost"
          className="px-3 py-1 flex items-center gap-1"
          onClick={() => downloadText('Recruiter-DM', item.recruiter_dm || '')}
          title="Download Recruiter DM"
        >
          <Download className="w-3 h-3" aria-hidden />
        </AnimatedButton>
      </div>
      {error && <div className="text-red-400">{error}</div>}
    </div>
  )
}
