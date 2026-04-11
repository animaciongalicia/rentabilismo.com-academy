import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Rutas que requieren autenticación
const AUTH_REQUIRED = ['/dashboard', '/modulos', '/ejercito', '/perfil']

// Rutas que además requieren pago activo
const PAID_REQUIRED = ['/dashboard', '/modulos', '/ejercito']

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Gate 1: No autenticado + ruta protegida → login
  if (!user && matchesPrefix(pathname, AUTH_REQUIRED)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Usuario no autenticado en zona pública → pasar
  if (!user) return response

  // Usuario autenticado fuera de rutas protegidas → pasar
  if (!matchesPrefix(pathname, AUTH_REQUIRED)) return response

  // Consultar perfil (una sola query, solo en rutas protegidas)
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_paid, profile_completed')
    .eq('id', user.id)
    .single()

  // Gate 2: Autenticado + sin pago + rutas de pago → /precio
  if (!profile?.has_paid && matchesPrefix(pathname, PAID_REQUIRED)) {
    return NextResponse.redirect(new URL('/precio', request.url))
  }

  // Gate 3: Pagado + perfil incompleto → /perfil/completar
  if (profile?.has_paid && !profile?.profile_completed) {
    if (!pathname.startsWith('/perfil/completar')) {
      return NextResponse.redirect(new URL('/perfil/completar', request.url))
    }
    return response // ya está en /perfil/completar, no redirigir
  }

  // Gate 4: Pagado + perfil completo + /modulos/[slug] (no diagnóstico) + diagnóstico no completado
  if (
    profile?.has_paid &&
    profile?.profile_completed &&
    pathname.startsWith('/modulos/') &&
    !pathname.startsWith('/modulos/diagnostico-inicial')
  ) {
    const { data: diagModule } = await supabase
      .from('modules')
      .select('id')
      .eq('slug', 'diagnostico-inicial')
      .single()

    const { data: progress } = diagModule
      ? await supabase
          .from('user_progress')
          .select('completed_at')
          .eq('user_id', user.id)
          .eq('module_id', diagModule.id)
          .maybeSingle()
      : { data: null }

    if (!progress) {
      return NextResponse.redirect(new URL('/modulos/diagnostico-inicial', request.url))
    }
  }

  // Gate 5: acceso total
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
}
