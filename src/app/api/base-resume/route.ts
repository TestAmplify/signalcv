import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ base_resume: null })

  const { data } = await supabase
    .from('base_resumes')
    .select('content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ base_resume: data?.content ?? null })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = (await req.json()) as { content: string; title?: string }
  if (!body.content?.trim()) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('base_resumes')
    .insert({
      user_id: user.id,
      title: body.title || 'Base Resume',
      content: body.content,
    })
    .select('id, created_at')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data?.id, created_at: data?.created_at })
}

