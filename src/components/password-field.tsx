'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordFieldProps {
  id: string
  name?: string
  label: string
  placeholder?: string
}

export function PasswordField({ id, name = id, label, placeholder }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xs font-medium text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          required
          placeholder={placeholder}
          className="h-10 w-full rounded-xl border border-default bg-surface px-3 pr-9 text-sm text-primary placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/60"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-2 flex items-center text-muted hover:text-primary"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

