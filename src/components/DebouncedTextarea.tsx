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
        className="w-full min-h-[80px] p-3 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-apple-blue resize-y transition-shadow disabled:opacity-80 disabled:bg-transparent disabled:border-transparent disabled:resize-none"
      />
      
      {/* Saved Indicator */}
      <div 
        className={`absolute bottom-3 right-3 flex items-center text-xs font-medium text-apple-green transition-opacity duration-300 ${showSaved && !isSaving ? 'opacity-100' : 'opacity-0'}`}
      >
        <Check size={14} className="mr-1" />
        Saved
      </div>
      
      {isSaving && (
        <div className="absolute bottom-3 right-3 flex items-center text-xs font-medium text-gray-400 transition-opacity duration-300">
          Saving...
        </div>
      )}
    </div>
  )
}
