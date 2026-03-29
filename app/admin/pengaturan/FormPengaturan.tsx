"use client";

import { useState } from "react";
import { updatePengaturanAction } from "@/actions/pengaturan";
import { Clock, Save, Loader2, MapPin, Navigation, Compass } from "lucide-react";

export default function FormPengaturan({ 
  jamMasukAwal, jamPulangAwal, latAwal, longAwal, radiusAwal 
}: { 
  jamMasukAwal: string, jamPulangAwal: string, latAwal: string, longAwal: string, radiusAwal: number 
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.set("jam_masuk", formData.get("jam_masuk") + ":00");
    formData.set("jam_pulang", formData.get("jam_pulang") + ":00");

    const hasil = await updatePengaturanAction(formData);
    if (hasil?.error) alert("❌ Gagal: " + hasil.error);
    if (hasil?.success) alert("✅ " + hasil.success);
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* SEKSI 1: PENGATURAN JAM */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Clock size={20} className="text-blue-500" /> Jam Operasional
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Batas Jam Masuk</label>
            <input type="time" name="jam_masuk" defaultValue={jamMasukAwal} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 font-mono text-lg"/>
            <p className="text-xs text-gray-500">Lewat jam ini = Terlambat</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Batas Jam Pulang</label>
            <input type="time" name="jam_pulang" defaultValue={jamPulangAwal} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 font-mono text-lg"/>
            <p className="text-xs text-gray-500">Kurang dari jam ini = Pulang Awal</p>
          </div>
        </div>
      </div>

      {/* SEKSI 2: PENGATURAN LOKASI (BARU) */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
          <MapPin size={20} className="text-red-500" /> Koordinat Kantor (Geofencing)
        </h3>
        
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4 text-sm text-blue-800">
          <strong>Tips:</strong> Buka Google Maps di browser, klik kanan pada titik gedung kantormu, lalu klik angka koordinatnya untuk menyalin. Pisahkan angka Latitude (kiri) dan Longitude (kanan).
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1"><Navigation size={14}/> Latitude</label>
            <input type="text" name="lat_kantor" defaultValue={latAwal} required placeholder="Contoh: -6.4025" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 font-mono"/>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1"><Compass size={14}/> Longitude</label>
            <input type="text" name="long_kantor" defaultValue={longAwal} required placeholder="Contoh: 106.7942" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 font-mono"/>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">Batas Radius Absensi (Meter)</label>
          <div className="flex items-center gap-3">
            <input type="number" name="radius_meter" defaultValue={radiusAwal} required min="10" className="w-32 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 font-mono text-lg"/>
            <span className="text-gray-600 font-medium">Meter</span>
          </div>
          <p className="text-xs text-gray-500">Karyawan tidak bisa absen jika jaraknya melebihi batas ini.</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Simpan Pengaturan
        </button>
      </div>
    </form>
  );
}