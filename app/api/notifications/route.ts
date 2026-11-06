import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import { getUnreadNotifications, deleteAllReadNotifications, markAllNotificationsAsRead, getAllNotifications } from '@/lib/queries/notification.queries'

// Fetch unread notifications
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user && session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // const notifications = await getUnreadNotifications()
    const notifications = await getAllNotifications()
    const unreadCount = notifications.filter((n) => !n.read).length

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error('[GET /api/notifications]', error)
    return NextResponse.json(
      { error: 'Failed to fetch unread notifications' },
      { status: 500 }
    )
  }
}

// clear all read notifications
export async function DELETE() {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deleteAllReadNotifications()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/notifications]', error)
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    )
  }
}

// Read-all
export async function PATCH() {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await markAllNotificationsAsRead()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[PATCH /api/notifications/read-all]', error)
    return NextResponse.json(
      { error: 'Failed to mark all as read' },
      { status: 500 }
    )
  }
}