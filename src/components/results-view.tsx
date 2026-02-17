'use client'

import { useState, useMemo } from 'react'
import { ResultsCard } from '@/components/results-card'
import { ResultsRow } from '@/components/results-row'
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

export function ResultsView({ items }: { items: Item[] }) {
  const [view, setView] = useState<'cards' | 'list'>('cards')

  const groups = useMemo(() => {
    const map = new Map<string, Item[]>()
    for (const p of items || []) {
      const key = p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : 'Unknown'
      const arr = map.get(key) || []
      arr.push(p)
      map.set(key, arr)
    }
    return Array.from(map.entries()).sort(([a], [b]) => (a > b ? -1 : 1))
  }, [items])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tailored Projects</h1>
        <div className="flex items-center gap-2">
          <AnimatedButton
            variant={view === 'cards' ? 'primary' : 'ghost'}
            className="px-3 py-1 text-xs"
            onClick={() => setView('cards')}
          >
            Cards
          </AnimatedButton>
          <AnimatedButton
            variant={view === 'list' ? 'primary' : 'ghost'}
            className="px-3 py-1 text-xs"
            onClick={() => setView('list')}
          >
            List
          </AnimatedButton>
        </div>
      </div>

      {groups.map(([day, dayItems]) => (
        <section key={day} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-primary">{day}</h2>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          {view === 'cards' ? (
            <div className="grid gap-4 md:grid-cols-2">
              {dayItems.map((p) => (
                <ResultsCard key={p.id} item={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {dayItems.map((p) => (
                <ResultsRow key={p.id} item={p} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
