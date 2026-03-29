"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function ajukanIzinAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Anda belum login!" };

  const tanggal = formData.get("tanggal") as string;
  const tipe = formData.get("tipe") as string;
  const keterangan = formData.get("keterangan") as string;

  // 1. Validasi: Jangan sampai dia izin di hari di mana dia sudah terlanjur Check-In!
  const { data: cekAbsen } = await supabase.from("absensi").select("id").eq("user_id", user.id).eq("tanggal", tanggal).single();
  if (cekAbsen) return { error: "Gagal! Kamu sudah absen hadir di tanggal tersebut." };

  // 2. Validasi: Jangan sampai dia double-submit izin di hari yang sama
  const { data: cekIzin } = await supabase.from("perizinan").select("id").eq("user_id", user.id).eq("tanggal", tanggal).single();
  if (cekIzin) return { error: "Kamu sudah mengirim pengajuan untuk tanggal tersebut!" };

  // 3. Simpan ke Database
  const { error } = await supabase.from("perizinan").insert({
    user_id: user.id,
    tanggal: tanggal,
    tipe: tipe,
    keterangan: keterangan,
    status: 'Menunggu'
  });

  if (error) return { error: error.message };

  // Refresh halaman agar riwayat izinnya langsung muncul
  revalidatePath("/karyawan/izin");
  return { success: "Pengajuan berhasil dikirim! Silakan tunggu persetujuan Admin." };
}
// Fungsi untuk Admin: Mengubah status Menunggu -> Disetujui / Ditolak
export async function updateStatusIzinAction(id: string, status: 'Disetujui' | 'Ditolak') {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("perizinan")
    .update({ status: status })
    .eq("id", id);

  if (error) return { error: error.message };

  // Refresh halaman Admin dan Karyawan supaya statusnya langsung berubah!
  revalidatePath("/admin/izin");
  revalidatePath("/karyawan/izin"); 
  
  return { success: `Berhasil mengubah status menjadi ${status}!` };
}