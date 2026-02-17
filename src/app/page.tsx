import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,245,248,0.08),_transparent_55%),_#05060a] text-primary font-[family-name:var(--font-geist-sans)]">
      <header className="sticky top-0 z-50 border-b border-default/60 backdrop-blur-sm bg-black/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-default bg-surface text-xs font-semibold tracking-tight">
              SCV
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">SignalCV</span>
              <span className="text-xs text-muted">Resume tailoring engine</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-xs text-muted md:flex">
            <a href="#product" className="hover:text-primary cursor-pointer">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-primary cursor-pointer">
              How it works
            </a>
            <a href="#pricing" className="hover:text-primary cursor-pointer">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-default/60 px-4 py-1.5 text-xs font-medium text-muted hover:border-primary/80 hover:text-primary md:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-inverse shadow-sm shadow-black/40 hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-20 pt-16 md:pt-24">
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center" id="product">
          <div className="space-y-6">
            <p className="text-xs font-medium tracking-[0.25em] text-muted/80 uppercase">
              AI-POWERED APPLICATION ENGINE
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary md:text-5xl">
              Turn one resume into{' '}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                every application
              </span>
              .
            </h1>
            <p className="max-w-xl text-balance text-sm text-muted md:text-base">
              SignalCV automates the slowest part of job hunting. Paste your base resume once,
              drop in any job description, and instantly ship ATS-safe tailored resumes, cover
              letters, and recruiter DMs.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-inverse shadow-sm shadow-black/40 hover:bg-primary/90"
              >
                Get started
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-muted/80">
              <div>
                <p className="font-semibold text-primary">25/day default limit</p>
                <p>Built-in safety rails for healthy usage.</p>
              </div>
              <div>
                <p className="font-semibold text-primary">Multi-tenant by design</p>
                <p>Profiles, tenants, and admin controls ready.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-default/70 bg-gradient-to-b from-white/4 to-white/0 px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between text-[10px] text-muted mb-3">
                <span className="uppercase tracking-[0.22em]">Flow</span>
                <span>SignalCV · Today</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-default/80 bg-surface px-3 py-2">
                  <div>
                    <p className="font-medium text-primary">Base resume</p>
                    <p className="text-[11px] text-muted">ATS score · Ready</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    94 / 100
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-default/60 bg-surface px-3 py-2">
                  <div>
                    <p className="font-medium text-primary">Job description</p>
                    <p className="text-[11px] text-muted">Product Manager · Linear-style SaaS</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    1 / 25 today
                  </span>
                </div>
                <div className="rounded-xl border border-dashed border-default/70 bg-surface/40 px-3 py-3 text-[11px] text-muted">
                  Tailored resume, cover letter, and recruiter DM will drop here in seconds —
                  formatted for copy-paste or export.
                </div>
              </div>
            </div>

            <div className="grid gap-3 text-xs text-muted md:grid-cols-2">
              <div className="rounded-xl border border-default/70 bg-surface/60 p-3">
                <p className="font-medium text-primary">Built for speed</p>
                <p className="mt-1">
                  Local ATS checks and JD parsing keep the UI instant while AI focuses only on
                  writing.
                </p>
              </div>
              <div className="rounded-xl border border-default/70 bg-surface/60 p-3">
                <p className="font-medium text-primary">Opinionated defaults</p>
                <p className="mt-1">
                  Daily limits, status tracking, and admin views are wired in from day one.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight text-primary">How SignalCV works</h2>
            <p className="text-sm text-muted max-w-xl">
              A focused three-step flow that turns one strong resume into tailored applications
              without rebuilding from scratch every time.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 text-xs text-muted">
            <div className="rounded-xl border border-default/70 bg-surface/60 p-4 space-y-2">
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-muted/80">
                Step 1
              </p>
              <p className="text-sm font-semibold text-primary">Lock in your base resume</p>
              <p>
                Paste your resume once. We run local ATS checks and flag missing sections,
                contact details, bullets, and quantified wins before you tailor anything.
              </p>
            </div>
            <div className="rounded-xl border border-default/70 bg-surface/60 p-4 space-y-2">
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-muted/80">
                Step 2
              </p>
              <p className="text-sm font-semibold text-primary">Drop in a job description</p>
              <p>
                Paste any JD. SignalCV parses role, company, and key requirements locally, then
                prepares a prompt-safe context for AI.
              </p>
            </div>
            <div className="rounded-xl border border-default/70 bg-surface/60 p-4 space-y-2">
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-muted/80">
                Step 3
              </p>
              <p className="text-sm font-semibold text-primary">Generate and track</p>
              <p>
                Generate a tailored resume, cover letter, and recruiter DM. Save each run into
                your results library with status and daily usage limits enforced.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight text-primary">Pricing</h2>
            <p className="text-sm text-muted max-w-xl">
              SignalCV is being shaped with real workflows before pricing is finalized.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-default/70 bg-surface/40 px-6 py-5 text-sm text-muted">
            <p className="font-medium text-primary">Coming soon</p>
            <p className="mt-1 text-xs">
              Early builds focus on product fit: ATS rules, daily limits, and multi-tenant
              controls. Pricing tiers will follow once the core tailoring engine is battle-tested.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-default/60 bg-black/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-[11px] text-muted">
          <p>© {new Date().getFullYear()} SignalCV. Built for focused job search.</p>
          <p className="hidden md:block">ATS-first · AI-assisted · Multi-tenant ready.</p>
        </div>
      </footer>
    </div>
  )
}
