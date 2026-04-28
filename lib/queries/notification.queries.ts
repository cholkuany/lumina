import dbConnect from '../db/connection'
import Notification, { NotificationType } from '../db/models/Notification'

export interface CreateNotificationInput {
  type: NotificationType
  message: string
  link?: string
}

// ── Create ────────────────────────────────────────────────
export async function createNotification(input: CreateNotificationInput) {
  await dbConnect()
  return Notification.create(input)
}

// ── Read ──────────────────────────────────────────────────
export async function getUnreadNotifications() {
  await dbConnect()
  return Notification.find({ read: false })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()
}

export async function getAllNotifications() {
  await dbConnect()
  return Notification.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()
}

export async function getUnreadCount() {
  await dbConnect()
  return Notification.countDocuments({ read: false })
}

// ── Update ────────────────────────────────────────────────
export async function markNotificationAsRead(id: string) {
  await dbConnect()
  return Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  ).lean()
}

export async function markAllNotificationsAsRead() {
  await dbConnect()
  return Notification.updateMany({ read: false }, { read: true })
}

// ── Delete ────────────────────────────────────────────────
export async function deleteNotification(id: string) {
  await dbConnect()
  return Notification.findByIdAndDelete(id)
}

export async function deleteAllReadNotifications() {
  await dbConnect()
  return Notification.deleteMany({ read: true })
}