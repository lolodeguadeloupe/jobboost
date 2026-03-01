import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Parser le CV avec l'IA après extraction du texte
async function parseCV(rawText: string): Promise<object> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const msg = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Extract and structure this CV into JSON. Be thorough and preserve all information.

CV TEXT:
${rawText.substring(0, 6000)}

Return ONLY valid JSON with this structure:
{
  "personal": {
    "name": "", "email": "", "phone": "", "location": "",
    "linkedin": "", "website": "", "github": "",
    "title": "", "summary": ""
  },
  "experience": [
    {
      "company": "", "title": "", "location": "",
      "start_date": "", "end_date": "", "current": false,
      "description": "", "achievements": []
    }
  ],
  "education": [
    { "institution": "", "degree": "", "field": "", "start_date": "", "end_date": "", "gpa": "" }
  ],
  "skills": {
    "technical": [], "soft": [], "tools": [], "other": []
  },
  "languages": [
    { "language": "", "level": "" }
  ],
  "certifications": [
    { "name": "", "issuer": "", "date": "", "url": "" }
  ],
  "projects": [
    { "name": "", "description": "", "url": "", "technologies": [] }
  ]
}`
    }]
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
}

export async function POST(request: NextRequest) {
  const supabase = await createAdminClient()

  // Vérifier auth
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  let rawText = ''

  try {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(buffer)
      rawText = data.text
    } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      rawText = result.value
    } else {
      return NextResponse.json({ error: 'Format non supporté. Utilisez PDF ou Word.' }, { status: 400 })
    }
  } catch (err) {
    return NextResponse.json({ error: 'Erreur lors de la lecture du fichier' }, { status: 500 })
  }

  if (!rawText.trim()) return NextResponse.json({ error: 'Impossible d\'extraire le texte du CV' }, { status: 400 })

  // Parser avec IA
  let parsedData = {}
  try {
    parsedData = await parseCV(rawText)
  } catch (err) {
    console.error('Parse error:', err)
  }

  // Upload dans Storage
  const fileName = `${user.id}/${Date.now()}-${file.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('cvs')
    .upload(fileName, buffer, { contentType: file.type })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('cvs').getPublicUrl(fileName)

  // Désactiver les anciens CVs
  await supabase.from('cvs').update({ is_active: false }).eq('user_id', user.id)

  // Sauvegarder en base
  const { data: cv, error: dbError } = await supabase.from('cvs').insert({
    user_id: user.id,
    name: file.name.replace(/\.[^/.]+$/, ''),
    original_url: publicUrl,
    parsed_data: parsedData,
    raw_text: rawText.substring(0, 10000),
    is_active: true,
  }).select().single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ cv, parsedData }, { status: 201 })
}

export async function GET(request: NextRequest) {
  const supabase = await createAdminClient()
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  const { data: { user } } = await supabase.auth.getUser(token || '')
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: cvs } = await supabase.from('cvs').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  return NextResponse.json({ cvs })
}
