import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Clock, Search } from "lucide-react";

export default async function RiwayatAbsensiPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const params = await searchParams;

  const dateNow = new Date();
  const currentMonth = String(dateNow.getMonth() + 1).padStart(2, "0");
  const currentYear = String(dateNow.getFullYear());

  const bulanFilter = params.bulan || currentMonth;
  const tahunFilter = params.tahun || currentYear;

  // --- LOGIKA BARU PENCARIAN TANGGAL ---
  // 1. Tentukan tanggal 1 di bulan yang dipilih
  const startDate = `${tahunFilter}-${bulanFilter}-01`;
  
  // 2. Cari tahu ada berapa hari di bulan tersebut (28, 30, atau 31?)
  const lastDay = new Date(parseInt(tahunFilter), parseInt(bulanFilter), 0).getDate();
  const endDate = `${tahunFilter}-${bulanFilter}-${lastDay}`;

  // 3. Tarik data menggunakan "Di antara tanggal 1 sampai tanggal terakhir" (gte & lte)
  const { data: riwayatList, error } = await supabase
    .from("absensi")
    .select("*")
    .eq("user_id", user?.id)
    .gte("tanggal", startDate) // Lebih dari atau sama dengan tanggal 1
    .lte("tanggal", endDate)   // Kurang dari atau sama dengan tanggal terakhir
    .order("tanggal", { ascending: false });

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 pb-24">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Kehadiran</h2>
        <p className="text-sm text-gray-500 mt-1">Pantau performa absensi kamu.</p>
      </header>

      {/* Panel Filter (Bulan & Tahun) */}
      <form className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
        <select 
          name="bulan" 
          defaultValue={bulanFilter}
          className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          <option value="01">Januari</option>
          <option value="02">Februari</option>
          <option value="03">Maret</option>
          <option value="04">April</option>
          <option value="05">Mei</option>
          <option value="06">Juni</option>
          <option value="07">Juli</option>
          <option value="08">Agustus</option>
          <option value="09">September</option>
          <option value="10">Oktober</option>
          <option value="11">November</option>
          <option value="12">Desember</option>
        </select>

        <select 
          name="tahun" 
          defaultValue={tahunFilter}
          className="w-24 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors">
          <Search size={20} />
        </button>
      </form>

      {/* Daftar Riwayat Absensi */}
      <div className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">Gagal memuat riwayat: {error.message}</p>}
        
        {!error && (!riwayatList || riwayatList.length === 0) && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-3">
            <CalendarDays size={40} className="mx-auto text-gray-300" />
            <p className="text-gray-500 text-sm">Tidak ada data absensi di bulan ini.</p>
          </div>
        )}

        {/* Looping Kartu Riwayat */}
        {!error && riwayatList && riwayatList.map((absen) => (
          <div key={absen.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="font-semibold text-gray-800">
                {new Date(absen.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              {absen.durasi_kerja && (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                  {absen.durasi_kerja}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-gray-600">Masuk: <strong className="text-gray-900">{absen.jam_masuk || "--:--"}</strong></span>
              </div>
              {absen.status_masuk === 'Terlambat' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-red-700 bg-red-50 uppercase">Terlambat</span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-green-700 bg-green-50 uppercase">Tepat Waktu</span>
              )}
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-gray-600">Pulang: <strong className="text-gray-900">{absen.jam_pulang || "--:--"}</strong></span>
              </div>
              {absen.status_pulang === 'Pulang Lebih Awal' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-orange-700 bg-orange-50 uppercase">Awal</span>
              ) : absen.status_pulang === 'Tepat Waktu' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-blue-700 bg-blue-50 uppercase">Tepat Waktu</span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-gray-500 bg-gray-100 uppercase">-</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}