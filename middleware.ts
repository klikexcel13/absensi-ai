import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Fungsi ini akan dieksekusi Next.js sebelum halaman apapun dimuat
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// Menentukan halaman mana saja yang dijaga oleh Satpam
export const config = {
  matcher: [
    /*
     * Match semua request paths KECUALI untuk:
     * - _next/static (file statis Next.js)
     * - _next/image (optimasi gambar Next.js)
     * - favicon.ico (ikon website)
     * - file gambar (svg, png, jpg, dll)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}