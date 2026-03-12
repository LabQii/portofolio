"use client";

import { deletePost } from "@/app/actions/post-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import type { Post } from "@prisma/client";

export default function AdminPostTable({ posts }: { posts: Post[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    await deletePost(id);
    setDeletingId(null);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-24 border rounded-xl border-dashed bg-background">
        <p className="text-muted-foreground mb-4">No posts yet.</p>
        <Button asChild><Link href="/admin/posts/new">Add your first post</Link></Button>
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-background shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="text-left font-semibold px-4 py-3">Title</th>
            <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">Category</th>
            <th className="text-left font-semibold px-4 py-3 hidden lg:table-cell">Created</th>
            <th className="text-right font-semibold px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium"><span className="line-clamp-1">{post.title}</span></td>
              <td className="px-4 py-3 hidden md:table-cell"><Badge variant="outline">{post.category}</Badge></td>
              <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{formatDate(post.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/posts/${post.id}/edit`}><Edit className="h-4 w-4" /></Link>
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    disabled={deletingId === post.id}
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
