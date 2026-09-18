'use client'

import { motion } from 'framer-motion'

export function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (c: boolean) => void; disabled?: boolean }) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.85 }}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent 
        transition-colors duration-300 ease-in-out focus:outline-none
        ${checked ? 'bg-apple-green' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 
          transition duration-300 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </motion.button>
  )
}
