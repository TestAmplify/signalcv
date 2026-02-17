import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const fileEntry = formData.get('file')

  if (!fileEntry || !(fileEntry instanceof Blob)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const file = fileEntry as File
  const name = file.name.toLowerCase()
  const type = file.type
  const buffer = Buffer.from(await file.arrayBuffer())

  if (type.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.md')) {
    const text = buffer.toString('utf8')
    return NextResponse.json({ text })
  }

  if (name.endsWith('.docx')) {
    const mammothModule = await import('mammoth')
    const mammoth: any = (mammothModule as any).default ?? mammothModule
    const result = await mammoth.extractRawText({ buffer })
    return NextResponse.json({ text: result.value as string })
  }

  if (name.endsWith('.pdf')) {
    const pdfModule = await import('pdf-parse' as string)
    const pdfParse: any = (pdfModule as any).default ?? pdfModule
    const parsed = await pdfParse(buffer)
    return NextResponse.json({ text: parsed.text as string })
  }

  return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
}
