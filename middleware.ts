import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Rutas que requieren autenticación
const PROTECTED_PREFIXES = ['/dashboard', '/onboarding']

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  // 1. Sin sesión → login (solo para rutas protegidas)
  if (isProtectedPath(pathname) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2-4. Usuario autenticado en rutas protegidas → comprobar estado de perfil
  if (user && isProtectedPath(pathname)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed_at, has_paid, access_expires_at')
      .eq('id', user.id)
      .single()

    const completedOnboarding = !!profile?.onboarding_completed_at
    const accessExpired = profile?.access_expires_at
      ? new Date(profile.access_expires_at) < new Date()
      : false
    const hasActiveAccess = !!profile?.has_paid && !accessExpired

    // — Wizard de onboarding (/onboarding exacto) —
    if (pathname === '/onboarding') {
      if (!completedOnboarding) return response
      if (hasActiveAccess) return NextResponse.redirect(new URL('/dashboard', request.url))
      return NextResponse.redirect(new URL('/onboarding/mentalidad', request.url))
    }

    // — Sub-rutas de onboarding (/onboarding/*) —
    if (pathname.startsWith('/onboarding/')) {
      if (!completedOnboarding) return NextResponse.redirect(new URL('/onboarding', request.url))
      if (hasActiveAccess) return NextResponse.redirect(new URL('/dashboard', request.url))
      return response
    }

    // — Dashboard (requiere pago activo) —
    if (pathname.startsWith('/dashboard')) {
      if (!completedOnboarding) return NextResponse.redirect(new URL('/onboarding', request.url))
      if (!hasActiveAccess) return NextResponse.redirect(new URL('/onboarding/mentalidad', request.url))
      return response
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
}
