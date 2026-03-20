import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminExperienceTable from "@/components/admin/experience-table";

export default async function AdminExperiencesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#0f172a]">Experiences</h1>
        <Link
          href="/admin/experiences/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </Link>
      </div>
      <AdminExperienceTable experiences={experiences} />
    </div>
  );
}
