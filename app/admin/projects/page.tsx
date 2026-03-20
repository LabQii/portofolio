import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminProjectTable from "@/components/admin/project-table";

export default async function AdminProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#0f172a]">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Link>
      </div>
      <AdminProjectTable projects={projects} />
    </div>
  );
}
