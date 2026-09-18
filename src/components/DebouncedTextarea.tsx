'use client'

import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Check } from 'lucide-react'

interface Props {
  initialValue: string;
  onSave: (val: string) => Promise<void>;
  disabled?: boolean;
}

export function DebouncedTextarea({ initialValue, onSave, disabled }: Props) {
  const [value, setValue] = useState(initialValue)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  const debouncedSave = useDebouncedCallback(async (val: string) => {
    setIsSaving(true)
    await onSave(val)
    setIsSaving(false)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }, 800)

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setShowSaved(false)
          debouncedSave(e.target.value)
        }}
        disabled={disabled}
        placeholder="Add notes or partial progress..."
        className="w-full min-h-[80px] p-3 text-sm text-slate-100 placeholder:text-slate-500 bg-slate-900/40 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y transition-shadow disabled:opacity-100 disabled:bg-slate-900/40 disabled:border-slate-700/30 disabled:resize-none disabled:cursor-default"
      />

      {/* Saved Indicator */}
      <div
        className={`absolute bottom-3 right-3 flex items-center text-xs font-medium text-emerald-400 transition-opacity duration-300 ${showSaved && !isSaving ? 'opacity-100' : 'opacity-0'}`}
      >
        <Check size={14} className="mr-1" />
        Saved
      </div>

      {isSaving && (
        <div className="absolute bottom-3 right-3 flex items-center text-xs font-medium text-slate-400 transition-opacity duration-300">
          Saving...
        </div>
      )}
    </div>
  )
}