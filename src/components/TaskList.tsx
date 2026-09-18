'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TaskCard } from './TaskCard'
import { toggleTaskStatus } from '@/app/actions'

export function TaskList({ 
  initialEntries, 
  isEditMode 
}: { 
  initialEntries: any[], 
  isEditMode: boolean 
}) {
  const [entries, setEntries] = useState(initialEntries)

  const handleToggle = async (entryId: string, checked: boolean) => {
    const newStatus = checked ? 'done' : 'not_done'
    
    // Update local state for optimistic sliding animation
    setEntries(current => 
      current.map(e => e.id === entryId ? { ...e, status: newStatus } : e)
    )

    // Persist to database
    await toggleTaskStatus(entryId, newStatus)
  }

  // Sort: Done tasks at the top, Not done below. Then fallback to ID sorting.
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return -1
    if (a.status !== 'done' && b.status === 'done') return 1
    return a.id.localeCompare(b.id)
  })

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {sortedEntries.map(entry => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <TaskCard 
              entry={entry} 
              isEditMode={isEditMode} 
              onToggle={handleToggle}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
