// app/register/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, Check } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { cn } from '@/lib/utils'
import { signUp } from "@/lib/auth-client";

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler, Controller, useWatch } from 'react-hook-form'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
  subscribeNewsletter: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
})

type RegisterFormData = z.infer<typeof registerSchema>

const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'uppercase', label: 'One uppercase letter', regex: /[A-Z]/ },
  { id: 'lowercase', label: 'One lowercase letter', regex: /[a-z]/ },
  { id: 'number', label: 'One number', regex: /[0-9]/ },
]


export default function RegisterPage() {

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold text-charcoal">
              LUMINA
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-warm-gray-light rounded-brand p-8 shadow-soft">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl text-charcoal mb-2">
              Create Account
            </h1>
            <p className="text-warm-gray-dark">
              Join LUMINA for exclusive offers and faster checkout
            </p>
          </div>

          {/* Registration Form */}
          <RegistrationForm />

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-gray-light" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-warm-gray-dark">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Signup Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-12 border border-warm-grayrounded-brand text-charcoal font-medium text-sm hover:bg-linen transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-12 border border-warm-grayrounded-brand text-charcoal font-medium text-sm hover:bg-linen transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-warm-gray-dark mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-gold font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-warm-gray-dark hover:text-charcoal transition-colors"
          >
            ← Back to Home
          </Link>
        </p>
      </div>
    </main>
  )
}

const RegistrationForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      subscribeNewsletter: true,
    },
  })

  const passwordValue = useWatch({
    control,
    name: 'password'
  })

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const { firstName, lastName, email, password, subscribeNewsletter } = data;
      const result = await signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
        subscribeNewsletter
      });

      if (result.error) {
        setServerError(result.error.message || "Registration failed");
      } else {
        router.push("/account");
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  }

  const checkPasswordRequirement = (requirement: typeof passwordRequirements[0]) => {
    return requirement.regex.test(passwordValue)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          {...register('firstName')}
          placeholder="John"
          error={errors?.firstName?.message}
        />
        <Input
          label="Last Name"
          {...register('lastName')}
          placeholder="Doe"
          error={errors?.lastName?.message}
        />
      </div>

      {/* Email */}
      <Input
        label="Email Address"
        type="email"
        {...register('email')}
        placeholder="your@email.com"
        error={errors?.email?.message}
        icon={<Mail className="w-5 h-5" />}
      />

      {/* Password */}
      <div>
        <div className="relative">
          <Input
            label="Password"
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            error={errors?.password?.message}
            icon={<Lock className="w-5 h-5" />}
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-1/2 text-warm-gray-dark hover:text-charcoal transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </Input>
        </div>

        {/* Password Requirements */}
        {passwordValue && (
          <div className="mt-3 space-y-1.5">
            {passwordRequirements.map((req) => {
              const isValid = checkPasswordRequirement(req)
              return (
                <div
                  key={req.id}
                  className={cn(
                    'flex items-center gap-2 text-xs transition-colors',
                    isValid ? 'text-green-600' : 'text-warm-gray-dark'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      isValid ? 'bg-green-100' : 'bg-warm-gray-light'
                    )}
                  >
                    {isValid && <Check className="w-3 h-3" />}
                  </div>
                  {req.label}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <Input
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        {...register('confirmPassword')}
        placeholder="Confirm your password"
        error={errors?.confirmPassword?.message}
        icon={<Lock className="w-5 h-5" />}
      />

      {/* Terms & Newsletter */}
      <div className="space-y-3">
        <div>
          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="agreeToTerms"
                label={
                  <span>
                    I agree to the{' '}
                    <Link href="/terms" className="text-gold hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-gold hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                }
                checked={field.value}
                onChange={(checked) => field.onChange(checked)}
              />)}
          />
          {errors.agreeToTerms && (
            <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms.message}</p>
          )}
        </div>

        <Controller
          name="subscribeNewsletter"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="subscribeNewsletter"
              label="Subscribe to our newsletter for exclusive offers"
              checked={field.value || false}
              onChange={(checked) => field.onChange(checked)}
            />)}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>

      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {serverError}
        </div>
      )}
    </form>
  )
}