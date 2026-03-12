import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Eye } from "lucide-react";
import { Metadata } from "next";
import type { Project } from "@prisma/client";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({ where: { slug: resolvedParams.slug } });
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Iqbal Portfolio`,
    description: project.description,
    openGraph: {
      images: [project.thumbnail],
    },
  };
}

async function incrementViews(id: string) {
  await prisma.project.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({ where: { slug: resolvedParams.slug } });
  if (!project) notFound();

  await incrementViews(project.id);

  return (
    <article className="container mx-auto px-4 py-16 sm:py-24 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-6 pl-0 hover:pl-2 transition-all">
          <Link href="/projects" className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
        </Button>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {project.category}
          </Badge>
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">{project.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">{project.description}</p>
        <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          <span>{project.views} views</span>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-xl">
        <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-4 mb-12">
        {project.demoUrl && (
          <Button asChild className="bg-navy hover:bg-navy/90 text-white rounded-xl px-6 h-11">
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium">
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          </Button>
        )}
        {project.githubUrl && (
          <Button variant="outline" asChild className="rounded-xl px-6 h-11 border-slate-200 hover:bg-slate-50">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium text-slate-700">
              <Github className="h-4 w-4" /> Source Code
            </a>
          </Button>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Left Column: Tech Stack */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-1 bg-navy rounded-full"></div>
            <h2 className="text-xl font-bold m-0 text-navy">Tech Stack</h2>
          </div>
          <div className="flex flex-col gap-3">
            {project.techStack.map((tech, i) => {
              const colors = [
                "bg-blue-50 border-blue-200/60 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300",
                "bg-emerald-50 border-emerald-200/60 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/30 dark:text-emerald-300",
                "bg-violet-50 border-violet-200/60 text-violet-700 dark:bg-violet-900/20 dark:border-violet-800/30 dark:text-violet-300",
                "bg-amber-50 border-amber-200/60 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/30 dark:text-amber-300",
                "bg-rose-50 border-rose-200/60 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/30 dark:text-rose-300"
              ];
              const colorClass = colors[i % colors.length];
              return (
                <div key={tech} className={`px-5 py-3 rounded-xl border text-sm font-medium flex items-center justify-center transition-colors ${colorClass}`}>
                  {tech}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: About Content */}
        <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-navy rounded-full"></div>
              <h2 className="text-xl font-bold m-0 text-navy">About this project</h2>
            </div>
            {project.content ? (
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
                {project.content}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No description provided.</p>
            )}
        </div>

      </div>

      {/* Image Gallery */}
      {project.images.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {project.images.map((img, i) => (
              <div key={i} className="relative aspect-video rounded-xl overflow-hidden shadow-md">
                <Image src={img} alt={`${project.title} screenshot ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
