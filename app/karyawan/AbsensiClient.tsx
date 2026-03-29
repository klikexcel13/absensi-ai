"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, LogIn, LogOut, Loader2, CheckCircle2 } from "lucide-react"; 
import { logoutAction } from "@/actions/auth";
import { saveAbsensiAction } from "@/actions/absensi";
import { useRouter } from "next/navigation"; 

interface AbsensiClientProps {
  userEmail: string;
  absenHariIni: any; 
}

export default function AbsensiClient({ userEmail, absenHariIni }: AbsensiClientProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter(); 

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- FUNGSI MENGAMBIL LOKASI (GPS) ---
  const getLoc = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
        },
        (err) => {
          alert("Gagal mengambil lokasi! Pastikan GPS menyala dan izin browser diberikan.");
        },
        { enableHighAccuracy: true } // Memaksa GPS mencari titik paling akurat
      );
    } else {
      alert("GPS tidak didukung di browser ini.");
    }
  };

  const handleAbsen = async (tipe: 'masuk' | 'pulang') => {
    if (!location) {
      alert("📍 Kunci lokasi kamu dulu dengan menekan tombol 'Ambil Lokasi' di bawah peta!");
      return;
    }

    setLoading(true);
    const hasil = await saveAbsensiAction(tipe, location);
    
    if (hasil?.error) alert("❌ " + hasil.error);
    if (hasil?.success) {
      alert("✅ " + hasil.success);
      router.refresh(); 
    }
    setLoading(false);
  };

  if (!mounted || !time) return <div className="p-8 text-center text-gray-400">Menyiapkan sistem absensi...</div>;

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* Header User */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start text-left">
          <div>
            <p className="opacity-80 text-sm">Selamat Bekerja,</p>
            <h2 className="text-xl font-bold truncate w-48">{userEmail}</h2>
          </div>
          <form action={logoutAction}>
             <button type="submit" className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors border border-white/10">
                <LogOut size={20} />
             </button>
          </form>
        </div>
        
        <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-sm relative z-10 border border-white/10">
          <Clock size={16} />
          <span>{time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      {/* Kartu Utama Absen */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="space-y-1 text-center">
          <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase">Jam Digital</h3>
          <p className="text-5xl font-black text-gray-900 tabular-nums tracking-tighter">
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        {/* --- FITUR BARU: GOOGLE MAPS & TOMBOL LOKASI --- */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
              <MapPin size={16} className="text-red-500"/> Posisi Kamu
            </span>
            {location && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Terkunci</span>}
          </div>

          {/* Jika lokasi sudah didapat, tampilkan Peta! */}
          {location ? (
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-inner h-40 relative bg-gray-200">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                // Memasukkan Latitude & Longitude ke link Google Maps
                src={`https://maps.google.com/maps?q=${location.split(',')[0]},${location.split(',')[1]}&hl=id&z=17&output=embed`}
              ></iframe>
            </div>
          ) : (
            <div className="h-40 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 gap-2 bg-white">
              <MapPin size={32} className="text-gray-300" />
              <p className="text-xs text-center px-4">Peta akan muncul setelah<br/>kamu mengambil lokasi.</p>
            </div>
          )}

          {/* Tombol Ambil Lokasi */}
          <button 
            onClick={getLoc}
            className={`w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-xl font-bold transition-all ${
              location ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <MapPin size={18} />
            {location ? "Perbarui Lokasi" : "Ambil Lokasi Sekarang"}
          </button>
        </div>

        {/* Tombol Check In / Out */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button 
            onClick={() => handleAbsen('masuk')}
            disabled={loading || absenHariIni != null}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 hover:bg-green-100 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={`text-white p-2.5 rounded-xl shadow-sm transition-all ${absenHariIni ? 'bg-gray-400' : 'bg-green-600'}`}>
              {loading && !absenHariIni ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            </div>
            <span className="font-bold text-sm">Check In</span>
          </button>

          <button 
            onClick={() => handleAbsen('pulang')}
            disabled={loading || absenHariIni?.jam_pulang != null || absenHariIni == null}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 hover:bg-red-100 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={`text-white p-2.5 rounded-xl shadow-sm transition-all ${absenHariIni?.jam_pulang || !absenHariIni ? 'bg-gray-400' : 'bg-red-600'}`}>
              {loading && absenHariIni && !absenHariIni.jam_pulang ? <Loader2 className="animate-spin" size={20} /> : <LogOut size={20} />}
            </div>
            <span className="font-bold text-sm">Check Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}