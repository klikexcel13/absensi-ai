"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveAbsensiAction(tipe: 'masuk' | 'pulang', lokasi: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda belum login!" };
  }

  // Ambil tanggal hari ini (Format YYYY-MM-DD)
  const hariIni = new Date().toLocaleDateString('en-CA'); 
  // Ambil waktu saat ini (Format jam:menit:detik)
  const waktuSekarang = new Date().toLocaleTimeString('en-GB');

  // 1. Cek dulu, apakah karyawan ini sudah ada catatan absen hari ini?
  const { data: absensiHariIni } = await supabase
    .from("absensi")
    .select("*")
    .eq("user_id", user.id)
    .eq("tanggal", hariIni)
    .single();

  // 2. Jika tombol yang diklik adalah "MASUK"
  if (tipe === 'masuk') {
    if (absensiHariIni) {
      return { error: "Kamu sudah Check In hari ini! Jangan rajin-rajin amat." };
    }

    const { error } = await supabase.from("absensi").insert({
      user_id: user.id,
      tanggal: hariIni,
      jam_masuk: waktuSekarang,
      lokasi_masuk: lokasi,
      status: 'hadir'
    });

    if (error) return { error: error.message };
    return { success: "Berhasil Check In! Selamat bekerja." };
  } 
  
  // 3. Jika tombol yang diklik adalah "PULANG"
  if (tipe === 'pulang') {
    if (!absensiHariIni) {
      return { error: "Kamu belum Check In hari ini! Masa mau langsung pulang?" };
    }
    if (absensiHariIni.jam_pulang) {
      return { error: "Kamu sudah Check Out! Waktunya istirahat." };
    }

    const { error } = await supabase
      .from("absensi")
      .update({
        jam_pulang: waktuSekarang,
        lokasi_pulang: lokasi
      })
      .eq("id", absensiHariIni.id);

    if (error) return { error: error.message };
    return { success: "Berhasil Check Out! Hati-hati di jalan." };
  }
}