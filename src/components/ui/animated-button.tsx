'use client'

import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, useRef, Ref, MutableRefObject } from 'react'
import { cn } from '@/lib/utils'

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
  loadingIcon?: React.ReactNode
}

export const AnimatedButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const ariaLabelFromProps =
    (props as ButtonHTMLAttributes<HTMLButtonElement>)['aria-label']

  const {
    className,
    children,
    disabled,
    variant = 'primary',
    loadingIcon,
    title,
    ...rest
  } = props
  const btnRef = useRef<HTMLButtonElement | null>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--rb-x', `${x}px`)
    el.style.setProperty('--rb-y', `${y}px`)
  }

  const base =
    variant === 'primary'
      ? 'relative inline-flex items-center justify-center rounded-xl font-semibold text-brand-inverse bg-brand-primary px-5 py-2 transition-all'
      : 'relative inline-flex items-center justify-center rounded-xl font-semibold text-primary border border-default px-5 py-2 bg-transparent transition-all'

  const assignRef = (r: Ref<HTMLButtonElement> | undefined, v: HTMLButtonElement | null) => {
    if (!r) return
    if (typeof r === 'function') r(v)
    else (r as MutableRefObject<HTMLButtonElement | null>).current = v
  }

  const computedAriaLabel =
    ariaLabelFromProps ?? (typeof title === 'string' ? title : undefined)

  return (
    <button
      ref={(node) => {
        btnRef.current = node
        assignRef(ref, node)
      }}
      disabled={disabled}
      onMouseMove={onMouseMove}
      className={cn(
        base,
        'rb-button group/button',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110',
        className
      )}
      aria-label={computedAriaLabel}
      {...rest}
    >
      {loadingIcon}
      <span className="relative z-10">{children}</span>
      {title && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute z-20 left-1/2 top-full -translate-x-1/2 mt-2',
            'max-w-[220px] whitespace-nowrap rounded-md border border-default bg-surface px-2.5 py-1.5',
            'text-[11px] leading-tight text-primary shadow-sm',
            'opacity-0 translate-y-1 group-hover/button:opacity-100 group-hover/button:translate-y-0',
            'group-focus-visible/button:opacity-100 group-focus-visible/button:translate-y-0',
            'transition-all duration-150 delay-100'
          )}
        >
          {title}
        </span>
      )}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 rounded-xl transition-opacity duration-300',
          variant === 'primary'
            ? 'bg-[radial-gradient(220px_220px_at_var(--rb-x,_var(--rb-y)),rgba(255,255,255,0.25),transparent_60%)]'
            : 'bg-[radial-gradient(220px_220px_at_var(--rb-x,_var(--rb-y)),rgba(255,255,255,0.07),transparent_60%)]'
        )}
      />
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 rounded-xl ring-0 transition-all duration-300',
          disabled ? '' : 'group-hover/button:ring-2 group-hover/button:ring-white/10'
        )}
      />
    </button>
  )
})
AnimatedButton.displayName = 'AnimatedButton'
