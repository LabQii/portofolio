import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import PostForm from "@/components/admin/post-form";
import { createPost } from "@/app/actions/post-actions";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b px-6 py-4">
        <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Posts</Link>
        <h1 className="text-xl font-bold mt-1">New Post</h1>
      </header>
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="bg-background rounded-xl border p-8 shadow-sm">
          <PostForm action={createPost} submitLabel="Create Post" />
        </div>
      </main>
    </div>
  );
}
