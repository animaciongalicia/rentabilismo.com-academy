'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Layers, Shield } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface UserInfo {
  initials: string
  fullName: string
  accessLabel: string | null
}

interface SidebarNavClientProps {
  userInfo: UserInfo | null
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Módulos', href: '/modulos', icon: <Layers size={16} /> },
  { label: 'El Ejército', href: '/ejercito', icon: <Shield size={16} /> },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard' || pathname.startsWith('/dashboard/')
  return pathname === href || pathname.startsWith(href + '/')
}

export function SidebarNavClient({ userInfo }: SidebarNavClientProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <Link
          href="/dashboard"
          className="text-sm font-bold tracking-widest uppercase text-foreground hover:opacity-70 transition-opacity"
        >
          Rentabilismo
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    'flex items-center gap-2.5 px-2 py-1.5 rounded-sm text-sm transition-colors',
                    active
                      ? 'text-foreground font-medium bg-muted/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
                  ].join(' ')}
                  style={
                    active
                      ? { borderLeft: '2px solid #1D9E75', paddingLeft: '6px' }
                      : { borderLeft: '2px solid transparent', paddingLeft: '6px' }
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Perfil — footer */}
      {userInfo && (
        <div className="border-t border-border p-3">
          <Link
            href="/perfil"
            className="flex items-center gap-2.5 rounded-sm px-2 py-1.5 hover:bg-muted/50 transition-colors group"
          >
            <div className="w-7 h-7 rounded-full bg-[#1D9E75] flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-white leading-none">
                {userInfo.initials}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate leading-tight">
                {userInfo.fullName}
              </p>
              {userInfo.accessLabel && (
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {userInfo.accessLabel}
                </p>
              )}
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
