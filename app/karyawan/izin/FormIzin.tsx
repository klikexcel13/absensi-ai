"use client";

import { useState } from "react";
import { ajukanIzinAction } from "@/actions/perizinan";
import { Send, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FormIzin() {
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState<{tipe: 'sukses'|'error', teks: string} | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPesan(null);

    const formData = new FormData(e.currentTarget);
    const hasil = await ajukanIzinAction(formData);

    if (hasil?.error) {
      setPesan({ tipe: 'error', teks: hasil.error });
    } else if (hasil?.success) {
      setPesan({ tipe: 'sukses', teks: hasil.success });
      (e.target as HTMLFormElement).reset(); // Kosongkan form
      router.refresh(); // REFRESH DATA RIWAYAT SECARA OTOMATIS!
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {pesan && (
        <div className={`p-4 rounded-xl flex gap-3 text-sm font-medium animate-in fade-in zoom-in duration-300 ${pesan.tipe === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {pesan.tipe === 'error' ? <XCircle size={20} className="shrink-0" /> : <CheckCircle2 size={20} className="shrink-0" />}
          <p>{pesan.teks}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Tanggal Izin/Sakit</label>
          <input type="date" name="tanggal" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"/>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Tipe Pengajuan</label>
          <select name="tipe" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white">
            <option value="Sakit">Sakit</option>
            <option value="Izin">Izin (Keperluan Lain)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Keterangan / Alasan</label>
          <textarea name="keterangan" required rows={3} placeholder="Tuliskan alasanmu secara singkat..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 resize-none"></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          Kirim Pengajuan
        </button>
      </form>
    </div>
  );
}