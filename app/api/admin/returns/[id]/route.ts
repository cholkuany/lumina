import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import dbConnect from '@/lib/db/connection'
import ReturnRequest, { type ReturnRequestStatus } from '@/lib/db/models/ReturnRequest'

const TRANSITIONS: Record<ReturnRequestStatus, ReturnRequestStatus[]> = {
  pending: ['approved', 'rejected'],
  approved: ['received', 'rejected'],
  rejected: [],
  received: [],
}

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid return request ID' }, { status: 400 })
  }

  let body: { status?: ReturnRequestStatus; adminNote?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  await dbConnect()

  const returnRequest = await ReturnRequest.findById(id)
  if (!returnRequest) {
    return NextResponse.json({ error: 'Return request not found' }, { status: 404 })
  }

  if (!body.status || !TRANSITIONS[returnRequest.status].includes(body.status)) {
    return NextResponse.json({
      error: `Cannot change a ${returnRequest.status} return to ${body.status || 'that status'}`,
    }, { status: 409 })
  }

  returnRequest.adminNote = body.adminNote?.trim() || undefined
  returnRequest.status = body.status
  await returnRequest.save()

  return NextResponse.json({
    id: returnRequest._id.toString(),
    status: returnRequest.status,
    adminNote: returnRequest.adminNote,
  })
}
