'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Inicio', href: '/' },
  { label: 'Cómo funciona', href: '/como-funciona' },
  { label: '¿Eres tú?', href: '/eres-tu' },
  { label: 'Empieza aquí', href: '/mentalidad' },
  { label: 'El Programa', href: '/programa' },
  { label: 'El Ejército', href: '/ejercito-preview' },
  { label: 'El Muro', href: '/el-muro' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

function NavLinks({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <ul className="space-y-0.5">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClose}
              className={[
                'flex items-center px-2 py-1.5 rounded-sm text-sm transition-colors',
                active
                  ? 'text-white font-medium bg-white/5'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5',
              ].join(' ')}
              style={
                active
                  ? { borderLeft: '2px solid #1D9E75', paddingLeft: '6px' }
                  : { borderLeft: '2px solid transparent', paddingLeft: '6px' }
              }
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default function PublicSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] shrink-0 h-screen sticky top-0 bg-zinc-950 border-r border-zinc-800">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-zinc-800">
          <Link
            href="/"
            className="text-sm font-bold tracking-widest uppercase text-white hover:opacity-70 transition-opacity"
          >
            Rentabilismo
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <NavLinks pathname={pathname} />
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-800 p-3 space-y-1">
          <Link
            href="/login"
            className="flex items-center px-2 py-1.5 rounded-sm text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/registro"
            className="flex items-center justify-center rounded-md bg-white text-zinc-950 text-sm font-medium h-9 px-4 hover:bg-zinc-200 transition-colors"
          >
            Únete gratis
          </Link>
          <hr className="border-zinc-800 my-2" />
          <p className="px-2 text-xs text-zinc-600">Rentabilismo · Pablo García Dacosta</p>
          <p className="px-2 text-xs text-zinc-600">
            <Link href="/aviso-legal" className="hover:text-zinc-400 transition-colors">Aviso legal</Link>
            {' · '}
            <Link href="/privacidad" className="hover:text-zinc-400 transition-colors">Privacidad</Link>
            {' · '}
            <Link href="/cookies" className="hover:text-zinc-400 transition-colors">Cookies</Link>
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-12 bg-zinc-950 border-b border-zinc-800">
        <Link
          href="/"
          className="text-sm font-bold tracking-widest uppercase text-white"
        >
          Rentabilismo
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-zinc-400 hover:text-white transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-64 bg-zinc-950 h-full border-r border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-bold tracking-widest uppercase text-white"
              >
                Rentabilismo
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              <NavLinks pathname={pathname} onClose={() => setMobileOpen(false)} />
            </nav>

            {/* Footer */}
            <div className="border-t border-zinc-800 p-3 space-y-1">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-2 py-1.5 rounded-sm text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-md bg-white text-zinc-950 text-sm font-medium h-9 px-4 hover:bg-zinc-200 transition-colors"
              >
                Únete gratis
              </Link>
              <hr className="border-zinc-800 my-2" />
              <p className="px-2 text-xs text-zinc-600">Rentabilismo · Pablo García Dacosta</p>
              <p className="px-2 text-xs text-zinc-600">
                <Link href="/aviso-legal" onClick={() => setMobileOpen(false)} className="hover:text-zinc-400 transition-colors">Aviso legal</Link>
                {' · '}
                <Link href="/privacidad" onClick={() => setMobileOpen(false)} className="hover:text-zinc-400 transition-colors">Privacidad</Link>
                {' · '}
                <Link href="/cookies" onClick={() => setMobileOpen(false)} className="hover:text-zinc-400 transition-colors">Cookies</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
