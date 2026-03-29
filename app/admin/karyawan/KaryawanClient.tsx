"use client";

import { useState } from "react";
import { UserPlus, Edit, Trash2, X, Save, Loader2 } from "lucide-react";
import { tambahKaryawanAction, editKaryawanAction, hapusKaryawanAction } from "@/actions/karyawan";

export default function KaryawanClient({ dataKaryawan }: { dataKaryawan: any[] }) {
  // modalMode: 'tutup' | 'tambah' | 'edit'
  const [modalMode, setModalMode] = useState<'tutup' | 'tambah' | 'edit'>('tutup');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ id: '', nama: '', email: '' });

  // Fungsi untuk buka modal TAMBAH (kosongkan form)
  const bukaModalTambah = () => {
    setFormData({ id: '', nama: '', email: '' });
    setModalMode('tambah');
  };

  // Fungsi untuk buka modal EDIT (isi form dengan data yang diklik)
  const bukaModalEdit = (karyawan: any) => {
    setFormData({ id: karyawan.id, nama: karyawan.nama, email: karyawan.email });
    setModalMode('edit');
  };

  // Fungsi saat tombol "Simpan" ditekan
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const form = new FormData(e.currentTarget);
    form.append("id", formData.id);

    // Mesin pintar: Kalau mode tambah, panggil aksi tambah. Kalau edit, panggil aksi edit!
    const hasil = modalMode === 'tambah' 
      ? await tambahKaryawanAction(form) 
      : await editKaryawanAction(form);

    if (hasil?.error) alert("❌ Gagal: " + hasil.error);
    if (hasil?.success) {
      alert("✅ " + hasil.success);
      setModalMode('tutup'); // Tutup modal otomatis setelah sukses
    }
    setLoading(false);
  };

  // Fungsi untuk hapus karyawan
  const handleHapus = async (id: string, nama: string) => {
    if (!confirm(`PERINGATAN! Yakin ingin menghapus permanen akun karyawan bernama ${nama}?`)) return;
    
    setLoading(true);
    const hasil = await hapusKaryawanAction(id);
    if (hasil?.error) alert("❌ Gagal: " + hasil.error);
    if (hasil?.success) alert("✅ " + hasil.success);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Kelola Karyawan</h2>
          <p className="text-gray-600 mt-1">Tambah, edit, atau hapus akses akun karyawan.</p>
        </div>
        <button onClick={bukaModalTambah} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
          <UserPlus size={20} /> <span>Tambah Karyawan</span>
        </button>
      </div>

      {/* --- TABEL DATA KARYAWAN --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Email (Akun Login)</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataKaryawan.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Belum ada data karyawan.</td></tr>
              ) : (
                dataKaryawan.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">{k.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{k.email}</td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button onClick={() => bukaModalEdit(k)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                        <Edit size={18}/>
                      </button>
                      <button onClick={() => handleHapus(k.id, k.nama)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM (TAMBAH / EDIT) --- */}
      {modalMode !== 'tutup' && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                {modalMode === 'tambah' ? 'Tambah Karyawan Baru' : 'Edit Data Karyawan'}
              </h3>
              <button onClick={() => setModalMode('tutup')} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24}/>
              </button>
            </div>
            
            {/* Isi Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                <input type="text" name="nama" defaultValue={formData.nama} required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Email Login</label>
                <input type="email" name="email" defaultValue={formData.email} required className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  minLength={6} 
                  placeholder={modalMode === 'edit' ? '(Kosongkan jika tidak ingin ganti password)' : 'Minimal 6 karakter'} 
                  required={modalMode === 'tambah'} 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              {/* Tombol Aksi Bawah */}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalMode('tutup')} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" disabled={loading} className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>} Simpan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}