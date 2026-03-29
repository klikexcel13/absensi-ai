import { createClient } from "@/lib/supabase/server";
import FormPengaturan from "./FormPengaturan";

export default async function PengaturanPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("pengaturan").select("*").eq("id", 1).single();

  const jamMasuk = data?.jam_masuk ? data.jam_masuk.slice(0, 5) : "08:00";
  const jamPulang = data?.jam_pulang ? data.jam_pulang.slice(0, 5) : "17:00";
  
  // Ambil data lokasi (Default ke area Depok kalau kosong)
  const latKantor = data?.lat_kantor || "-6.4025";
  const longKantor = data?.long_kantor || "106.7942";
  const radiusMeter = data?.radius_meter || 50;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-gray-800">Pengaturan Sistem</h2>
        <p className="text-gray-600 mt-1">Atur jam operasional dan titik koordinat absensi kantor.</p>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-2xl">
        <FormPengaturan 
          jamMasukAwal={jamMasuk} 
          jamPulangAwal={jamPulang} 
          latAwal={latKantor}
          longAwal={longKantor}
          radiusAwal={radiusMeter}
        />
      </div>
    </div>
  );
}