import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CVUploadClient from "@/components/admin/cv-upload";

export default async function AdminCVPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const cv = await prisma.cV.findFirst({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#0f172a]">CV Manager</h1>
        <p className="text-[13px] text-[#64748b] mt-1">Upload and manage your downloadable CV file.</p>
      </div>
      <div className="max-w-[640px] bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] p-8">
        <h2 className="text-[16px] font-semibold text-[#0f172a] mb-6">Upload CV</h2>
        <CVUploadClient currentCV={cv} />
      </div>
    </div>
  );
}

