'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Zap, LayoutDashboard, FileText, Plus, FileUser,
  Settings, Menu, X, User
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard',             href: '/dashboard',                icon: LayoutDashboard },
  { label: 'Candidatures',          href: '/dashboard/candidatures',   icon: FileText },
  { label: 'Nouvelle candidature',  href: '/dashboard/apply',          icon: Plus },
  { label: 'Mon CV',                href: '/dashboard/cv',             icon: FileUser },
  { label: 'Paramètres',            href: '/dashboard/settings',       icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-gray-100 w-64 min-h-screen p-4 border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-3 mb-6">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">JobBoost <span className="text-blue-600">AI</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:text-gray-900'
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Mon compte</p>
            <p className="text-xs text-gray-500 truncate">user@jobboost.ai</p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">JobBoost AI</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
