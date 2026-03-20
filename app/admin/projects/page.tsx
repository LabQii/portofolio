import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminProjectTable from "@/components/admin/project-table";

export default async function AdminProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b px-6 py-4 flex justify-between items-center">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Dashboard</Link>
          <h1 className="text-xl font-bold mt-1">Projects</h1>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new"><Plus className="h-4 w-4 mr-1" /> Add Project</Link>
        </Button>
      </header>
      <main className="w-full mx-auto px-6 py-8 max-w-[1152px]">
        <AdminProjectTable projects={projects} />
      </main>
    </div>
  );
}
