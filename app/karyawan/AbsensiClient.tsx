"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, LogIn, LogOut, Loader2 } from "lucide-react"; 
import { logoutAction } from "@/actions/auth";
import { saveAbsensiAction } from "@/actions/absensi"; // <-- INI MESIN DATABASE KITA

export default function AbsensiClient({ userEmail }: { userEmail: string }) {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State untuk loading tombol

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getLoc = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      });
    } else {
      alert("GPS tidak didukung di browser ini.");
    }
  };

  // FUNGSI INI YANG KITA PERBAIKI!
  const handleAbsen = async (tipe: 'masuk' | 'pulang') => {
    setLoading(true);
    
    // Panggil fungsi backend untuk simpan ke Supabase
    const hasil = await saveAbsensiAction(tipe, location);
    
    if (hasil?.error) {
      alert("❌ " + hasil.error);
    } else if (hasil?.success) {
      alert("✅ " + hasil.success);
    }
    
    setLoading(false);
  };

  if (!mounted || !time) {
    return (
      <div className="max-w-md mx-auto p-8 text-center text-gray-400 font-medium">
        Menyiapkan sistem absensi...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-500">
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
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center space-y-8 text-left">
        <div className="space-y-1">
          <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase">Jam Digital</h3>
          <p className="text-6xl font-black text-gray-900 tabular-nums tracking-tighter">
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleAbsen('masuk')}
            disabled={loading}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-green-50 text-green-700 rounded-2xl border border-green-100 hover:bg-green-100 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-green-600 text-white p-3 rounded-xl shadow-md group-hover:shadow-green-200 transition-all">
              {loading ? <Loader2 className="animate-spin" size={24} /> : <LogIn size={24} />}
            </div>
            <span className="font-bold">Check In</span>
          </button>

          <button 
            onClick={() => handleAbsen('pulang')}
            disabled={loading}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100 hover:bg-red-100 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-red-600 text-white p-3 rounded-xl shadow-md group-hover:shadow-red-200 transition-all">
              {loading ? <Loader2 className="animate-spin" size={24} /> : <LogOut size={24} />}
            </div>
            <span className="font-bold">Check Out</span>
          </button>
        </div>

        <button 
          onClick={getLoc}
          className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors mx-auto bg-blue-50 px-4 py-2 rounded-full font-medium"
        >
          <MapPin size={16} />
          <span>{location ? `Lokasi Terkunci: ${location}` : "Izinkan Akses Lokasi"}</span>
        </button>
      </div>
    </div>
  );
}