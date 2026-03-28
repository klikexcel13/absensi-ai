import { Users, UserCheck, UserX } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-gray-800">Selamat Datang, Admin! 👋</h2>
        <p className="text-gray-600 mt-2">Ini adalah pusat kendali sistem absensi Anda.</p>
      </header>

      {/* Kartu Statistik dengan Ikon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kartu Total Karyawan */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-lg text-blue-600">
            <Users size={28} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Total Karyawan</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
        </div>

        {/* Kartu Hadir */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-4 rounded-lg text-green-600">
            <UserCheck size={28} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Hadir Hari Ini</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
        </div>

        {/* Kartu Absen/Izin */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-red-100 p-4 rounded-lg text-red-600">
            <UserX size={28} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Absen / Izin</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
        </div>

      </div>
    </div>
  );
}