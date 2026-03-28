import { LogOut, Users, Settings, LayoutDashboard } from "lucide-react";
import { logoutAction } from "@/actions/auth";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Admin Panel</h1>
        
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Users size={20} /> Data Karyawan
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Settings size={20} /> Pengaturan
          </a>
        </nav>

        {/* Tombol Logout yang sudah berfungsi */}
        <form action={logoutAction} className="mt-auto">
          <button 
            type="submit" 
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors w-full text-left"
          >
            <LogOut size={20} /> Keluar
          </button>
        </form>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Selamat Datang, Admin! 👋</h2>
          <p className="text-gray-600 mt-2">Ini adalah pusat kendali sistem absensi Anda.</p>
        </header>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Total Karyawan</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Hadir Hari Ini</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Absen / Izin</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">0</p>
          </div>
        </div>
      </main>
    </div>
  );
}