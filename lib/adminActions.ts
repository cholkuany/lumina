"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

import { buildEmailTemplate, transporter } from "./email"

export async function banUser(userId: string, banReason?: string) {
  const response = await auth.api.banUser({
    headers: await headers(),
    body: {
      userId,
      banReason,
    },
  })
  return response
}

export async function unbanUser(userId: string) {
  const response = await auth.api.unbanUser({
    headers: await headers(),
    body: { userId },
  })
  return response
}

export async function setUserRole(userId: string, role: "user" | "admin") {
  const response = await auth.api.setRole({
    headers: await headers(),
    body: { userId, role },
  })
  return response
}

export async function deleteUser(userId: string) {
  const response = await auth.api.removeUser({
    headers: await headers(),
    body: { userId },
  })
  return response
}

export async function revokeUserSessions(userId: string) {
  const response = await auth.api.revokeUserSessions({
    headers: await headers(),
    body: { userId },
  })
  return response
}

export async function impersonateUser(userId: string) {
  const response = await auth.api.impersonateUser({
    headers: await headers(),
    body: { userId },
  })
  return response
}

export async function sendEmailToUser(
  to: string,
  recipientName: string,
  subject: string,
  message: string,
) {
  const html = buildEmailTemplate({ recipientName, subject, message })

  const text = `Hi ${recipientName},\n\n${message}\n\nWarm regards,\nThe Lumina Team`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  })
}