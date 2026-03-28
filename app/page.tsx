import { redirect } from "next/navigation";

export default function RootPage() {
  // Kalau ada yang nyasar ke "localhost:3000/", langsung lempar ke halaman login!
  // Nanti dari halaman login, Middleware kita yang akan mengatur ke /admin atau /karyawan
  redirect("/login");
}