"use client";

import { useState } from "react";
import { updateStatusIzinAction } from "@/actions/perizinan";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function TombolAksiIzin({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (status: 'Disetujui' | 'Ditolak') => {
    // Tanya dulu supaya admin tidak salah klik
    if (!confirm(`Yakin ingin ${status} izin ini?`)) return;

    setLoading(true);
    const hasil = await updateStatusIzinAction(id, status);
    if (hasil.error) alert("❌ Gagal: " + hasil.error);
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center text-blue-500 py-2"><Loader2 className="animate-spin" size={24}/></div>;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button 
        onClick={() => handleUpdate('Disetujui')} 
        className="flex items-center justify-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm border border-green-200 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
      >
        <CheckCircle2 size={16} /> Setujui
      </button>
      <button 
        onClick={() => handleUpdate('Ditolak')} 
        className="flex items-center justify-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-sm border border-red-200 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
      >
        <XCircle size={16} /> Tolak
      </button>
    </div>
  );
}