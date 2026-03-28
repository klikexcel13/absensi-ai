import { createClient } from "@/lib/supabase/server";
import AbsensiClient from "./AbsensiClient";

export default async function KaryawanDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center">
      <AbsensiClient userEmail={user?.email || "Karyawan"} />
    </div>
  );
}