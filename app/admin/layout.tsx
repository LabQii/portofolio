import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminNavbar from "@/components/admin/admin-navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f5f7] font-sans">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden relative z-0">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
