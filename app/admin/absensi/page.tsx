import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Search, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import ExportButton from "./ExportButton";

export default async function DataAbsensiPage() {
  const supabase = await createClient();

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
          <p className="text-gray-600 mt-1">Pantau jam masuk, pulang, dan durasi kerja karyawan.</p>
        </div>
        
        {/* Tombol Export yang baru saja kita buat diletakkan di sini! */}
        {absensiList && absensiList.length > 0 && (
          <ExportButton dataAbsensi={absensiList} />
        )}
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Baris Pencarian (Visual) */}
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
                <th className="px-6 py-4 font-semibold">Waktu Masuk</th>
                <th className="px-6 py-4 font-semibold">Waktu Pulang</th>
                <th className="px-6 py-4 font-semibold">Durasi Kerja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              
              {error && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-red-500">Gagal memuat data: {error.message}</td></tr>
              )}
              {!error && (!absensiList || absensiList.length === 0) && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Belum ada data absensi.</td></tr>
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
                  
                  {/* Kolom Jam Masuk + Status */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="font-mono text-sm font-bold text-gray-800">{absen.jam_masuk || "--:--"}</span>
                      {absen.status_masuk === 'Terlambat' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 uppercase tracking-wider">
                          <AlertCircle size={10} /> Terlambat
                        </span>
                      ) : absen.status_masuk === 'Tepat Waktu' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-100 text-green-700 uppercase tracking-wider">
                          <CheckCircle2 size={10} /> Tepat Waktu
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Kolom Jam Pulang + Status */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      {absen.jam_pulang ? (
                        <>
                          <span className="font-mono text-sm font-bold text-gray-800">{absen.jam_pulang}</span>
                          {absen.status_pulang === 'Pulang Lebih Awal' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 uppercase tracking-wider">
                              <AlertCircle size={10} /> Pulang Awal
                            </span>
                          ) : absen.status_pulang === 'Tepat Waktu' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 uppercase tracking-wider">
                              <CheckCircle2 size={10} /> Tepat Waktu
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-gray-400 font-mono text-xs italic">Belum Pulang</span>
                      )}
                    </div>
                  </td>

                  {/* Kolom Durasi */}
                  <td className="px-6 py-4">
                    {absen.durasi_kerja ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <Clock size={14} /> {absen.durasi_kerja}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
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