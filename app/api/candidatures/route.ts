import { NextRequest, NextResponse } from 'next/server'

// Demo data — no DB needed for the UI
const DEMO: any[] = [
  {
    id: '1',
    status: 'interview',
    notes: null,
    applied_at: '2024-03-08T10:00:00Z',
    last_action_at: '2024-03-10T14:00:00Z',
    job_offers: { title: 'Développeur Full-Stack', company: 'Spendesk', location: 'Paris', source_url: null, match_score: 88 },
  },
  {
    id: '2',
    status: 'pending',
    notes: null,
    applied_at: '2024-03-06T09:30:00Z',
    last_action_at: '2024-03-06T09:30:00Z',
    job_offers: { title: 'Lead Frontend React', company: 'Alan', location: 'Remote', source_url: null, match_score: 92 },
  },
  {
    id: '3',
    status: 'offer',
    notes: 'Super entretien !',
    applied_at: '2024-03-01T11:00:00Z',
    last_action_at: '2024-03-12T16:00:00Z',
    job_offers: { title: 'Product Engineer', company: 'Pennylane', location: 'Paris', source_url: null, match_score: 75 },
  },
  {
    id: '4',
    status: 'pending',
    notes: null,
    applied_at: '2024-02-28T08:00:00Z',
    last_action_at: '2024-02-28T08:00:00Z',
    job_offers: { title: 'Software Engineer', company: 'Contentsquare', location: 'Lyon', source_url: null, match_score: null },
  },
  {
    id: '5',
    status: 'rejected',
    notes: 'Pas de feedback.',
    applied_at: '2024-02-25T14:00:00Z',
    last_action_at: '2024-03-05T10:00:00Z',
    job_offers: { title: 'Backend Engineer Node.js', company: 'PayFit', location: 'Bordeaux', source_url: null, match_score: null },
  },
]

// In-memory store (resets on cold start — fine for demo)
let store = [...DEMO]

export async function GET() {
  return NextResponse.json(store)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newApp = {
      id: crypto.randomUUID(),
      status: body.status || 'pending',
      notes: body.notes || null,
      applied_at: new Date().toISOString(),
      last_action_at: new Date().toISOString(),
      job_offers: {
        title: body.title || 'Poste non renseigné',
        company: body.company || null,
        location: body.location || null,
        source_url: body.source_url || null,
        match_score: null,
      },
    }
    store.unshift(newApp)
    return NextResponse.json(newApp, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}
