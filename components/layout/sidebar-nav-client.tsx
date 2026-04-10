'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  HelpCircle,
  BookOpen,
  Users,
  Shield,
  Brain,
  UserPlus,
  LogIn,
  LayoutDashboard,
  Layers,
  FileText,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
  hiddenIfNotPaid?: boolean
}

interface UserInfo {
  initials: string
  fullName: string
  accessLabel: string | null
}

interface SidebarNavClientProps {
  hasPaid: boolean
  userInfo: UserInfo | null
}

const DESCUBRIR: NavItem[] = [
  { label: 'Inicio', href: '/', icon: <Home size={16} /> },
  { label: 'Cómo funciona', href: '/como-funciona', icon: <HelpCircle size={16} /> },
  { label: 'El programa', href: '/programa', icon: <BookOpen size={16} /> },
  { label: 'El muro', href: '/el-muro', icon: <Users size={16} /> },
  { label: 'Cuartel General', href: '/cuartel-general', icon: <Shield size={16} /> },
]

const ACCESO: NavItem[] = [
  {
    label: 'Mentalidad',
    href: '/mentalidad',
    icon: <Brain size={16} />,
    badge: 'gratis',
  },
  { label: 'Unirse', href: '/registro', icon: <UserPlus size={16} /> },
  { label: 'Entrar', href: '/login', icon: <LogIn size={16} /> },
]

const MI_ZONA: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Módulos', href: '/modulos', icon: <Layers size={16} /> },
  { label: 'Mis informes', href: '/informes', icon: <FileText size={16} /> },
]

const SECTIONS: NavSection[] = [
  { title: 'Descubrir', items: DESCUBRIR },
  { title: 'Acceso', items: ACCESO },
  { title: 'Mi zona', items: MI_ZONA, hiddenIfNotPaid: true },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function SidebarNavClient({ hasPaid, userInfo }: SidebarNavClientProps) {
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

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            style={section.hiddenIfNotPaid && !hasPaid ? { display: 'none' } : undefined}
          >
            <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
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
                      style={active ? { borderLeft: '2px solid #1D9E75', paddingLeft: '6px' } : { borderLeft: '2px solid transparent', paddingLeft: '6px' }}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom: user info */}
      {userInfo && (
        <div className="border-t border-border p-3">
          <Link
            href="/perfil"
            className="flex items-center gap-2.5 rounded-sm px-2 py-1.5 hover:bg-muted/50 transition-colors group"
          >
            {/* Avatar con iniciales */}
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
