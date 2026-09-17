'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Trophy, History, LayoutDashboard, LogOut } from 'lucide-react'
import { logout } from '@/app/actions'

export function NavBar({ isEditMode }: { isEditMode: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: History },
    { name: 'Hall of Fame', path: '/hall-of-fame', icon: Trophy },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 mb-8">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-apple-blue/10 text-apple-blue' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            {isEditMode ? 'Edit Mode' : 'View Mode'}
          </span>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            title="Exit"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}
