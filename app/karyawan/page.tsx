import { createClient } from "@/lib/supabase/server";
import AbsensiClient from "./AbsensiClient";

export default async function KaryawanDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil tanggal hari ini untuk mengecek status absen hari ini
  const hariIni = new Date().toLocaleDateString('en-CA'); 

  // Ambil data absen karyawan ini KHUSUS untuk hari ini saja
  const { data: absenHariIni } = await supabase
    .from("absensi")
    .select("*")
    .eq("user_id", user?.id)
    .eq("tanggal", hariIni)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center">
      {/* Kita kirim data absennya (kalau ada) ke komponen tombol */}
      <AbsensiClient 
        userEmail={user?.email || "Karyawan"} 
        absenHariIni={absenHariIni} 
      />
    </div>
  );
}