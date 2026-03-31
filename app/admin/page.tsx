// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { Users, UserCheck, Clock, AlertTriangle, ArrowRight, CalendarDays, Search } from "lucide-react";
import Link from 'next/link';
// ... (sisa kode di bawahnya biarkan saja)

// Tambahkan searchParams sebagai Promise (standar Next.js terbaru)
export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tanggal?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

// ... kode import lainnya (jika ada)

export default function AdminPage() {
  return (
    <div>
      {/* Tanpa import di atas, baris di bawah ini yang bikin web kamu crash */}
      <Link href="/dashboard">Ke Dashboard</Link> 
    </div>
  )
}

  // 1. Tentukan Tanggal: Default ke Hari Ini kalau tidak ada parameter
  const hariIni = new Date().toLocaleDateString('en-CA'); // Format YYYY-MM-DD
  const selectedDate = params.tanggal || hariIni;

  // 2. Ambil Total Karyawan dari tabel profiles
  const { count: totalKaryawan } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })
    .eq("role", "karyawan");

  // 3. Ambil Data Absen BERDASARKAN TANGGAL YANG DIPILIH
  const { data: absenHariIni } = await supabase
    .from("absensi")
    .select("status_masuk, profiles(full_name), jam_masuk")
    .eq("tanggal", selectedDate)
    .order("jam_masuk", { ascending: false });

  // 4. Mesin Penghitung Otomatis
  const totalHadir = absenHariIni?.length || 0;
  const totalTerlambat = absenHariIni?.filter(a => a.status_masuk === 'Terlambat').length || 0;
  const totalTepatWaktu = absenHariIni?.filter(a => a.status_masuk === 'Tepat Waktu').length || 0;
  const totalBelumHadir = (totalKaryawan || 0) - totalHadir;

  // Format tanggal untuk ditampilkan di layar (misal: Senin, 15 Maret 2026)
  const tanggalFormatLayar = new Date(selectedDate).toLocaleDateString('id-ID', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });

  return (
    <div className="space-y-8">
      {/* Header Dashboard & Panel Filter */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold">Selamat Datang, Admin! 👋</h2>
          <p className="mt-2 text-blue-100 text-lg">Ringkasan kehadiran untuk: <strong className="text-white">{tanggalFormatLayar}</strong></p>
        </div>

        {/* Form Filter Tanggal */}
        <form className="bg-white/20 p-2 rounded-xl border border-white/20 backdrop-blur-sm flex items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 flex-1">
            <CalendarDays size={18} className="text-gray-400" />
            <input 
              type="date" 
              name="tanggal" 
              defaultValue={selectedDate}
              className="bg-transparent border-none text-gray-700 text-sm focus:ring-0 w-full outline-none"
            />
          </div>
          <button type="submit" className="bg-white text-blue-600 p-2.5 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
            <Search size={18} />
          </button>
        </form>
      </header>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-gray-50 text-gray-600 rounded-xl"><Users size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalKaryawan || 0} <span className="text-sm font-normal text-gray-400">Orang</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><UserCheck size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Hadir</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalHadir} <span className="text-sm font-normal text-gray-400">Orang</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl"><Clock size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tepat Waktu</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalTepatWaktu} <span className="text-sm font-normal text-gray-400">Orang</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Terlambat</p>
            <h3 className="text-2xl font-bold text-red-600">{totalTerlambat} <span className="text-sm font-normal text-gray-400">Orang</span></h3>
          </div>
        </div>

      </div>

      {/* Area Aktivitas Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Tabel Mini Absen Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Riwayat Masuk ({tanggalFormatLayar})</h3>
            <Link href="/admin/absensi" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              Data Lengkap <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {absenHariIni && absenHariIni.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {absenHariIni.map((absen, idx) => (
                  <li key={idx} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold shadow-inner">
                        {absen.profiles?.full_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{absen.profiles?.full_name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {absen.jam_masuk}
                        </p>
                      </div>
                    </div>
                    {absen.status_masuk === 'Terlambat' ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-red-50 text-red-700 uppercase tracking-wider border border-red-100">Terlambat</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-green-50 text-green-700 uppercase tracking-wider border border-green-100">Tepat Waktu</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-gray-400 gap-3">
                <CalendarDays size={48} className="text-gray-200" />
                <p>Tidak ada data absensi pada tanggal ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Status Singkat */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-4">Persentase Kehadiran</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Hadir ({totalHadir}/{totalKaryawan})</span>
                <span className="font-bold text-blue-600">
                  {totalKaryawan ? Math.round((totalHadir / totalKaryawan) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${totalKaryawan ? (totalHadir / totalKaryawan) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${totalBelumHadir === 0 ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
              <p className={`text-sm font-medium ${totalBelumHadir === 0 ? 'text-green-800' : 'text-orange-800'}`}>
                {totalBelumHadir === 0 ? (
                  <span>Luar biasa! <strong>Semua karyawan</strong> hadir pada tanggal ini. 🎉</span>
                ) : (
                  <span>Ada <strong className="text-lg">{totalBelumHadir}</strong> karyawan yang tidak/belum absen masuk pada tanggal ini.</span>
                )}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}