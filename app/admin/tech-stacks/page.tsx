import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import TechStackAdminForm from "@/components/admin/tech-stack-form";
import { getTechStacks } from "@/app/actions/tech-stack-actions";

export default async function TechStacksAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const techStacks = await getTechStacks();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader title="Manage Tech Stacks" backHref="/admin" />
      
      <main className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">Custom Tech Stack Logos</h1>
          <p className="text-slate-600 mt-2">
            Upload custom SVG or PNG logos for specific technologies. If a tech stack isn't found here, it will gracefully fallback to the Simple Icons library or an initial letter badge.
          </p>
        </div>

        <TechStackAdminForm techStacks={techStacks} />
      </main>
    </div>
  );
}
