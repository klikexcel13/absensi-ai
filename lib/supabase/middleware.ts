import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. JIKA BELUM LOGIN: Paksa ke /login jika coba akses /admin atau /karyawan
  if (!user && (path.startsWith('/admin') || path.startsWith('/karyawan'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. JIKA SUDAH LOGIN: Cek Role untuk menentukan tujuan
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // Jika Admin nyasar ke /karyawan atau /login
    if (role === 'admin' && (path.startsWith('/karyawan') || path === '/login' || path === '/')) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Jika Karyawan nyasar ke /admin atau /login
    if (role === 'karyawan' && (path.startsWith('/admin') || path === '/login' || path === '/')) {
      return NextResponse.redirect(new URL('/karyawan', request.url))
    }
  }

  return supabaseResponse
}