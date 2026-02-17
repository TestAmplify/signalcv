'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, FileText, Settings, LayoutDashboard, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/login/actions'

export function AppSidebar() {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) setRole(data.role ?? null)
      } catch {
        if (!cancelled) setRole(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <aside className="w-64 border-r border-default bg-surface min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50">
      <div className="p-6 border-b border-default">
        <h1 className="text-xl font-bold tracking-tight text-primary">SignalCV</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {[
          { name: 'Tailor', href: '/app', icon: Home },
          { name: 'Results', href: '/results', icon: FileText },
          { name: 'Settings', href: '/settings', icon: Settings },
          { name: 'Profile', href: '/profile', icon: User },
        ].map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all hover:translate-x-0.5',
                isActive
                  ? 'bg-bg-surface-elevated text-primary shadow-sm'
                  : 'text-muted hover:text-primary hover:bg-bg-surface-elevated/50'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
        {role === 'super_admin' && (
          <Link
            href="/super-admin"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all hover:translate-x-0.5',
              pathname === '/super-admin'
                ? 'bg-bg-surface-elevated text-primary shadow-sm'
                : 'text-muted hover:text-primary hover:bg-bg-surface-elevated/50'
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Super Admin
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-default">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-primary hover:bg-bg-surface-elevated/60 rounded-md flex-1"
          >
            <div className="w-8 h-8 rounded-full bg-bg-surface-elevated border border-default flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="truncate font-medium text-primary">My Account</p>
              <p className="truncate text-xs text-muted">View profile</p>
            </div>
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-default/70 p-2 text-muted hover:text-primary hover:border-primary"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
