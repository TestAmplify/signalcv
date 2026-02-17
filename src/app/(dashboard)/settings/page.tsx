'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [openaiKey, setOpenaiKey] = useState('')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setOpenaiKey(localStorage.getItem('signalcv_openai_key') || '')
    setAnthropicKey(localStorage.getItem('signalcv_anthropic_key') || '')
  }, [])

  const handleSave = () => {
    localStorage.setItem('signalcv_openai_key', openaiKey)
    localStorage.setItem('signalcv_anthropic_key', anthropicKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted">Configure your AI API keys. These are stored locally in your browser.</p>
      </div>

      <div className="space-y-6 bg-surface p-6 rounded-xl border border-default">
        <div className="space-y-2">
          <label className="text-sm font-medium">OpenAI API Key</label>
          <input
            type="password"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full h-10 px-3 rounded-md bg-bg-canvas border border-default focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Anthropic API Key</label>
          <input
            type="password"
            value={anthropicKey}
            onChange={(e) => setAnthropicKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full h-10 px-3 rounded-md bg-bg-canvas border border-default focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-brand-primary text-brand-inverse font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            Save Settings
          </button>
          {saved && <span className="text-green-500 text-sm font-medium animate-in fade-in">Saved successfully!</span>}
        </div>
      </div>
    </div>
  )
}
