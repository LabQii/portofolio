import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import ExperienceForm from "@/components/admin/experience-form";
import { createExperience } from "@/app/actions/experience-actions";

export default async function NewExperiencePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b px-6 py-4">
        <Link href="/admin/experiences" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Experiences</Link>
        <h1 className="text-xl font-bold mt-1">Add New Experience</h1>
      </header>
      <main className="w-full mx-auto px-6 py-8 max-w-[768px]">
        <div className="bg-background rounded-xl border shadow-sm p-6 md:p-8">
          <ExperienceForm action={createExperience} submitLabel="Create Experience" />
        </div>
      </main>
    </div>
  );
}
