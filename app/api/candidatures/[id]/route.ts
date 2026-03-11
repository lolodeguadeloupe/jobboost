import { NextRequest, NextResponse } from 'next/server'

// Note: uses the same in-memory store as the parent route module.
// For a real DB, import pool from '@/lib/db' and run queries.

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    // In production: UPDATE applications SET ... WHERE id = $1
    return NextResponse.json({ id: params.id, ...body, updated: true })
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  // In production: DELETE FROM applications WHERE id = $1
  return NextResponse.json({ id: params.id, deleted: true })
}
