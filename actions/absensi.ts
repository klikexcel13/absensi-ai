"use server";

import { createClient } from "@/lib/supabase/server";

// Rumus Matematika Tingkat Dewa (Haversine Formula) untuk menghitung jarak GPS
function hitungJarakMeter(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius bumi dalam meter
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(dp/2) * Math.sin(dp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c); // Hasil dalam satuan meter bulat
}

// Fungsi hitung durasi jam kerja
function hitungDurasi(jamMasuk: string, jamPulang: string) {
  const [mJam, mMenit] = jamMasuk.split(':').map(Number);
  const [pJam, pMenit] = jamPulang.split(':').map(Number);
  const totalMenitMasuk = (mJam * 60) + mMenit;
  const totalMenitPulang = (pJam * 60) + pMenit;
  const selisih = totalMenitPulang - totalMenitMasuk;
  if (selisih <= 0) return "0 Jam 0 Menit";
  const jam = Math.floor(selisih / 60);
  const menit = selisih % 60;
  return `${jam} Jam ${menit} Menit`;
}

export async function saveAbsensiAction(tipe: 'masuk' | 'pulang', lokasi: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Anda belum login!" };
  if (!lokasi) return { error: "Lokasi GPS belum didapatkan. Pastikan kamu mengizinkan akses lokasi!" };

  // 1. Ambil pengaturan jam kerja & lokasi dari database
  const { data: aturan } = await supabase.from('pengaturan').select('*').eq('id', 1).single();
  const batasMasuk = aturan?.jam_masuk || '08:00:00';
  const batasPulang = aturan?.jam_pulang || '17:00:00';
  const latKantor = parseFloat(aturan?.lat_kantor || '-6.4025');
  const longKantor = parseFloat(aturan?.long_kantor || '106.7942');
  const batasRadius = aturan?.radius_meter || 50;

  // 2. CEK RADIUS JARAK (GEOFENCING) 📍
  // Format lokasi yang dikirim dari UI adalah "Latitude, Longitude"
  const [latKaryawan, longKaryawan] = lokasi.split(',').map(str => parseFloat(str.trim()));
  const jarakKaryawan = hitungJarakMeter(latKantor, longKantor, latKaryawan, longKaryawan);

  if (jarakKaryawan > batasRadius) {
    return { error: `Gagal! Jarakmu ${jarakKaryawan} meter dari kantor. Maksimal jarak yang diizinkan adalah ${batasRadius} meter.` };
  }

  const hariIni = new Date().toLocaleDateString('en-CA'); 
  const waktuSekarang = new Date().toLocaleTimeString('en-GB'); 

  const { data: absenHariIni } = await supabase.from("absensi").select("*").eq("user_id", user.id).eq("tanggal", hariIni).single();

  // --- LOGIKA CHECK IN ---
  if (tipe === 'masuk') {
    if (absenHariIni) return { error: "Kamu sudah Check In hari ini!" };
    const statusMsk = waktuSekarang > batasMasuk ? 'Terlambat' : 'Tepat Waktu';

    const { error } = await supabase.from("absensi").insert({
      user_id: user.id,
      tanggal: hariIni,
      jam_masuk: waktuSekarang,
      lokasi_masuk: lokasi,
      status: 'hadir',
      status_masuk: statusMsk
    });

    if (error) return { error: error.message };
    return { success: `Check In berhasil! Jarakmu dari kantor: ${jarakKaryawan} meter. ⏰` };
  } 
  
  // --- LOGIKA CHECK OUT ---
  if (tipe === 'pulang') {
    if (!absenHariIni) return { error: "Belum Check In, masa mau pulang?" };
    if (absenHariIni.jam_pulang) return { error: "Kamu sudah Check Out hari ini!" };
    
    const statusPlg = waktuSekarang < batasPulang ? 'Pulang Lebih Awal' : 'Tepat Waktu';
    const totalDurasi = hitungDurasi(absenHariIni.jam_masuk, waktuSekarang);

    const { error } = await supabase.from("absensi").update({
      jam_pulang: waktuSekarang,
      lokasi_pulang: lokasi,
      status_pulang: statusPlg,
      durasi_kerja: totalDurasi
    }).eq("id", absenHariIni.id);

    if (error) return { error: error.message };
    return { success: `Check Out berhasil! Durasi kerja: ${totalDurasi} 💼` };
  }
}