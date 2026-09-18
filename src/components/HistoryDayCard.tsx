'use client'

import { useState } from 'react'
import { ChevronDown, Calendar, Trash2 } from 'lucide-react'
import { getTaskStyle } from '@/lib/theme'
import { deleteHistoryEntry } from '@/app/actions'

export function HistoryDayCard({ day, isEditMode }: { day: any, isEditMode: boolean }) {
    const [open, setOpen] = useState(false)
    const [entries, setEntries] = useState(day.entries)

    const handleDelete = async (entryId: string) => {
        if (!confirm('Remove this completed task from history?')) return
        setEntries((current: any[]) => current.filter(e => e.id !== entryId))
        await deleteHistoryEntry(entryId)
    }

    if (entries.length === 0) return null

    return (
        <div className="bg-slate-800/70 rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-700/30 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Calendar size={20} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-white text-lg">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                        <p className="text-sm font-medium text-slate-400 mt-0.5">
                            {entries.length} task{entries.length !== 1 ? 's' : ''} completed
                        </p>
                    </div>
                </div>
                <ChevronDown className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="p-4 border-t border-slate-700/50 space-y-3">
                    {entries.map((entry: any) => {
                        const style = getTaskStyle(entry.task.name)
                        return (
                            <div key={entry.id} className="flex items-start justify-between gap-3 bg-slate-900/40 rounded-xl p-4 border border-slate-700/40">
                                <div className="flex items-start gap-3">
                                    <div className={`text-xl select-none w-9 h-9 flex items-center justify-center rounded-xl shrink-0 ${style.iconBg}`}>
                                        {style.emoji}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">{entry.task.name}</h4>
                                        {entry.note && <p className="text-sm text-slate-400 mt-1">{entry.note}</p>}
                                    </div>
                                </div>
                                {isEditMode && (
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors shrink-0"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}