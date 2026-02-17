import { signup } from '@/app/login/actions'
import Link from 'next/link'
import { PasswordField } from '@/components/password-field'
import { AnimatedButton } from '@/components/ui/animated-button'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05060a] px-4 text-primary">
      <div className="w-full max-w-sm rounded-2xl border border-default/70 bg-gradient-to-b from-white/6 to-white/0 px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.9)]">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-default bg-surface text-[10px] font-semibold"
          >
            SCV
          </Link>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight">Create your workspace</h1>
            <p className="text-xs text-muted">
              Set up SignalCV for your job search. You can invite more users later.
            </p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium text-muted">
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="h-10 w-full rounded-xl border border-default bg-surface px-3 text-sm text-primary placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/60"
            />
          </div>
          <PasswordField id="password" name="password" label="Password" />

          <div className="space-y-2 pt-2">
            <AnimatedButton formAction={signup} className="w-full h-10 text-sm">
              Sign up
            </AnimatedButton>
          </div>
        </form>

        <div className="mt-6 space-y-1 text-center text-[11px] text-muted">
          <p>
            By signing up, you agree to the{' '}
            <Link href="/terms" className="cursor-pointer text-primary hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="cursor-pointer text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="pt-1">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
