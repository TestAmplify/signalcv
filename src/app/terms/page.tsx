import Link from 'next/link'

export default function TermsPage() {
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
            <h1 className="text-2xl font-semibold tracking-tight">Terms of Service</h1>
            <p className="text-sm text-muted max-w-xl">
              These terms describe how you can use SignalCV while we are in active development.
            </p>
          </div>

          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>
              SignalCV is an experimental tool for automating resume tailoring. Do not paste
              information you would not be comfortable sharing with third-party AI providers. You
              are responsible for verifying all generated content before using it in real
              applications.
            </p>
            <p>
              Access may change or be revoked at any time while the product is in early stages. We
              aim to provide a reliable experience, but there are no uptime, accuracy, or
              availability guarantees.
            </p>
            <p>
              By continuing to use SignalCV, you confirm that you will use it responsibly and in
              compliance with the laws and policies applicable in your region and to your job
              search.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

