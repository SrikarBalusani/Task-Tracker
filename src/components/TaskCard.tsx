'use client'

import { Toggle } from './Toggle'
import { DebouncedTextarea } from './DebouncedTextarea'
import { MoreHorizontal, Trophy, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toggleTaskStatus, updateTaskNote, removePermanentTask, retireTask, deleteCustomTask } from '@/app/actions'
import { getTaskStyle } from '@/lib/theme'
import confetti from 'canvas-confetti'

export function TaskCard({
  entry,
  isEditMode,
  onToggle
}: {
  entry: any,
  isEditMode: boolean,
  onToggle?: (id: string, checked: boolean) => Promise<void>
}) {
  const [showMenu, setShowMenu] = useState(false)

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#34C759', '#FF9500', '#007AFF', '#FF2D55', '#AF52DE']
      })
    }

    if (onToggle) {
      await onToggle(entry.id, checked)
    } else {
      await toggleTaskStatus(entry.id, checked ? 'done' : 'not_done')
    }
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

  const handleDelete = async () => {
    if (confirm('Delete this task? This cannot be undone.')) {
      await deleteCustomTask(entry.id, entry.task.id)
    }
  }

  const isDone = entry.status === 'done'
  const style = getTaskStyle(entry.task.name)

  return (
    <div
      className={`rounded-3xl p-5 relative overflow-hidden transition-all duration-300 bg-slate-800/70 border border-slate-700/50 shadow-lg ${style.glow} hover:shadow-xl hover:scale-[1.01] ${isDone ? 'opacity-60' : ''}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl ${style.accent}`} />

      <div className="flex items-start justify-between mb-3 pl-3">
        <div className="flex items-center gap-3">
          <div className={`text-2xl select-none w-11 h-11 flex items-center justify-center rounded-2xl ${style.iconBg}`} aria-hidden="true">{style.emoji}</div>
          <div className="flex flex-col">
            <h3 className={`text-lg font-bold text-white transition-all duration-300 ${isDone ? 'line-through decoration-white/50 text-slate-400' : ''}`}>
              {entry.task.name}
            </h3>
            <span className="text-xs text-slate-400 font-medium mt-0.5">
              {entry.task.isPermanent ? 'Recurring Routine' : 'Extra Task'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isDone ? '✓ Done' : 'Not done'}
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
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
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

          {isEditMode && !entry.task.isPermanent && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="pl-3 mt-4">
        <DebouncedTextarea
          initialValue={entry.note}
          onSave={handleSaveNote}
          disabled={!isEditMode}
        />
      </div>
    </div>
  )
}