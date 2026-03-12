import { prisma } from "@/lib/prisma";
import PostCard from "@/components/post-card";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-light-blue min-h-screen pb-24">
      <div className="bg-white border-b border-slate-100 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-[52px] font-bold text-navy leading-[1.15] mb-6">Writing</h1>
            <p className="text-slate-600 text-lg md:text-[20px] leading-[1.7]">
              Sharing my thoughts, experiences, and learnings about web development, design, and technology.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 italic">I haven't posted anything yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
