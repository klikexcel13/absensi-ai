"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { addKaryawanAction } from "@/actions/karyawan";
import { useRouter } from "next/navigation"; // 1. TAMBAHKAN IMPORT INI

export default function AddKaryawanModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter(); // 2. PANGGIL ROUTER DI SINI

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const result = await addKaryawanAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setIsOpen(false);
      setLoading(false);
      
      // 3. SURUH NEXT.JS REFRESH TABEL SECARA DIAM-DIAM!
      router.refresh(); 
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
      >
        <Plus size={20} />
        <span>Tambah Karyawan</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Tambah Karyawan Baru</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Misal: Budi Santoso"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Karyawan</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="budi@perusahaan.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Sementara</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Simpan Karyawan"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}