import { createClient } from '@/lib/supabase/server'
import { ResultsView } from '@/components/results-view'

export default async function ResultsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tailored Resumes</h1>
        <p className="text-muted">You must be logged in to view your tailored projects.</p>
      </div>
    )
  }

  const { data: projects } = await supabase
    .from('tailored_resumes')
    .select('id, company, role_title, status, created_at, tailored_resume, cover_letter, recruiter_dm')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  type P = {
    id: string
    company: string
    role_title: string
    status:
      | 'draft'
      | 'applied'
      | 'interview'
      | 'accepted'
      | 'rejected'
      | 'no_reply'
    created_at: string | null
    tailored_resume: string | null
    cover_letter: string | null
    recruiter_dm: string | null
  }
  return (
    <div className="space-y-6">
      {!projects || projects.length === 0 ? (
        <div className="rounded-xl border border-default bg-surface p-8 text-center text-muted">
          No tailored projects yet. Start by tailoring a resume in the workspace.
        </div>
      ) : (
        <ResultsView items={(projects as P[]) ?? []} />
      )}
    </div>
  )
}
