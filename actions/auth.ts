"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Memanggil mesin Supabase Server yang baru saja kamu buat
  const supabase = await createClient();

  // 1. Coba login menggunakan Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { error: "Email atau password salah." };
  }

  // 2. Ambil role (Admin/Karyawan) dari tabel profiles yang sudah kita buat
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    // INI RADAR KITA:
    console.log("🚨 ERROR DARI SUPABASE:", profileError);
    console.log("ID USER YANG DICARI:", authData.user.id);
    return { error: "Gagal mengambil data profil pengguna." };
  }

  // 3. Arahkan pengguna berdasarkan role-nya
  const userRole = profile.role;
  
  if (userRole === "admin") {
    redirect("/admin");
  } else {
    redirect("/karyawan");
  }
}
// Tambahkan fungsi ini di bagian paling bawah file auth.ts
export async function logoutAction() {
  const supabase = await createClient();
  
  // Perintahkan Supabase untuk menghapus sesi login saat ini
  await supabase.auth.signOut();
  
  // Tendang user kembali ke halaman login
  redirect("/login");
}