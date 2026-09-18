'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { emptyHistory } from '@/app/actions'

export function EmptyHistoryButton({ excludeDate }: { excludeDate: string }) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        if (!confirm('This will permanently delete ALL past history. Are you sure?')) return
        setLoading(true)
        await emptyHistory(excludeDate)
        window.location.reload()
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
            <Trash2 size={16} />
            {loading ? 'Clearing...' : 'Empty History'}
        </button>
    )
}