import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import CategoryTabs from "@/components/category-tabs";
import AnimatedHeader from "@/components/animated-header";
import PublicBreadcrumb from "@/components/public-breadcrumb";
import { getProfile } from "@/app/actions/profile";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { category, tag } = await searchParams;

  const projects = await prisma.project.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  const customTechLogos = await prisma.techStack.findMany();
  const profile = await getProfile();

  const allCategories = ["Website", "UI/UX", "Assignment", "Android"];

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--gradient-page)" }}>
      <div className="border-b border-slate-100/60 py-16 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div 
          className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.02]" 
          style={{ backgroundColor: "#1a3a5c" }}
          aria-hidden="true"
        ></div>
        <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <PublicBreadcrumb pageName="Projects" />
          <AnimatedHeader 
            title={profile?.projectsTitle || ""} 
            description={profile?.projectsDescription || ""} 
          />
        </div>
      </div>

      <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mt-12">
        <CategoryTabs categories={allCategories} activeCategory={category} />

        <div className="flex flex-col gap-8 mt-10">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} customTechLogos={customTechLogos} index={index} />
            ))
          ) : (
            <div className="py-24 text-center">
              <p className="text-slate-500 italic text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
