"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePengaturanAction(formData: FormData) {
  const jam_masuk = formData.get("jam_masuk") as string;
  const jam_pulang = formData.get("jam_pulang") as string;
  
  // Tangkap data lokasi baru
  const lat_kantor = formData.get("lat_kantor") as string;
  const long_kantor = formData.get("long_kantor") as string;
  const radius_meter = parseInt(formData.get("radius_meter") as string);

  const supabase = await createClient();

  // Simpan semuanya ke database
  const { error } = await supabase
    .from("pengaturan")
    .update({ 
      jam_masuk: jam_masuk, 
      jam_pulang: jam_pulang,
      lat_kantor: lat_kantor,
      long_kantor: long_kantor,
      radius_meter: radius_meter
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/pengaturan");
  return { success: "Berhasil! Jam kerja dan Lokasi Kantor telah diperbarui." };
}