"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Membuat Klien Supabase Mode Dewa (Hanya boleh ada di file server)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// 1. Ambil Semua Data Karyawan (Gabungan Auth & Profiles)
export async function getDaftarKaryawan() {
  const { data: authUsers, error: errAuth } = await supabaseAdmin.auth.admin.listUsers();
  const { data: profiles, error: errProf } = await supabaseAdmin.from("profiles").select("*").eq("role", "karyawan");

  if (errAuth || errProf) return [];

  // Gabungkan data supaya kita punya Nama sekaligus Email-nya
  return profiles.map(p => {
    const userAuth = authUsers.users.find(u => u.id === p.id);
    return {
      id: p.id,
      nama: p.full_name,
      email: userAuth?.email || "Tidak ada email",
    };
  });
}

// 2. Tambah Karyawan Baru
export async function tambahKaryawanAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nama = formData.get("nama") as string;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true // Langsung aktif tanpa verifikasi email
  });

  if (error) return { error: error.message };

  // Update namanya di tabel profiles
  if (data.user) {
    await supabaseAdmin.from("profiles").update({ full_name: nama, role: 'karyawan' }).eq("id", data.user.id);
  }

  revalidatePath("/admin/karyawan");
  return { success: "Karyawan berhasil ditambahkan!" };
}

// 3. Edit Karyawan
export async function editKaryawanAction(formData: FormData) {
  const id = formData.get("id") as string;
  const email = formData.get("email") as string;
  const nama = formData.get("nama") as string;
  const password = formData.get("password") as string;

  const updateData: any = { email: email };
  if (password && password.trim() !== "") {
    updateData.password = password; // Hanya update password kalau diisi
  }

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);
  if (authError) return { error: authError.message };

  const { error: profileError } = await supabaseAdmin.from("profiles").update({ full_name: nama }).eq("id", id);
  if (profileError) return { error: profileError.message };

  revalidatePath("/admin/karyawan");
  return { success: "Data karyawan berhasil diperbarui!" };
}

// 4. Hapus Karyawan
export async function hapusKaryawanAction(id: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) return { error: error.message };

  revalidatePath("/admin/karyawan");
  return { success: "Karyawan berhasil dihapus!" };
}