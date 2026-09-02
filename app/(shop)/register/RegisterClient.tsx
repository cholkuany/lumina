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
import { SocialLogins } from '../login/socialLogins'

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


export default function RegisterClient({ redirectTo }: { redirectTo: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-sm border border-white/70 rounded-brand p-8 shadow-soft">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl text-text-primary mb-2">
              Create Account
            </h1>
            <p className="text-border-dark">
              Join LUMINA for exclusive offers and faster checkout
            </p>
          </div>

          {/* Registration Form */}
          <RegistrationForm redirectTo={redirectTo} />

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-border-dark">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Signup Buttons */}
          <SocialLogins redirectTo={redirectTo} mode="sign-up" />
          <p className="mt-3 text-center text-xs leading-5 text-border-dark">
            By signing up with Google or Facebook, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          {/* Sign In Link */}
          <p className="text-center text-sm text-border-dark mt-8">
            Already have an account?{' '}
            <Link
              href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

const RegistrationForm = ({ redirectTo }: { redirectTo: string }) => {
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
        router.push(redirectTo);
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
          placeholder="Johnson"
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
              className="absolute right-4 top-1/2 -translate-1/2 text-border-dark hover:text-text-primary transition-colors"
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
                    isValid ? 'text-success-600' : 'text-border-dark'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      isValid ? 'bg-success-100' : 'bg-border-light'
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
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
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
