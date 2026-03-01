import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Analyser une offre d'emploi ─────────────────────────────────────────────
async function analyzeJob(jobText: string, cvText: string) {
  const prompt = `You are an expert career coach and ATS specialist.

JOB OFFER:
${jobText}

CANDIDATE CV:
${cvText}

Analyze and respond in JSON only:
{
  "title": "exact job title",
  "company": "company name",
  "location": "location",
  "contract_type": "CDI|CDD|Freelance|Stage|Alternance|Full-time|Part-time",
  "salary": "salary range if mentioned",
  "skills_required": ["skill1", "skill2", ...],
  "match_score": 0-100,
  "match_analysis": "2-3 sentences explaining the match",
  "missing_skills": ["skill1", ...],
  "strengths": ["strength1", ...]
}`

  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
}

// ─── Adapter le CV à l'offre ─────────────────────────────────────────────────
async function tailorCV(cvData: object, jobAnalysis: object, locale: string) {
  const lang = locale === 'fr' ? 'French' : 'English'
  const prompt = `You are an expert CV writer and ATS specialist. 
  
Write the CV in ${lang}. Make it ATS-optimized by naturally incorporating keywords from the job offer.

ORIGINAL CV DATA:
${JSON.stringify(cvData, null, 2)}

JOB ANALYSIS:
${JSON.stringify(jobAnalysis, null, 2)}

Rewrite and optimize the CV. Return JSON with the same structure as the original CV but with:
- Rewritten professional summary targeting this specific job
- Experiences reordered/reworded to highlight relevant achievements
- Skills section prioritizing required skills
- ATS keywords naturally integrated
- Impact metrics added where possible (if not present, add realistic estimates)

Keep the same JSON structure as the original CV data but enhance the content.`

  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  return jsonMatch ? JSON.parse(jsonMatch[0]) : cvData
}

// ─── Générer la lettre de motivation ─────────────────────────────────────────
async function generateCoverLetter(cvData: object, jobAnalysis: object, locale: string) {
  const lang = locale === 'fr' ? 'French' : 'English'
  const isFr = locale === 'fr'

  const prompt = `You are an expert cover letter writer. Write a compelling, personalized cover letter in ${lang}.

CV DATA:
${JSON.stringify(cvData, null, 2)}

JOB ANALYSIS:
${JSON.stringify(jobAnalysis, null, 2)}

Write a ${isFr ? '300-400 word' : '300-400 word'} cover letter that:
- Opens with a strong, personalized hook (NOT "I am applying for...")
- Demonstrates genuine knowledge of the company/role
- Highlights 2-3 specific achievements that match the job requirements
- Shows personality and enthusiasm
- Ends with a confident call to action
- Uses a professional but human tone
- Is ATS-friendly

Format: Plain text with paragraph breaks. No placeholders. Write as if you ARE the candidate.`

  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  })

  return msg.content[0].type === 'text' ? msg.content[0].text : ''
}

// ─── Scraper une offre depuis une URL ────────────────────────────────────────
async function scrapeJobUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      }
    })
    const html = await res.text()
    // Extraire le texte principal (simplifié)
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000)
    return text
  } catch {
    return ''
  }
}

// ─── Route principale ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = await createAdminClient()
  const { data: { user } } = await (await import('@/lib/supabase/server')).createClient().then(c => c.auth.getUser())

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { action, jobText, jobUrl, cvId, locale = 'fr' } = body

  // Récupérer le CV actif
  let cvData = null
  let cvRawText = ''
  if (cvId) {
    const { data: cv } = await supabase.from('cvs').select('*').eq('id', cvId).single()
    cvData = cv?.parsed_data
    cvRawText = cv?.raw_text || ''
  } else {
    const { data: cv } = await supabase.from('cvs').select('*').eq('user_id', user.id).eq('is_active', true).single()
    cvData = cv?.parsed_data
    cvRawText = cv?.raw_text || ''
  }

  if (!cvData && !cvRawText) {
    return NextResponse.json({ error: 'No CV found. Please upload your CV first.' }, { status: 400 })
  }

  try {
    // 1. Obtenir le texte de l'offre
    let offerText = jobText || ''
    if (!offerText && jobUrl) {
      offerText = await scrapeJobUrl(jobUrl)
    }
    if (!offerText) return NextResponse.json({ error: 'No job offer text provided' }, { status: 400 })

    if (action === 'analyze') {
      // Analyser l'offre + calculer le matching
      const analysis = await analyzeJob(offerText, cvRawText || JSON.stringify(cvData))
      return NextResponse.json({ analysis })
    }

    if (action === 'tailor') {
      // Adapter le CV + générer la lettre
      const { jobAnalysis } = body
      const [tailoredCv, coverLetter] = await Promise.all([
        tailorCV(cvData || {}, jobAnalysis, locale),
        generateCoverLetter(cvData || {}, jobAnalysis, locale),
      ])
      return NextResponse.json({ tailoredCv, coverLetter })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('AI error:', error)
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 })
  }
}
