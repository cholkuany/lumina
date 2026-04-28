import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import {
  markNotificationAsRead,
  deleteNotification,
} from '@/lib/queries/notification.queries'

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notification = await markNotificationAsRead(id)
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('[PATCH /api/notifications/:id]', error)
    return NextResponse.json(
      { error: 'Failed to mark as read' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deleteNotification(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/notifications/:id]', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}