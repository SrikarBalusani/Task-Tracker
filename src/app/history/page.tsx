import { getHistory, checkIsEditMode } from '@/app/actions'
import { NavBar } from '@/components/NavBar'
import { HistoryDayCard } from '@/components/HistoryDayCard'
import { EmptyHistoryButton } from '@/components/EmptyHistoryButton'

export default async function HistoryPage() {
  const isEditMode = await checkIsEditMode()

  const tzOffset = (new Date()).getTimezoneOffset() * 60000
  const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10)

  const pastDays = await getHistory(localISOTime)

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavBar isEditMode={isEditMode} />

      <main className="max-w-3xl mx-auto px-4 space-y-8">
        <header className="pt-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">History</h1>
          <p className="text-slate-400 mt-1 font-medium">Completed tasks from past days.</p>
        </header>

        <div className="space-y-4">
          {pastDays.length > 0 ? (
            pastDays.map(day => (
              <HistoryDayCard key={day.id} day={day} isEditMode={isEditMode} />
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 bg-slate-800/50 rounded-2xl border border-dashed border-slate-600">
              <p>No completed tasks in your history yet.</p>
            </div>
          )}
        </div>

        {isEditMode && pastDays.length > 0 && (
          <div className="pt-6 flex justify-center">
            <EmptyHistoryButton excludeDate={localISOTime} />
          </div>
        )}
      </main>
    </div>
  )
}