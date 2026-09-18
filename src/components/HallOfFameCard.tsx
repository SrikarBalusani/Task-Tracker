'use client'

import { useState } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'
import { unretireTask, deleteRetiredTask } from '@/app/actions'

export function HallOfFameCard({ task, isEditMode }: { task: any, isEditMode: boolean }) {
    const [hidden, setHidden] = useState(false)

    const handleUndo = async () => {
        if (!confirm('Bring this task back to your active routine?')) return
        setHidden(true)
        await unretireTask(task.id)
    }

    const handleDelete = async () => {
        if (!confirm('Permanently delete this from the Hall of Fame? This cannot be undone.')) return
        setHidden(true)
        await deleteRetiredTask(task.id)
    }

    if (hidden) return null

    return (
        <div className="bg-slate-800/70 rounded-2xl p-6 shadow-lg border border-amber-400/20 flex flex-col items-center text-center group transition-all hover:shadow-xl hover:border-amber-400/40">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md group-hover:scale-110 transition-transform">
                🏆
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{task.name}</h3>
            <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full mb-4">
                Completed on {task.retiredAt ? new Date(task.retiredAt).toLocaleDateString() : 'Unknown'}
            </span>

            {isEditMode && (
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={handleUndo}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-blue-200 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-full transition-colors"
                    >
                        <RotateCcw size={13} />
                        Back to Active
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full transition-colors"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}