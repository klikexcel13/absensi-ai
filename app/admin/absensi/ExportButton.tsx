// @ts-nocheck
"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
// ... (sisa kode di bawahnya biarkan saja)

export default function ExportButton({ dataAbsensi }: { dataAbsensi: any[] }) {
  
  // --- MESIN 1: EXPORT KE CSV / EXCEL ---
  const handleExportCSV = () => {
    if (!dataAbsensi || dataAbsensi.length === 0) {
      alert("Tidak ada data untuk diekspor!");
      return;
    }

    const headers = ["Tanggal,Nama Karyawan,Jam Masuk,Jam Pulang,Status Masuk,Status Pulang,Durasi Kerja"];
    const rows = dataAbsensi.map(absen => {
      const nama = `"${absen.profiles?.full_name || 'Tidak Dikenal'}"`;
      return `${absen.tanggal || '-'},${nama},${absen.jam_masuk || '-'},${absen.jam_pulang || '-'},${absen.status_masuk || '-'},${absen.status_pulang || '-'},${absen.durasi_kerja || '-'}`;
    });

    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_Absensi_${new Date().toLocaleDateString('id-ID')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- MESIN 2: EXPORT KE PDF CANTIK ---
  const handleExportPDF = () => {
    if (!dataAbsensi || dataAbsensi.length === 0) {
      alert("Tidak ada data untuk diekspor!");
      return;
    }

    // 1. Siapkan Kertas Kosong
    const doc = new jsPDF();
    
    // 2. Tulis Judul Laporan
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55); // Warna abu-abu gelap
    doc.text("Laporan Rekap Absensi Karyawan", 14, 20);
    
    // 3. Tulis Tanggal Cetak
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128); // Warna abu-abu terang
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 28);

    // 4. Siapkan Kolom dan Baris Tabel
    const tableColumn = ["Tanggal", "Nama Karyawan", "Masuk", "Pulang", "Status", "Durasi"];
    const tableRows = dataAbsensi.map(absen => [
      absen.tanggal || '-',
      absen.profiles?.full_name || 'Tidak Dikenal',
      absen.jam_masuk || '-',
      absen.jam_pulang || '-',
      absen.status_masuk || '-',
      absen.durasi_kerja || '-'
    ]);

    // 5. Gambar Tabelnya secara otomatis!
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35, // Mulai gambar tabel di bawah judul (koordinat Y: 35)
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }, // Warna biru khas Tailwind di header tabel
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [249, 250, 251] } // Warna selang-seling ala zebra
    });

    // 6. Simpan File
    doc.save(`Laporan_Absensi_${new Date().toLocaleDateString('id-ID')}.pdf`);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Tombol CSV */}
      <button 
        onClick={handleExportCSV} 
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        <FileSpreadsheet size={18} />
        <span className="hidden sm:inline">Export CSV</span>
      </button>
      
      {/* Tombol PDF */}
      <button 
        onClick={handleExportPDF} 
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        <FileText size={18} />
        <span className="hidden sm:inline">Export PDF</span>
      </button>
    </div>
  );
}