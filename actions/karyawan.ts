"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function addKaryawanAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Kita buat mesin Supabase khusus menggunakan Kunci Master (Service Role)
  // Mesin ini tidak akan mengganggu sesi login Admin di browser
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // 2. Buat user baru di sistem Autentikasi Supabase
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  // CCTV KITA:
  if (error) {
    console.log("🚨 ERROR DARI KUNCI MASTER:", error.message);
    return { error: error.message };
  } else {
    console.log("✅ SUKSES MEMBUAT USER DI AUTH:", data.user.email);
  }

  // 3. Refresh halaman tabel Karyawan agar data terbaru langsung muncul!
  revalidatePath("/admin/karyawan");
  
  return { success: true };
}