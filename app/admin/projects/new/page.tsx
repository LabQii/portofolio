import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/components/admin/project-form";
import { createProject } from "@/app/actions/project-actions";

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b px-6 py-4">
        <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Projects</Link>
        <h1 className="text-xl font-bold mt-1">New Project</h1>
      </header>
      <main className="w-full mx-auto px-6 py-8 max-w-[768px]">
        <div className="bg-background rounded-xl border p-8 shadow-sm">
          <ProjectForm action={createProject} submitLabel="Create Project" />
        </div>
      </main>
    </div>
  );
}
