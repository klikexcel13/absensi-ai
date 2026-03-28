import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Search, CheckCircle2, XCircle } from "lucide-react";

export default async function DataAbsensiPage() {
  const supabase = await createClient();

  // Mengambil data absensi, dan OTOMATIS mengambil nama dari tabel profiles!
  // Inilah kehebatan "Relasi Database" (JOIN) di Supabase.
  // Perhatikan bagian select-nya yang sekarang lebih sederhana
  const { data: absensiList, error } = await supabase
    .from("absensi")
    .select(`
      *,
      profiles (full_name)
    `)
    .order("tanggal", { ascending: false })
    .order("jam_masuk", { ascending: false });

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Rekap Absensi</h2>
          <p className="text-gray-600 mt-1">Pantau kehadiran karyawan setiap harinya.</p>
        </div>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Baris Pencarian & Filter (Visual) */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Cari nama karyawan..."
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <CalendarDays size={18} className="text-blue-500"/>
            <span>Semua Tanggal</span>
          </div>
        </div>

        {/* Tabel Data Absensi */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Nama Karyawan</th>
                <th className="px-6 py-4 font-semibold">Jam Masuk</th>
                <th className="px-6 py-4 font-semibold">Jam Pulang</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              
              {error && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                    Gagal memuat data: {error.message}
                  </td>
                </tr>
              )}

              {!error && (!absensiList || absensiList.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data absensi yang masuk.
                  </td>
                </tr>
              )}

              {/* Looping Data */}
              {!error && absensiList && absensiList.map((absen) => (
                <tr key={absen.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {new Date(absen.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-600">
                    {absen.profiles?.full_name || "Pengguna Tidak Dikenal"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-md font-mono text-xs font-bold">
                      {absen.jam_masuk || "--:--"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {absen.jam_pulang ? (
                      <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md font-mono text-xs font-bold">
                        {absen.jam_pulang}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-mono text-xs">Belum Pulang</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {absen.status === 'hadir' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 size={14} /> Hadir
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <XCircle size={14} /> {absen.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}