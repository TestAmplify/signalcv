 'use client'
 
import Link from 'next/link'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  href: string
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'ghost'
}

export function AnimatedLink({ href, children, className, variant = 'primary' }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--rb-x', `${x}px`)
    el.style.setProperty('--rb-y', `${y}px`)
  }

  const base =
    variant === 'primary'
      ? 'relative inline-flex items-center justify-center rounded-full font-semibold text-brand-inverse bg-brand-primary px-4 py-1.5 transition-all'
      : 'relative inline-flex items-center justify-center rounded-full font-medium text-muted border border-default px-4 py-1.5 bg-transparent transition-all hover:text-primary'

  return (
    <Link href={href} className={cn(base, 'rb-button', className)} onMouseMove={onMouseMove} ref={ref}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 rounded-full transition-opacity duration-300',
          variant === 'primary'
            ? 'bg-[radial-gradient(180px_180px_at_var(--rb-x,_var(--rb-y)),rgba(255,255,255,0.25),transparent_60%)]'
            : 'bg-[radial-gradient(180px_180px_at_var(--rb-x,_var(--rb-y)),rgba(255,255,255,0.07),transparent_60%)]'
        )}
      />
    </Link>
  )
}
