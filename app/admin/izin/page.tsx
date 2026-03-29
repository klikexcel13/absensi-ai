// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
// ... (sisa kode di bawahnya biarkan saja)

export default async function PersetujuanIzinPage() {
  const supabase = await createClient();

  // Ambil semua data izin dan nama karyawannya
  const { data: daftarIzin } = await supabase
    .from("perizinan")
    .select(`*, profiles(full_name)`)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-gray-800">Persetujuan Izin</h2>
        <p className="text-gray-600 mt-1">Kelola permohonan sakit dan izin karyawan di sini.</p>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Tanggal Diajukan</th>
                <th className="px-6 py-4 font-semibold">Nama Karyawan</th>
                <th className="px-6 py-4 font-semibold">Tipe & Keterangan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!daftarIzin || daftarIzin.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <FileText size={40} className="mx-auto mb-3 text-gray-300"/>
                    Hore! Belum ada pengajuan izin yang menunggu.
                  </td>
                </tr>
              ) : (
                daftarIzin.map((izin) => (
                  <tr key={izin.id} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {new Date(izin.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    
                    <td className="px-6 py-4 font-medium text-blue-600">
                      {izin.profiles?.full_name || "Pengguna Tidak Dikenal"}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 font-bold text-[10px] rounded uppercase tracking-wider mb-1">
                        {izin.tipe}
                      </span>
                      <p className="text-gray-600 text-xs line-clamp-2">{izin.keterangan}</p>
                    </td>
                    
                    <td className="px-6 py-4">
                      {izin.status === 'Menunggu' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 uppercase tracking-wider">
                          <Clock size={12} /> Menunggu
                        </span>
                      )}
                      {izin.status === 'Disetujui' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-green-100 text-green-700 uppercase tracking-wider">
                          <CheckCircle2 size={12} /> Disetujui
                        </span>
                      )}
                      {izin.status === 'Ditolak' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-red-100 text-red-700 uppercase tracking-wider">
                          <XCircle size={12} /> Ditolak
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 align-middle">
                      {/* Tampilkan tombol HANYA jika status masih 'Menunggu' */}
                      {izin.status === 'Menunggu' ? (
                        <TombolAksiIzin id={izin.id} />
                      ) : (
                        <span className="block text-center text-xs font-bold text-gray-400 italic">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}