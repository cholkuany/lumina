// app/account/settings/page.tsx
'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, Check, X, Loader2, AlertTriangle, Trash2, LogOut, Shield, Smartphone }
  from 'lucide-react'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'

// Types
interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface NotificationSettings {
  orderUpdates: boolean
  promotions: boolean
  newArrivals: boolean
  priceDrops: boolean
  newsletter: boolean
  smsNotifications: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private'
  showWishlist: boolean
  allowAnalytics: boolean
  personalizedAds: boolean
}

// Mock initial data
const initialProfile: UserProfile = {
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@email.com',
  phone: '(555) 123-4567',
}

const initialNotifications: NotificationSettings = {
  orderUpdates: true,
  promotions: true,
  newArrivals: false,
  priceDrops: true,
  newsletter: true,
  smsNotifications: false,
}

const initialPrivacy: PrivacySettings = {
  profileVisibility: 'private',
  showWishlist: false,
  allowAnalytics: true,
  personalizedAds: false,
}

// Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-charcoal/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-brand shadow-hover max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-warm-gray-light">
            <h2 className="font-serif text-xl text-charcoal">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-linen rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-warm-gray-dark" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Toggle Switch Component
function Toggle({
  enabled,
  onChange,
  disabled = false
}: {
  enabled: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-gold' : 'bg-warm-gray-light'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  )
}

// Section Component
function SettingsSection({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-warm-gray-light rounded-brand overflow-hidden">
      <div className="p-6 border-b border-warm-gray-light">
        <h2 className="font-serif text-lg text-charcoal">{title}</h2>
        {description && (
          <p className="text-sm text-warm-gray-dark mt-1">{description}</p>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

// Profile Settings Component
function ProfileSettings({
  profile,
  onSave
}: {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onSave(formData)
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile)
    setErrors({})
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            First Name
          </label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.firstName ? 'border-red-500' : 'border-warm-gray-light'
                  }`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
              )}
            </>
          ) : (
            <p className="text-warm-gray-dark py-3">{profile.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Last Name
          </label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.lastName ? 'border-red-500' : 'border-warm-gray-light'
                  }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
              )}
            </>
          ) : (
            <p className="text-warm-gray-dark py-3">{profile.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Email Address
        </label>
        {isEditing ? (
          <>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.email ? 'border-red-500' : 'border-warm-gray-light'
                }`}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </>
        ) : (
          <p className="text-warm-gray-dark py-3">{profile.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Phone Number
        </label>
        {isEditing ? (
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-warm-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
          />
        ) : (
          <p className="text-warm-gray-dark py-3">{profile.phone || 'Not provided'}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        {isEditing ? (
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  )
}

// Change Password Form
function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include uppercase, lowercase, and number'
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-serif text-xl text-charcoal mb-2">Password Changed</h3>
        <p className="text-warm-gray-dark mb-6">
          Your password has been successfully updated.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.current ? 'text' : 'password'}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.currentPassword ? 'border-red-500' : 'border-warm-gray-light'
              }`}
          />
          <button
            type="button"
            onClick={() => toggleShowPassword('current')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-dark hover:text-charcoal"
          >
            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.currentPassword}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.newPassword ? 'border-red-500' : 'border-warm-gray-light'
              }`}
          />
          <button
            type="button"
            onClick={() => toggleShowPassword('new')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-dark hover:text-charcoal"
          >
            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
        )}
        <p className="text-xs text-warm-gray-dark mt-1">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-warm-gray-light'
              }`}
          />
          <button
            type="button"
            onClick={() => toggleShowPassword('confirm')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-dark hover:text-charcoal"
          >
            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </div>
    </form>
  )
}

// Delete Account Form
function DeleteAccountForm({ onClose }: { onClose: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }
    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsDeleting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    // In a real app, this would delete the account and redirect
    setIsDeleting(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">This action is irreversible</p>
            <p className="text-sm text-red-700 mt-1">
              Deleting your account will permanently remove all your data, including orders, addresses, and wishlist items.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Type DELETE to confirm
        </label>
        <input
          type="text"
          value={confirmation}
          onChange={(e) => {
            setConfirmation(e.target.value)
            setError('')
          }}
          placeholder="DELETE"
          className="w-full px-4 py-3 border border-warm-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Enter your password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          placeholder="Your password"
          className="w-full px-4 py-3 border border-warm-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isDeleting}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            'Delete Account'
          )}
        </Button>
      </div>
    </form>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [notifications, setNotifications] = useState<NotificationSettings>(initialNotifications)
  const [privacy, setPrivacy] = useState<PrivacySettings>(initialPrivacy)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [savingPrivacy, setSavingPrivacy] = useState(false)

  const handleNotificationChange = async (key: keyof NotificationSettings, value: boolean) => {
    setSavingNotifications(true)
    setNotifications(prev => ({ ...prev, [key]: value }))
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setSavingNotifications(false)
  }

  const handlePrivacyChange = async (key: keyof PrivacySettings, value: boolean | string) => {
    setSavingPrivacy(true)
    setPrivacy(prev => ({ ...prev, [key]: value }))
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setSavingPrivacy(false)
  }

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb
          items={[
            { label: 'My Account', href: '/account' },
            { label: 'Settings' },
          ]}
        />
      </div>

      <div className="container-lumina">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <AccountSidebar />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div>
              <h1 className="font-serif text-2xl lg:text-3xl text-charcoal">
                Account Settings
              </h1>
              <p className="text-warm-gray-dark mt-1">
                Manage your account preferences and security
              </p>
            </div>

            {/* Profile Information */}
            <SettingsSection
              title="Profile Information"
              description="Update your personal details"
            >
              <ProfileSettings
                profile={profile}
                onSave={setProfile}
              />
            </SettingsSection>

            {/* Password & Security */}
            <SettingsSection
              title="Password & Security"
              description="Manage your password and security settings"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-medium text-charcoal">Password</p>
                      <p className="text-sm text-warm-gray-dark">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-medium text-charcoal">Two-Factor Authentication</p>
                      <p className="text-sm text-warm-gray-dark">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-medium text-charcoal">Active Sessions</p>
                      <p className="text-sm text-warm-gray-dark">Manage devices logged into your account</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </SettingsSection>

            {/* Notification Preferences */}
            <SettingsSection
              title="Notification Preferences"
              description="Choose how you want to be notified"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div>
                    <p className="font-medium text-charcoal">Order Updates</p>
                    <p className="text-sm text-warm-gray-dark">Get notified about your order status</p>
                  </div>
                  <Toggle
                    enabled={notifications.orderUpdates}
                    onChange={(value) => handleNotificationChange('orderUpdates', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div>
                    <p className="font-medium text-charcoal">Promotions & Offers</p>
                    <p className="text-sm text-warm-gray-dark">Receive exclusive deals and discounts</p>
                  </div>
                  <Toggle
                    enabled={notifications.promotions}
                    onChange={(value) => handleNotificationChange('promotions', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div>
                    <p className="font-medium text-charcoal">New Arrivals</p>
                    <p className="text-sm text-warm-gray-dark">Be the first to know about new products</p>
                  </div>
                  <Toggle
                    enabled={notifications.newArrivals}
                    onChange={(value) => handleNotificationChange('newArrivals', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div>
                    <p className="font-medium text-charcoal">Price Drops</p>
                    <p className="text-sm text-warm-gray-dark">Get alerts when wishlist items go on sale</p>
                  </div>
                  <Toggle
                    enabled={notifications.priceDrops}
                    onChange={(value) => handleNotificationChange('priceDrops', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div>
                    <p className="font-medium text-charcoal">Newsletter</p>
                    <p className="text-sm text-warm-gray-dark">Weekly updates and curated content</p>
                  </div>
                  <Toggle
                    enabled={notifications.newsletter}
                    onChange={(value) => handleNotificationChange('newsletter', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-charcoal">SMS Notifications</p>
                    <p className="text-sm text-warm-gray-dark">Receive text messages for important updates</p>
                  </div>
                  <Toggle
                    enabled={notifications.smsNotifications}
                    onChange={(value) => handleNotificationChange('smsNotifications', value)}
                  />
                </div>

                {savingNotifications && (
                  <p className="text-sm text-gold flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </p>
                )}
              </div>
            </SettingsSection>

            {/* Privacy Settings */}
            <SettingsSection
              title="Privacy Settings"
              description="Control your data and privacy preferences"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div>
                    <p className="font-medium text-charcoal">Profile Visibility</p>
                    <p className="text-sm text-warm-gray-dark">Control who can see your profile</p>
                  </div>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="px-3 py-2 border border-warm-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div>
                    <p className="font-medium text-charcoal">Show Wishlist</p>
                    <p className="text-sm text-warm-gray-dark">Allow others to see your wishlist</p>
                  </div>
                  <Toggle
                    enabled={privacy.showWishlist}
                    onChange={(value) => handlePrivacyChange('showWishlist', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div>
                    <p className="font-medium text-charcoal">Analytics</p>
                    <p className="text-sm text-warm-gray-dark">Help us improve by sharing usage data</p>
                  </div>
                  <Toggle
                    enabled={privacy.allowAnalytics}
                    onChange={(value) => handlePrivacyChange('allowAnalytics', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-charcoal">Personalized Ads</p>
                    <p className="text-sm text-warm-gray-dark">See ads based on your interests</p>
                  </div>
                  <Toggle
                    enabled={privacy.personalizedAds}
                    onChange={(value) => handlePrivacyChange('personalizedAds', value)}
                  />
                </div>

                {savingPrivacy && (
                  <p className="text-sm text-gold flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </p>
                )}
              </div>
            </SettingsSection>

            {/* Danger Zone */}
            <SettingsSection
              title="Danger Zone"
              description="Irreversible account actions"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-warm-gray-light">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-warm-gray-dark" />
                    <div>
                      <p className="font-medium text-charcoal">Sign Out Everywhere</p>
                      <p className="text-sm text-warm-gray-dark">Log out of all devices</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Sign Out All
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-600">Delete Account</p>
                      <p className="text-sm text-warm-gray-dark">Permanently delete your account and data</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </SettingsSection>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <ChangePasswordForm onClose={() => setShowPasswordModal(false)} />
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <DeleteAccountForm onClose={() => setShowDeleteModal(false)} />
      </Modal>
    </main>
  )
}