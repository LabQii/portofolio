import { prisma } from "@/lib/prisma";
import PostCard from "@/components/post-card";
import AnimatedHeader from "@/components/animated-header";
import PublicBreadcrumb from "@/components/public-breadcrumb";
import { getProfile } from "@/app/actions/profile";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  const profile = await getProfile();
  return (
    <div className="min-h-screen pb-24 bg-page-gradient">
      <div className="py-16 relative overflow-hidden bg-hero-gradient">
        <div 
          className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.02] bg-navy dark:bg-white" 
          aria-hidden="true"
        ></div>
        <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <PublicBreadcrumb pageName="Activities" />
          <AnimatedHeader 
            title={profile?.activitiesTitle || ""} 
            description={profile?.activitiesDescription || ""} 
          />
        </div>
      </div>

      <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-surface rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-muted italic">I haven&apos;t posted anything yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
