import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
    orderBy: { createdAt: "desc" },
  });

  const allCategories = ["Website", "UI/UX", "Assignment", "Android"];

  return (
    <div className="bg-light-blue min-h-screen pb-24">
      <div className="bg-white border-b border-slate-100 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-[52px] font-bold text-navy leading-[1.15] mb-6">My Projects</h1>
            <p className="text-slate-600 text-lg md:text-[20px] leading-[1.7]">
              A collection of my work ranging from web applications to mobile apps and UI/UX design. Use the filters to explore specific categories.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-wrap gap-3 mb-12">
          <Link href="/projects">
            <Badge 
              className={`px-5 py-2 cursor-pointer rounded-full transition-all text-[14px] font-semibold ${!category ? 'bg-navy text-white hover:bg-navy/90 border-transparent shadow-sm' : 'bg-white text-navy border-slate-200 hover:bg-slate-50 shadow-sm'}`}
              variant="outline"
            >
              All Projects
            </Badge>
          </Link>
          {allCategories.map((cat) => (
            <Link key={cat} href={`/projects?category=${cat}`}>
              <Badge 
                className={`px-5 py-2 cursor-pointer rounded-full transition-all text-[14px] font-semibold ${category === cat ? 'bg-navy text-white hover:bg-navy/90 border-transparent shadow-sm' : 'bg-white text-navy border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                variant="outline"
              >
                {cat}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-8 bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-100">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
