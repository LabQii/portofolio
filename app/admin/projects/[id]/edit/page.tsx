import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/components/admin/project-form";
import { updateProject } from "@/app/actions/project-actions";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const resolvedParams = await params;

  const project = await prisma.project.findUnique({ where: { id: resolvedParams.id } });
  if (!project) notFound();

  const action = updateProject.bind(null, resolvedParams.id);

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b px-6 py-4">
        <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Projects</Link>
        <h1 className="text-xl font-bold mt-1">Edit Project</h1>
      </header>
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="bg-background rounded-xl border p-8 shadow-sm">
          <ProjectForm project={project} action={action} submitLabel="Update Project" />
        </div>
      </main>
    </div>
  );
}
