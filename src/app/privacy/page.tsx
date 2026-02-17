import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#05060a] text-primary px-4 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-default bg-surface text-xs font-semibold tracking-tight">
              SCV
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">SignalCV</span>
              <span className="text-xs text-muted">Resume tailoring engine</span>
            </div>
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-default/70 px-3 py-1 text-[11px] font-medium text-muted hover:border-primary/80 hover:text-primary"
          >
            Back to app
          </Link>
        </header>

        <main className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-muted max-w-xl">
              This policy explains how SignalCV handles the data you provide while using the app.
            </p>
          </div>

          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>
              SignalCV stores account information and tailored resumes in Supabase on your behalf.
              Application text you paste may be sent to third-party AI providers for processing
              depending on your selected configuration.
            </p>
            <p>
              We do not sell your data. Logs and analytics may be used to improve the product, debug
              issues, and understand usage at an aggregate level.
            </p>
            <p>
              During early development, data retention and export processes are still being refined.
              If you need your data removed, you can delete your account or contact the maintainer
              of this instance.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

