import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_PREFIXES = ['/dashboard', '/onboarding']

const PUBLIC_PATHS = [
  '/',
  '/como-funciona',
  '/dolores',
  '/mentalidad',
  '/programa',
  '/cuartel-general',
  '/el-muro',
  '/pricing',
  '/login',
  '/register',
  '/auth/callback',
]

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  // Rutas protegidas: redirigir al login si no hay sesión
  if (isProtectedPath(pathname) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Lógica de onboarding para usuarios autenticados
  if (
    user &&
    (pathname.startsWith('/onboarding') || pathname.startsWith('/dashboard'))
  ) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed_at')
      .eq('id', user.id)
      .single()

    const completed = !!profile?.onboarding_completed_at

    // Ya completó onboarding → saltar al dashboard
    if (pathname.startsWith('/onboarding') && completed) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Aún no completó onboarding → forzar onboarding
    if (pathname.startsWith('/dashboard') && !completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
}
