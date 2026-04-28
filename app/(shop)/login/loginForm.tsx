'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { signIn } from "@/lib/auth-client";

import { SocialLogins } from './socialLogins'

import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;


export default function LoginForm() {
  const router = useRouter()

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  })

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setError("");

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.error) {
        setError(result.error.message || "Invalid credentials");
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  }

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
              Welcome Back
            </h1>
            <p className="text-warm-gray-dark">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                placeholder="your@email.com"
                error={errors.email?.message}
                icon={<Mail className="w-5 h-5" />}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                error={errors.password?.message}
                icon={<Lock className="w-5 h-5" />}
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-dark hover:text-charcoal transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </Input>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    label="Remember me"
                    checked={field.value || false}
                    onChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
              <Link
                href="/forgot-password"
                className="text-sm text-gold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-gray-light" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-warm-gray-dark">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <SocialLogins />

          {/* Sign Up Link */}
          <p className="text-center text-sm text-warm-gray-dark mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-gold font-medium hover:underline">
              Create one
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
