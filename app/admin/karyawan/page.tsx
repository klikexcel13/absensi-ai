import { getDaftarKaryawan } from "@/actions/karyawan";
import KaryawanClient from "./KaryawanClient";

export default async function KelolaKaryawanPage() {
  // Ambil data langsung dari server saat halaman dimuat
  const dataKaryawan = await getDaftarKaryawan();

  return (
    <div className="pb-10">
      {/* Mengirimkan dataKaryawan ke mesin pembuat tabel */}
      <KaryawanClient dataKaryawan={dataKaryawan} />
    </div>
  );
}