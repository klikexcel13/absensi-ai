import { createClient } from "@/lib/supabase/server";
import { Plus, Search, MoreVertical, UserCircle } from "lucide-react";
import AddKaryawanModal from "./AddKaryawanModal";
// Ini adalah Server Component (bisa pakai async/await langsung!)
export default async function KaryawanPage() {
  // 1. Panggil mesin Supabase
  const supabase = await createClient();

  // 2. Ambil data dari tabel profiles yang role-nya 'karyawan'
  const { data: karyawanList, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "karyawan")
    .order("full_name", { ascending: true });

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Data Karyawan</h2>
          <p className="text-gray-600 mt-1">Kelola daftar karyawan yang terdaftar di sistem.</p>
        </div>
        
        {/* Tombol Tambah (Nanti kita fungsikan untuk memunculkan modal/form) */}
        {/* Tombol & Modal Tambah Karyawan */}
        <AddKaryawanModal />
      </header>

      {/* Area Tabel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Baris Pencarian (Visual saja untuk sekarang) */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Cari nama karyawan..."
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Profil</th>
                <th className="px-6 py-4 font-semibold">ID Karyawan</th>
                <th className="px-6 py-4 font-semibold">Status Role</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              
              {/* Jika terjadi error saat ambil data */}
              {error && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-red-500">
                    Gagal memuat data: {error.message}
                  </td>
                </tr>
              )}

              {/* Jika data kosong */}
              {!error && (!karyawanList || karyawanList.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <UserCircle className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900">Belum ada karyawan</p>
                      <p>Klik tombol "Tambah Karyawan" untuk mulai memasukkan data.</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Looping (Perulangan) Data Karyawan */}
              {!error && karyawanList && karyawanList.map((karyawan) => (
                <tr key={karyawan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {/* Mengambil huruf pertama dari nama */}
                        {karyawan.full_name ? karyawan.full_name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="font-medium text-gray-900">{karyawan.full_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {/* Menampilkan sebagian ID agar tidak terlalu panjang */}
                    {karyawan.id.split('-')[0]}...
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                      {karyawan.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}