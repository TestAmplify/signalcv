import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/profile'

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = (await req.json()) as {
      id: string
      tailoredResume?: string
      coverLetter?: string
      recruiterDm?: string
      status?:
        | 'draft'
        | 'applied'
        | 'interview'
        | 'rejected'
        | 'accepted'
        | 'no_reply'
    }
    const { id, tailoredResume, coverLetter, recruiterDm, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('tailored_resumes')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
    }

    const updates: {
      tailored_resume?: string
      cover_letter?: string
      recruiter_dm?: string
      status?:
        | 'draft'
        | 'applied'
        | 'interview'
        | 'rejected'
        | 'accepted'
        | 'no_reply'
    } = {}
    if (tailoredResume !== undefined) updates.tailored_resume = tailoredResume
    if (coverLetter !== undefined) updates.cover_letter = coverLetter
    if (recruiterDm !== undefined) updates.recruiter_dm = recruiterDm
    if (status !== undefined) updates.status = status

    const { error } = await supabase
      .from('tailored_resumes')
      .update(updates)
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = (await req.json()) as {
      company?: string
      roleTitle?: string
      jd?: string
      tailoredResume: string
      coverLetter: string
      recruiterDm: string
    }
    const { company, roleTitle, jd, tailoredResume, coverLetter, recruiterDm } = body

    let profile
    try {
      profile = await ensureProfile(supabase, user)
    } catch (e: any) {
      console.error('Failed to ensure profile:', e)
      return NextResponse.json({ error: 'Failed to create profile. Please contact support or try again.' }, { status: 500 })
    }

    const { data: inserted, error } = await supabase
      .from('tailored_resumes')
      .insert({
        tenant_id: profile.tenant_id,
        user_id: user.id,
        company: company || 'Unknown Company',
        role_title: roleTitle || 'Unknown Role',
        jd_text: jd || '',
        tailored_resume: tailoredResume,
        cover_letter: coverLetter,
        recruiter_dm: recruiterDm,
        status: 'draft',
      })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: inserted.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 })
  }
}
