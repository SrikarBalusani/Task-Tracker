import { getDashboardData, checkIsEditMode, addCustomTask } from '@/app/actions'
import { TaskList } from '@/components/TaskList'
import { NavBar } from '@/components/NavBar'
import { Zap, Repeat } from 'lucide-react'

export default async function DashboardPage() {
  const isEditMode = await checkIsEditMode()

  const tzOffset = (new Date()).getTimezoneOffset() * 60000
  const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10)

  const dayRecord = await getDashboardData(localISOTime)

  const activeEntries = dayRecord.entries.filter(e => !e.task.isRetired)
  const permanentEntries = activeEntries.filter(e => e.task.isPermanent)
  const customEntries = activeEntries.filter(e => !e.task.isPermanent)

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
    <div className="min-h-screen pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavBar isEditMode={isEditMode} />

      <main className="max-w-6xl mx-auto px-4">
        <header className="mb-8 pt-2">
          <h1 className="text-5xl font-black text-white tracking-tight">Today 🔥</h1>
          <p className="text-slate-400 mt-2 font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* MAIN: Recurring tasks — appears first, never pushed down */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pl-1 mb-2">
              <Repeat className="text-blue-400" size={18} />
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Recurring Routine</h2>
            </div>
            {permanentEntries.length > 0 ? (
              <TaskList initialEntries={permanentEntries} isEditMode={isEditMode} />
            ) : (
              <p className="text-slate-400 text-sm italic pl-1 bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-600">No recurring tasks.</p>
            )}

            {isEditMode && (
              <div className="pt-4">
                <div className="bg-slate-800/60 rounded-[2rem] p-6 shadow-lg border border-slate-700">
                  <form action={handleAddPermanent} className="flex gap-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="New recurring routine task..."
                      className="flex-1 bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium"
                      required
                    />
                    <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.03] active:scale-95 transition-all text-sm shadow-md">
                      <Repeat size={16} />
                      Add Recurring
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>

          {/* SIDEBAR: Extra tasks for today — on the right, doesn't disturb main tasks */}
          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="flex items-center gap-2 pl-1 mb-2">
              <Zap className="text-amber-400" size={18} />
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Extra Tasks</h2>
            </div>

            {customEntries.length > 0 ? (
              <TaskList initialEntries={customEntries} isEditMode={isEditMode} />
            ) : (
              <p className="text-slate-400 text-sm italic pl-1 bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-600">Nothing extra yet today.</p>
            )}

            {isEditMode && (
              <div className="bg-slate-800/60 rounded-[1.5rem] p-5 shadow-lg border border-slate-700">
                <form action={handleAddCustom} className="flex flex-col gap-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Something extra you did today..."
                    className="w-full bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm font-medium"
                    required
                  />
                  <button type="submit" className="bg-gradient-to-r from-amber-400 to-pink-500 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-all text-sm shadow-md">
                    <Zap size={16} />
                    Add Extra Task
                  </button>
                </form>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}