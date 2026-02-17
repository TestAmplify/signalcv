'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Settings, Shield, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Tailor', href: '/app', icon: Home },
  { name: 'Results', href: '/results', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Admin', href: '/admin', icon: Shield }, // Should be conditional
  { name: 'Super Admin', href: '/super-admin', icon: LayoutDashboard }, // Should be conditional
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-default bg-surface min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50">
      <div className="p-6 border-b border-default">
        <h1 className="text-xl font-bold tracking-tight text-primary">SignalCV</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-bg-surface-elevated text-primary shadow-sm" 
                  : "text-muted hover:text-primary hover:bg-bg-surface-elevated/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-default">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted">
          <div className="w-8 h-8 rounded-full bg-bg-surface-elevated border border-default flex items-center justify-center">
            User
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-primary">My Account</p>
            <p className="truncate text-xs">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
