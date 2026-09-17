'use client'

import { Toggle } from './Toggle'
import { DebouncedTextarea } from './DebouncedTextarea'
import { MoreHorizontal, Trophy, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toggleTaskStatus, updateTaskNote, removePermanentTask, retireTask } from '@/app/actions'

export function TaskCard({ 
  entry, 
  isEditMode 
}: { 
  entry: any, 
  isEditMode: boolean 
}) {
  const [showMenu, setShowMenu] = useState(false)
  
  const handleToggle = async (checked: boolean) => {
    await toggleTaskStatus(entry.id, checked ? 'done' : 'not_done')
  }

  const handleSaveNote = async (note: string) => {
    await updateTaskNote(entry.id, note)
  }

  const handleRetire = async () => {
    if (confirm('Retire this task? It will move to the Hall of Fame.')) {
      await retireTask(entry.task.id)
    }
  }

  const handleRemove = async () => {
    if (confirm('Stop this task from recurring? It will not appear on future days.')) {
      await removePermanentTask(entry.task.id)
    }
  }

  const isDone = entry.status === 'done'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md relative overflow-visible group">
      {/* Left green accent bar if done */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 rounded-l-2xl ${isDone ? 'bg-apple-green' : 'bg-transparent'}`} />

      <div className="flex items-start justify-between mb-3 pl-2">
        <div className="flex flex-col">
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${isDone ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-900'}`}>
            {entry.task.name}
          </h3>
          <span className="text-xs text-gray-400 mt-0.5">
            {entry.task.isPermanent ? 'Recurring' : 'One-off'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-sm font-medium ${isDone ? 'text-apple-green' : 'text-gray-400'}`}>
            {isDone ? 'Done' : 'Not done'}
          </span>
          <Toggle 
            checked={isDone} 
            onChange={handleToggle} 
            disabled={!isEditMode} 
          />
          
          {isEditMode && entry.task.isPermanent && (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 text-sm overflow-hidden">
                    <button 
                      onClick={() => { setShowMenu(false); handleRetire(); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-amber-600 font-medium transition-colors"
                    >
                      <Trophy size={16} />
                      Retire to Hall of Fame
                    </button>
                    <button 
                      onClick={() => { setShowMenu(false); handleRemove(); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-red-600 font-medium transition-colors"
                    >
                      <Trash2 size={16} />
                      Stop Recurring
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pl-2">
        <DebouncedTextarea 
          initialValue={entry.note} 
          onSave={handleSaveNote} 
          disabled={!isEditMode} 
        />
      </div>
    </div>
  )
}
