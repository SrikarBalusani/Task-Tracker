import { getDashboardData, checkIsEditMode, addCustomTask } from '@/app/actions'
import { TaskCard } from '@/components/TaskCard'
import { NavBar } from '@/components/NavBar'
import { Plus } from 'lucide-react'
import { revalidatePath } from 'next/cache'

// Using server components directly
export default async function DashboardPage() {
  const isEditMode = await checkIsEditMode()
  
  // Get today's local date string "YYYY-MM-DD"
  const tzOffset = (new Date()).getTimezoneOffset() * 60000
  const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10)
  
  const dayRecord = await getDashboardData(localISOTime)
  
  const permanentEntries = dayRecord.entries.filter(e => e.task.isPermanent)
  const customEntries = dayRecord.entries.filter(e => !e.task.isPermanent)
  
  const handleAddCustom = async (formData: FormData) => {
    'use server'
    const name = formData.get('name') as string
    if (!name.trim()) return
    await addCustomTask(localISOTime, name, false)
  }

  const handleAddPermanent = async (formData: FormData) => {
    'use server'
    const name = formData.get('name') as string
    if (!name.trim()) return
    await addCustomTask(localISOTime, name, true)
  }

  return (
    <div className="min-h-screen pb-20">
      <NavBar isEditMode={isEditMode} />
      
      <main className="max-w-3xl mx-auto px-4 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Today</h1>
          <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pl-1">Recurring Tasks</h2>
          {permanentEntries.length > 0 ? (
            <div className="space-y-3">
              {permanentEntries.map(entry => (
                <TaskCard key={entry.id} entry={entry} isEditMode={isEditMode} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic pl-1">No recurring tasks.</p>
          )}
        </section>

        {customEntries.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pl-1">One-off Tasks</h2>
            <div className="space-y-3">
              {customEntries.map(entry => (
                <TaskCard key={entry.id} entry={entry} isEditMode={isEditMode} />
              ))}
            </div>
          </section>
        )}

        {isEditMode && (
          <section className="pt-8 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <form action={handleAddCustom} className="flex gap-3">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Add a task for today..." 
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-apple-blue transition-shadow text-sm"
                  required
                />
                <button type="submit" className="bg-gray-900 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors text-sm">
                  <Plus size={16} />
                  Add Today
                </button>
              </form>
              
              <div className="mt-4 pt-4 border-t border-gray-50">
                <form action={handleAddPermanent} className="flex gap-3">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="New recurring task..." 
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-apple-blue transition-shadow text-sm"
                    required
                  />
                  <button type="submit" className="bg-apple-blue text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-600 transition-colors text-sm">
                    <Plus size={16} />
                    Add Recurring
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
