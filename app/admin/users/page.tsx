"use client";

import { useState, useEffect } from "react";
import { getAdmins, deleteAdmin } from "@/app/actions/admin";
import { Loader2, Plus, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

type Admin = { id: string; email: string };

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: session } = useSession() || {};

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to load admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin account?")) return;
    setDeletingId(id);
    try {
      if (!(session?.user as any)?.id) { alert("Session error."); return; }
      const result = await deleteAdmin(id, (session?.user as any).id);
      if (result.success) { await fetchAdmins(); }
      else { alert(result.error || "Failed to delete admin."); }
    } catch (error) { alert("An unexpected error occurred."); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Manage Admins" }]} />
      <div className="flex items-center justify-between mt-1 mb-1">
        <div>
          <h1 className="text-[22px] font-bold text-[#0f172a]">Manage Admins</h1>
          <p className="text-[13px] text-[#64748b] mt-0.5">Manage users who have access to this dashboard.</p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite Admin
        </Link>
      </div>
      <hr className="border-[#f1f5f9] mb-6" />

      <div className="max-w-[700px] bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-7 w-7 animate-spin text-[#64748b]" />
          </div>
        ) : admins.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-5 py-3">Email</th>
                <th className="text-right text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const isCurrentUser = session?.user?.email === admin.email;
                return (
                  <tr key={admin.id} className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-[14px]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0f172a]">{admin.email}</span>
                        {isCurrentUser && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#f1f5f9] text-[#64748b]">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-[14px] text-right">
                      <button
                        disabled={isCurrentUser || deletingId === admin.id}
                        onClick={() => handleDelete(admin.id)}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {deletingId === admin.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldAlert className="h-10 w-10 text-[#cbd5e1] mb-4" />
            <p className="text-[#64748b] text-sm">No admins found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
