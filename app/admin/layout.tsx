"use client"; // Wajib ditambahkan karena kita butuh State untuk tombol klik

import { useState } from "react";
import { LogOut, Users, Settings, LayoutDashboard, Menu, ClipboardList } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // State untuk menyimpan memori: apakah sidebar sedang buka atau tutup?
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      
      {/* Sidebar Kiri dengan Animasi Lebar yang Mulus */}
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64 p-6 opacity-100" : "w-0 p-0 border-r-0 opacity-0 overflow-hidden"
        }`}
      >
        {/* Inner Container: Dibikin fixed width (w-52) agar teks tidak gepeng saat sidebar mengecil */}
        <div className="w-52 flex flex-col h-full">
          <h1 className="text-2xl font-bold text-blue-600 mb-8">Admin Panel</h1>
          
          <nav className="flex-1 space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors">
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link href="/admin/karyawan" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors">
              <Users size={20} /> Data Karyawan
            </Link>
            
            {/* 2. TAMBAHKAN MENU ABSENSI DI SINI */}
            <Link href="/admin/absensi" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors">
              <ClipboardList size={20} /> Rekap Absensi
            </Link>

            <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <Settings size={20} /> Pengaturan
            </Link>
          </nav>

          {/* Tombol Logout */}
          <form action={logoutAction} className="mt-auto">
            <button 
              type="submit" 
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors w-full text-left"
            >
              <LogOut size={20} /> Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Area Kanan (Topbar + Konten Utama) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar (Header Atas) untuk Tombol Toggle */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 shrink-0 shadow-sm z-10">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors focus:outline-none"
            title="Sembunyikan/Tampilkan Sidebar"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Area Konten Utama yang bisa di-scroll */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}