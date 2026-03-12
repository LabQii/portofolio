import Hero from "@/components/hero";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/project-card";
import PostCard from "@/components/post-card";

export default async function Home() {
  const [profile, featuredProjects, recentPosts] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col">
      <Hero name={profile?.name} description={profile?.description} />

      {/* Recent Posts Section */}
      <section className="bg-light-blue py-16 md:py-24" id="recent-posts">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[2.5rem] md:text-[40px] font-bold text-navy leading-[1.2] mb-0">Recent Posts</h2>
            <Button variant="secondary" className="text-navy bg-slate-50 hover:bg-slate-100 rounded-xl px-5 h-10" asChild>
              <Link href="/posts" className="flex items-center gap-2 group">
                <span className="font-medium text-base">View all</span> <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-muted-foreground italic">No posts yet. Check back soon!</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[2.5rem] md:text-[40px] font-bold text-navy leading-[1.2] mb-0">Featured Work</h2>
            <Button variant="secondary" className="text-navy bg-slate-50 hover:bg-slate-100 rounded-xl px-5 h-10" asChild>
              <Link href="/projects" className="flex items-center gap-2 group">
                <span className="font-medium text-base">View all</span> <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-8">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <p className="text-muted-foreground italic">No featured projects yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
