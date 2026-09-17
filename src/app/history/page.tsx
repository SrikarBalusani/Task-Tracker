import { getHistory, checkIsEditMode } from '@/app/actions'
import { NavBar } from '@/components/NavBar'
import { ChevronDown, Calendar } from 'lucide-react'
import { TaskCard } from '@/components/TaskCard'

export default async function HistoryPage() {
  const isEditMode = await checkIsEditMode()
  const history = await getHistory()
  
  // Filter out today
  const tzOffset = (new Date()).getTimezoneOffset() * 60000
  const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10)
  
  const pastDays = history.filter(day => day.date !== localISOTime)

  return (
    <div className="min-h-screen pb-20">
      <NavBar isEditMode={isEditMode} />
      
      <main className="max-w-3xl mx-auto px-4 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">History</h1>
          <p className="text-gray-500 mt-1">Look back at your past progress.</p>
        </header>

        <div className="space-y-4">
          {pastDays.length > 0 ? (
            pastDays.map(day => (
              <details key={day.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {day.entries.filter(e => e.status === 'done').length} / {day.entries.length} completed
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                
                <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
                  {day.entries.length > 0 ? (
                    day.entries.map(entry => (
                      <TaskCard key={entry.id} entry={entry} isEditMode={false} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">No tasks recorded for this day.</p>
                  )}
                </div>
              </details>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
              <p>No past history yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
