"use client"

import { X, ShieldCheck, Mail, Check, Info } from "lucide-react"

import { useState } from "react"
import { User } from "@/lib/auth"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { Button } from "@/components/ui/Button"
import { useUserActions } from "@/hooks/useUserActions"
import { ConfirmModal } from "@/components/admin/ConfirmModal"
import { sendEmailToUser } from "@/lib/adminActions"
import { cn } from "@/lib/utils"

interface UserDetailModalProps {
  user: User
  onClose: () => void
  onChangeRole: () => void
}

type ActiveTab = "overview" | "security"

interface EmailForm {
  subject: string
  message: string
}

const EMAIL_TEMPLATES = [
  {
    label: "Order update",
    subject: "An update on your order",
    message: "We wanted to reach out with an update regarding your recent order. Please don't hesitate to contact us if you have any questions.",
  },
  {
    label: "Account notice",
    subject: "Important notice about your account",
    message: "We're writing to inform you of an important update regarding your account. If you have any concerns, our support team is happy to help.",
  },
  {
    label: "Special offer",
    subject: "A special offer just for you ✨",
    message: "As a valued customer, we'd like to offer you an exclusive treat. Visit our store to discover something we think you'll love.",
  },
] as const
// ─────────────────────────────────────────────────────────────────────────────

export function UserDetailModal({ user, onClose, onChangeRole }: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview")
  const [banReason, setBanReason] = useState("")
  const [showBanConfirm, setShowBanConfirm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // ── NEW email state ─────────────────────────────────────────────────────────
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailForm, setEmailForm] = useState<EmailForm>({ subject: "", message: "" })
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [emailError, setEmailError] = useState("")
  // ───────────────────────────────────────────────────────────────────────────

  const { ban, unban, remove, revokeSessions } = useUserActions()

  const isBanned = !!user.banned
  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase()

  const handleBan = async () => {
    await ban.mutateAsync({ userId: user.id, reason: banReason || undefined });
    setShowBanConfirm(false); onClose()
  }
  const handleUnban = async () => { await unban.mutateAsync({ userId: user.id }); onClose() }
  const handleDelete = async () => {
    await remove.mutateAsync({ userId: user.id });
    setConfirmDelete(false); onClose()
  }

  const canSendEmail =
    emailForm.subject.trim().length > 0 && emailForm.message.trim().length > 0

  const handleSendEmail = async () => {
    if (!canSendEmail) return

    setEmailStatus("sending")
    setEmailError("")

    try {
      await sendEmailToUser(
        user.email,
        user.name.split(" ")[0],
        emailForm.subject,
        emailForm.message,
      )
      setEmailStatus("sent")
      setTimeout(() => {
        setShowEmailForm(false)
        setEmailStatus("idle")
        setEmailForm({ subject: "", message: "" })
      }, 2000)
    } catch (err) {
      setEmailStatus("error")
      setEmailError(err instanceof Error ? err.message : "Failed to send. Please try again.")
    }
  }

  const toggleEmailForm = () => {
    setShowEmailForm((v) => !v)
    setEmailStatus("idle")
    setEmailError("")
    setEmailForm({ subject: "", message: "" })
  }

  // ───────────────────────────────────────────────────────────────────────────

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "security", label: "Security" },
  ]

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-text-primary/50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-background rounded-brand shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* ── Sticky Header ── */}
          <div className="sticky top-0 bg-background border-b border-border px-6 pt-6 pb-0 z-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-border-dark
                         hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-primary font-semibold text-xl">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-semibold text-text-primary">{user.name}</h2>
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full capitalize border",
                    user.role === "admin"
                      ? "bg-primary/15 text-primary-dark border-primary/30"
                      : "bg-surface text-border-dark border-border"
                  )}>
                    {user.role}
                  </span>
                </div>
                <p className="text-border-dark text-sm truncate mt-0.5">{user.email}</p>
                <div className="mt-1.5">
                  <StatusBadge status={isBanned ? "suspended" : "active"} size="sm" />
                </div>
              </div>
            </div>

            <div className="flex gap-1 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-border-dark hover:text-text-primary"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-5">
                {/* Details */}
                <div className="divide-y divide-border-light">
                  <DetailRow label="User ID" value={user.id} mono />
                  <DetailRow label="Email Verified" value={user.emailVerified ? "Yes" : "No"} />
                  <DetailRow label="Joined" value={new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
                  <DetailRow label="Last Updated" value={new Date(user.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
                  <DetailRow label="Newsletter" value={(user as User).subscribeNewsletter ? "Subscribed" : "Not subscribed"} highlight={(user as User).subscribeNewsletter || false} />
                  {isBanned && user.banReason && <DetailRow label="Ban Reason" value={user.banReason} />}
                  {isBanned && user.banExpires && <DetailRow label="Ban Expires" value={new Date(user.banExpires).toLocaleDateString()} />}
                </div>

                {/* Quick Actions */}
                <div>
                  <p className="text-xs font-medium text-border-dark uppercase tracking-wider mb-3">
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" onClick={onChangeRole} className="text-sm">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Change Role
                    </Button>

                    {/* ── UPDATED Email User button ── */}
                    <Button
                      variant="secondary"
                      onClick={toggleEmailForm}
                      className={cn(
                        "text-sm transition-colors",
                        showEmailForm && "bg-primary/10 border-primary/40 text-primary-dark"
                      )}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {showEmailForm ? "Cancel" : "Email User"}
                    </Button>
                  </div>
                </div>

                {/* ── Inline Email Form ── */}
                {showEmailForm && (
                  <div className="rounded-brand border border-border bg-white overflow-hidden">

                    {/* Form header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-surface/60 border-b border-border">
                      <div>
                        <p className="text-sm font-medium text-text-primary">New Message</p>
                        <p className="text-xs text-border-dark mt-0.5">
                          To:{" "}
                          <span className="text-text-primary">{user.email}</span>
                        </p>
                      </div>
                      {/* Envelope decoration */}
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    <div className="p-4 space-y-4">

                      {/* Quick-fill templates */}
                      <div>
                        <p className="text-xs font-medium text-border-dark uppercase tracking-wider mb-2">
                          Templates
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {EMAIL_TEMPLATES.map((t) => (
                            <button
                              key={t.label}
                              onClick={() => {
                                setEmailForm({ subject: t.subject, message: t.message })
                                setEmailStatus("idle")
                                setEmailError("")
                              }}
                              className={cn(
                                "text-xs px-2.5 py-1 rounded-full border transition-colors",
                                emailForm.subject === t.subject
                                  ? "bg-primary/15 border-primary/50 text-primary-dark font-medium"
                                  : "border-border text-border-dark hover:border-primary/40 hover:text-text-primary bg-background"
                              )}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="text-xs font-medium text-border-dark block mb-1.5">
                          Subject <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          value={emailForm.subject}
                          onChange={(e) =>
                            setEmailForm((f) => ({ ...f, subject: e.target.value }))
                          }
                          placeholder="Email subject…"
                          className="w-full text-sm border border-border rounded-lg
                           bg-background px-3 py-2 text-text-primary
                           placeholder:text-border-dark
                           focus:outline-none focus:border-primary
                           transition-colors"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-medium text-border-dark">
                            Message <span className="text-primary">*</span>
                          </label>
                          <span className="text-xs text-border-dark">
                            {emailForm.message.length} chars
                          </span>
                        </div>
                        <textarea
                          rows={5}
                          value={emailForm.message}
                          onChange={(e) =>
                            setEmailForm((f) => ({ ...f, message: e.target.value }))
                          }
                          placeholder={`Hi ${user.name.split(" ")[0]}, …`}
                          className="w-full text-sm border border-border rounded-lg
                           bg-background px-3 py-2.5 resize-none text-text-primary
                           leading-relaxed placeholder:text-border-dark
                           focus:outline-none focus:border-primary
                           transition-colors"
                        />
                        {/* Preview hint */}
                        <p className="text-xs text-border-dark mt-1.5 flex items-center gap-1">
                          <Info className="w-3 h-3 shrink-0" />
                          Line breaks are preserved in the email. No formatting needed.
                        </p>
                      </div>

                      {/* Error */}
                      {emailStatus === "error" && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                          <span className="text-red-500 shrink-0 mt-0.5">
                            <ErrorIcon className="w-3.5 h-3.5" />
                          </span>
                          <p className="text-xs text-red-600">{emailError}</p>
                        </div>
                      )}

                      {/* Send button */}
                      <button
                        onClick={handleSendEmail}
                        disabled={
                          !canSendEmail ||
                          emailStatus === "sending" ||
                          emailStatus === "sent"
                        }
                        className={cn(
                          "w-full flex items-center justify-center gap-2",
                          "text-sm font-medium py-2.5 rounded-lg transition-all duration-200",
                          emailStatus === "sent"
                            ? "bg-text-primary/10 text-text-primary cursor-default"
                            : canSendEmail
                              ? "bg-primary text-background hover:bg-primary-dark shadow-sm hover:shadow"
                              : "bg-border-light text-border-dark cursor-not-allowed"
                        )}
                      >
                        {emailStatus === "sending" && (
                          <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
                        )}
                        {emailStatus === "sent" && (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        {emailStatus === "sending"
                          ? "Sending…"
                          : emailStatus === "sent"
                            ? "Email sent!"
                            : "Send Email"}
                      </button>

                    </div>
                  </div>
                )}
                {/* ────────────────────────────────────────────────────────────── */}
              </div>
            )}

            {/* Security tab — unchanged */}
            {activeTab === "security" && (
              <div className="space-y-3">
                <div className="rounded-brand border border-border overflow-hidden bg-white">
                  {/* Revoke Sessions */}
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-text-primary">Active Sessions</p>
                      <p className="text-xs text-border-dark mt-0.5">
                        Force the user to log out from all devices immediately.
                      </p>
                    </div>
                    <button
                      onClick={() => revokeSessions.mutate({ userId: user.id })}
                      disabled={revokeSessions.isPending}
                      className="shrink-0 text-sm font-medium text-primary-dark hover:text-primary-dark/80 disabled:opacity-50 transition-colors border border-border hover:border-primary/40 hover:bg-surface px-3 py-1.5 rounded-lg"
                    >
                      {revokeSessions.isPending ? "Revoking…" : "Revoke Sessions"}
                    </button>
                  </div>

                  <div className="border-t border-border" />

                  {/* Ban / Unban */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {isBanned ? "Unban Account" : "Ban Account"}
                        </p>
                        <p className="text-xs text-border-dark mt-0.5">
                          {isBanned
                            ? "Restore access to this user's account."
                            : "Prevent this user from accessing their account."}
                        </p>
                      </div>
                      {isBanned ? (
                        <button
                          onClick={handleUnban}
                          disabled={unban.isPending}
                          className="shrink-0 text-sm font-medium text-text-primary hover:text-text-primary/80 disabled:opacity-50 transition-colors border border-border hover:border-text-primary/30 hover:bg-surface px-3 py-1.5 rounded-lg"
                        >
                          {unban.isPending ? "Unbanning…" : "Unban User"}
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowBanConfirm(true)}
                          className="shrink-0 text-sm font-medium text-primary hover:text-primary-dark transition-colors border border-primary/40 hover:border-primary/60 hover:bg-primary/5 px-3 py-1.5 rounded-lg"
                        >
                          Ban User
                        </button>
                      )}
                    </div>

                    {showBanConfirm && !isBanned && (
                      <div className="mt-4 space-y-2">
                        <label className="text-xs text-border-dark">
                          Ban reason <span className="text-border">(optional)</span>
                        </label>
                        <textarea
                          value={banReason}
                          onChange={(e) => setBanReason(e.target.value)}
                          placeholder="e.g. Violation of terms of service"
                          rows={2}
                          className="w-full text-sm border border-border rounded-lg bg-background px-3 py-2 resize-none placeholder:text-border-dark focus:outline-none focus:border-primary transition-colors"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => setShowBanConfirm(false)}
                            className="flex-1 text-sm py-1.5 border border-border rounded-lg hover:bg-surface transition-colors text-text-primary"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleBan}
                            disabled={ban.isPending}
                            className="flex-1 text-sm py-1.5 bg-primary text-background rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors font-medium"
                          >
                            {ban.isPending ? "Banning…" : "Confirm Ban"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border" />

                  {/* Delete */}
                  <div className="p-4 flex items-start justify-between gap-4 bg-red-50/40">
                    <div>
                      <p className="text-sm font-medium text-red-600">Delete Account</p>
                      <p className="text-xs text-border-dark mt-0.5">
                        Permanently delete this user and all their data. Cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700 transition-colors border border-red-200 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete User Account"
        message={`This will permanently delete ${user.name}'s account and all associated data including orders and preferences. This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        variant="danger"
        isLoading={remove.isPending}
        resource="user"
        action="delete"
      />
    </>
  )
}

function DetailRow({ label, value, mono = false, highlight = false }: {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between items-start py-2.5 gap-4">
      <span className="text-sm text-border-dark shrink-0">{label}</span>
      <span className={cn(
        "text-sm text-right break-all",
        mono ? "font-mono text-xs text-border-dark" : "text-text-primary",
        highlight && "text-primary font-medium"
      )}>
        {value}
      </span>
    </div>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}