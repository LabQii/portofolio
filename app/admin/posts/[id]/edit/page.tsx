import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import PostForm from "@/components/admin/post-form";
import { updatePost } from "@/app/actions/post-actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const resolvedParams = await params;

  const post = await prisma.post.findUnique({ where: { id: resolvedParams.id } });
  if (!post) notFound();

  const action = updatePost.bind(null, resolvedParams.id);

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b px-6 py-4">
        <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Posts</Link>
        <h1 className="text-xl font-bold mt-1">Edit Post</h1>
      </header>
      <main className="w-full mx-auto px-6 py-8 max-w-[768px]">
        <div className="bg-background rounded-xl border p-8 shadow-sm">
          <PostForm post={post} action={action} submitLabel="Update Post" />
        </div>
      </main>
    </div>
  );
}
