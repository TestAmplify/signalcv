import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/profile'

export const runtime = 'nodejs'

type Provider = 'openai' | 'anthropic' | 'gemini' | 'deepseek' | 'none'

async function callModel(provider: Provider, key: string, prompt: string): Promise<string> {
  switch (provider) {
    case 'openai': {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert resume tailor. Return concise, structured outputs.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        }),
      })
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content
      if (!text) throw new Error('OpenAI response invalid')
      return text as string
    }
    case 'anthropic': {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      const text = data?.content?.[0]?.text
      if (!text) throw new Error('Anthropic response invalid')
      return text as string
    }
    case 'gemini': {
      // Gemini REST (v1beta) text models via "generateContent"
      const apiKey = key
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      })
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Gemini response invalid')
      return text as string
    }
    case 'deepseek': {
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are an expert resume tailor. Return concise, structured outputs.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        }),
      })
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content
      if (!text) throw new Error('DeepSeek response invalid')
      return text as string
    }
    case 'none':
    default: {
      // Heuristic fallback: basic tailoring without an API key
      return [
        'TAILORED RESUME:',
        '- Objective: Align accomplishments to the JD using quantified bullets.',
        '- Skills: Emphasize relevant tools and frameworks mentioned in JD.',
        '',
        'COVER LETTER:',
        'Introduce yourself, connect experience to JD requirements, highlight 2–3 quantified wins, close with availability.',
        '',
        'RECRUITER DM:',
        'Short note referencing the role, 1 quantified achievement, and request for 10–15 min chat.',
      ].join('\n')
    }
  }
}

function extractCompanyAndRole(jd: string) {
  const lines = jd.split('\n').map((l) => l.trim())
  let role = ''
  let company = ''
  for (const l of lines) {
    const mRole = l.match(/(Job\s*Title|Role|Position)\s*:\s*(.+)/i)
    if (mRole && !role) role = mRole[2].trim()
    const mCompany = l.match(/(Company|Employer)\s*:\s*(.+)/i)
    if (mCompany && !company) company = mCompany[2].trim()
  }
  // Fallback guesses
  if (!role) {
    const m = jd.match(/Automation Test Engineer|Software Engineer|Product Manager|Data Scientist/i)
    role = m ? m[0] : 'Target Role'
  }
  if (!company) {
    const m = jd.match(/\b[A-Z][A-Za-z0-9&]+\b(?:\s+Inc\.|\s+LLC)?/)
    company = m ? m[0] : 'Target Company'
  }
  return { role_title: role, company }
}

function splitOutputs(text: string) {
  const lower = text.toLowerCase()
  const idxResume = lower.indexOf('tailored resume')
  const idxCover = lower.indexOf('cover letter')
  const idxDm = lower.indexOf('recruiter dm')

  if (idxResume === -1 && idxCover === -1 && idxDm === -1) {
    return {
      tailoredResume: text,
      coverLetter: '',
      recruiterDm: '',
    }
  }

  const end = text.length
  const resumeStart = idxResume !== -1 ? idxResume : 0
  const coverStart = idxCover !== -1 ? idxCover : end
  const dmStart = idxDm !== -1 ? idxDm : end

  const resumeEnd = Math.min(coverStart, dmStart, end)
  const coverEnd = Math.min(dmStart, end)

  const tailoredResume = text.slice(resumeStart, resumeEnd).trim()
  const coverLetter =
    coverStart < end ? text.slice(coverStart, coverEnd).trim() : ''
  const recruiterDm = dmStart < end ? text.slice(dmStart).trim() : ''

  return { tailoredResume, coverLetter, recruiterDm }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = (await req.json()) as {
      baseResume: string
      jd: string
      keys?: {
        openai?: string
        anthropic?: string
        gemini?: string
        deepseek?: string
      }
      provider?: Provider
    }
    const { baseResume, jd, keys = {}, provider } = body
    if (!baseResume || !jd) {
      return NextResponse.json({ error: 'Missing baseResume or jd' }, { status: 400 })
    }

    let profile
    try {
      profile = await ensureProfile(supabase, user)
    } catch (e) {
      console.error('Failed to ensure profile:', e)
      profile = null
    }
    const profileMissing = !profile

    // Daily usage check
    const today = new Date().toISOString().slice(0, 10)
    let usage = null
    
    if (!profileMissing) {
      const { data: u } = await supabase
        .from('daily_usage')
        .select('id, used, "limit", override_by_admin')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()
      usage = u
      
      if (usage && !usage.override_by_admin && usage.used >= usage.limit) {
        return NextResponse.json(
          { error: `Daily limit reached (${usage.used}/${usage.limit})` },
          { status: 429 }
        )
      }
    }

    const { role_title, company } = extractCompanyAndRole(jd)

    const adminOpenAI = process.env.ADMIN_OPENAI_KEY || process.env.ADMIN_KEY
    const adminAnthropic = process.env.ADMIN_ANTHROPIC_KEY
    const adminGemini = process.env.ADMIN_GEMINI_KEY
    const adminDeepseek = process.env.ADMIN_DEEPSEEK_KEY

    let chosenProvider: Provider = provider || 'none'
    let chosenKey = ''
    const pick = (...pairs: Array<[Provider, string | undefined]>) => {
      for (const [prov, k] of pairs) {
        if (k) {
          chosenProvider = prov
          chosenKey = k
          break
        }
      }
    }
    if (chosenProvider === 'none') {
      pick(
        ['openai', adminOpenAI],
        ['anthropic', adminAnthropic],
        ['gemini', adminGemini],
        ['deepseek', adminDeepseek],
        ['openai', keys.openai],
        ['anthropic', keys.anthropic],
        ['gemini', keys.gemini],
        ['deepseek', keys.deepseek]
      )
    }

    const prompt = [
      `Tailor the following base resume to the job description.`,
      `Return three sections:`,
      `1) TAILORED RESUME`,
      `2) COVER LETTER`,
      `3) RECRUITER DM`,
      `Company: ${company}`,
      `Role: ${role_title}`,
      `Base Resume:`,
      baseResume,
      `Job Description:`,
      jd,
      `Constraints: quantified achievements, ATS-friendly formatting, no tables, clear section headers.`,
    ].join('\n\n')

    const modelOutput = await callModel(chosenProvider, chosenKey, prompt)
    const { tailoredResume, coverLetter, recruiterDm } = splitOutputs(modelOutput)

    // If profile is missing, still return content but skip DB writes
    if (profileMissing || !profile) {
      return NextResponse.json({
        saved: false,
        reason: 'profile_missing',
        company,
        role_title,
        tailored_resume: tailoredResume,
        cover_letter: coverLetter,
        recruiter_dm: recruiterDm,
      })
    }

    // Increment usage
    if (!usage) {
      await supabase.from('daily_usage').insert({
        tenant_id: profile.tenant_id,
        user_id: user.id,
        date: today,
        used: 1,
      })
    } else {
      await supabase.from('daily_usage').update({ used: (usage.used ?? 0) + 1 }).eq('id', usage.id)
    }

    // Insert resume row
    const { data: inserted, error: insertError } = await supabase
      .from('tailored_resumes')
      .insert({
        tenant_id: profile.tenant_id,
        user_id: user.id,
        company,
        role_title,
        jd_text: jd,
        tailored_resume: tailoredResume,
        cover_letter: coverLetter,
        recruiter_dm: recruiterDm,
        status: 'draft',
      })
      .select('id, created_at')
      .maybeSingle()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      saved: true,
      id: inserted?.id,
      company,
      role_title,
      tailored_resume: tailoredResume,
      cover_letter: coverLetter,
      recruiter_dm: recruiterDm,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 })
  }
}
