import { prisma } from "@/lib/prisma";
import PostCard from "@/components/post-card";
import AnimatedHeader from "@/components/animated-header";
import PublicBreadcrumb from "@/components/public-breadcrumb";
import { getProfile } from "@/app/actions/profile";

export default async function PostsPage() {
  const [posts, profile] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    }),
    getProfile(),
  ]);

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--gradient-page)" }}>
      <div className="border-b border-slate-100/60 py-16 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div 
          className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.02]" 
          style={{ backgroundColor: "#1a3a5c" }}
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
            <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 italic">I haven&apos;t posted anything yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
