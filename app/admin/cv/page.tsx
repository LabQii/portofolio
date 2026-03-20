import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CVUploadClient from "@/components/admin/cv-upload";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default async function AdminCVPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const cv = await prisma.cV.findFirst({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "CV Manager" }]} />
      <h1 className="text-[22px] font-bold text-[#0f172a] mt-1 mb-1">CV Manager</h1>
      <p className="text-[13px] text-[#64748b] mb-1">Upload and manage your downloadable CV file.</p>
      <hr className="border-[#f1f5f9] mb-6" />
      <div className="max-w-[640px] bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] p-8">
        <CVUploadClient currentCV={cv} />
      </div>
    </div>
  );
}

