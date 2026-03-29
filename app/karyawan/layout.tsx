import Link from "next/link";
import { Home, History, FileText } from "lucide-react";

export default function KaryawanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Area Konten Utama */}
      {children}

      {/* Bottom Navigation (Home di Tengah!) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-2 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-50">
        
        {/* Tombol Kiri: Izin */}
        <Link href="/karyawan/izin" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors focus:text-blue-600 w-16">
          <FileText size={22} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Izin</span>
        </Link>
        
        {/* Tombol Tengah: Home/Absen (Dibuat Menonjol!) */}
        <Link href="/karyawan" className="flex flex-col items-center relative -top-4 group">
          <div className="bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-200 group-hover:bg-blue-700 group-hover:scale-105 transition-all">
            <Home size={26} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mt-1">Absen</span>
        </Link>
        
        {/* Tombol Kanan: Riwayat */}
        <Link href="/karyawan/riwayat" className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors focus:text-blue-600 w-16">
          <History size={22} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Riwayat</span>
        </Link>

      </div>
    </div>
  );
}