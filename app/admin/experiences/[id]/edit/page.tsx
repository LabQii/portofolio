import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ExperienceForm from "@/components/admin/experience-form";
import { updateExperience } from "@/app/actions/experience-actions";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) notFound();

  const action = async (formData: FormData) => {
    "use server";
    return updateExperience(id, formData);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b px-6 py-4">
        <Link href="/admin/experiences" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Experiences</Link>
        <h1 className="text-xl font-bold mt-1">Edit Experience</h1>
      </header>
      <main className="w-full mx-auto px-6 py-8 max-w-[768px]">
        <div className="bg-background rounded-xl border shadow-sm p-6 md:p-8">
          <ExperienceForm experience={experience} action={action} submitLabel="Update Experience" />
        </div>
      </main>
    </div>
  );
}
