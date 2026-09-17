import { getHallOfFame, checkIsEditMode } from '@/app/actions'
import { NavBar } from '@/components/NavBar'
import { Trophy } from 'lucide-react'

export default async function HallOfFamePage() {
  const isEditMode = await checkIsEditMode()
  const tasks = await getHallOfFame()

  return (
    <div className="min-h-screen pb-20">
      <NavBar isEditMode={isEditMode} />
      
      <main className="max-w-3xl mx-auto px-4 space-y-8">
        <header className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-500 mb-4 shadow-sm">
            <Trophy size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hall of Fame</h1>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">Celebrating the goals you've fully completed and retired.</p>
        </header>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100/50 flex flex-col items-center text-center group transition-all hover:shadow-md hover:border-amber-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  🏆
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.name}</h3>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Retired on {task.retiredAt ? new Date(task.retiredAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No tasks in the Hall of Fame yet. Keep pushing!</p>
          </div>
        )}
      </main>
    </div>
  )
}
