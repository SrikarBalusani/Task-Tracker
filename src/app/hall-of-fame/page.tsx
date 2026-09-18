import { getHallOfFame, checkIsEditMode } from '@/app/actions'
import { NavBar } from '@/components/NavBar'
import { Trophy } from 'lucide-react'
import { HallOfFameCard } from '@/components/HallOfFameCard'

export default async function HallOfFamePage() {
  const isEditMode = await checkIsEditMode()
  const tasks = await getHallOfFame()

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavBar isEditMode={isEditMode} />

      <main className="max-w-3xl mx-auto px-4 space-y-8">
        <header className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 mb-4 shadow-sm">
            <Trophy size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hall of Fame</h1>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">Celebrating the goals you've fully completed.</p>
        </header>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tasks.map(task => (
              <HallOfFameCard key={task.id} task={task} isEditMode={isEditMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>No completed goals yet. Keep pushing!</p>
          </div>
        )}
      </main>
    </div>
  )
}