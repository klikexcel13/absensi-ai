import { createClient } from "@/lib/supabase/server";
import FormIzin from "./FormIzin";
import { Clock, CheckCircle2, XCircle, FileText } from "lucide-react";

export default async function PengajuanIzinPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil Riwayat Izin
  const { data: riwayatIzin } = await supabase
    .from("perizinan")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 pb-32">
      
      {/* HEADER BERSIH TANPA TOMBOL KEMBALI */}
      <header>
        <h2 className="text-2xl font-bold text-gray-800">Pengajuan Izin</h2>
        <p className="text-sm text-gray-500 mt-1">Ajukan absen atau pantau statusnya.</p>
      </header>

      {/* FORMULIR PENGAJUAN */}
      <FormIzin />

      {/* PANEL RIWAYAT PENGAJUAN */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FileText size={18} className="text-blue-500"/> Riwayat Pengajuanmu
        </h3>

        {!riwayatIzin || riwayatIzin.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 text-sm">
            Belum ada riwayat pengajuan izin.
          </div>
        ) : (
          <div className="space-y-3">
            {riwayatIzin.map((izin) => (
              <div key={izin.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  izin.status === 'Disetujui' ? 'bg-green-500' : 
                  izin.status === 'Ditolak' ? 'bg-red-500' : 'bg-orange-400'
                }`}></div>

                <div className="flex justify-between items-start pl-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Tanggal Izin</span>
                    <p className="font-bold text-gray-800">
                      {new Date(izin.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    izin.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 
                    izin.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {izin.status === 'Disetujui' ? <CheckCircle2 size={12}/> : 
                     izin.status === 'Ditolak' ? <XCircle size={12}/> : <Clock size={12}/>}
                    {izin.status}
                  </span>
                </div>

                <div className="pl-2 pt-2 border-t border-gray-50 mt-1 flex justify-between items-end">
                  <div>
                    <span className="text-xs text-gray-500 block">Keterangan:</span>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">{izin.keterangan}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                    {izin.tipe}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}