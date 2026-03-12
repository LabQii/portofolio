"use client";

import { deleteProject } from "@/app/actions/project-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, Trash2, Star, Eye } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import type { Project } from "@prisma/client";

export default function AdminProjectTable({ projects }: { projects: Project[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteProject(id);
    setDeletingId(null);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-24 border rounded-xl border-dashed bg-background">
        <p className="text-muted-foreground mb-4">No projects yet.</p>
        <Button asChild><Link href="/admin/projects/new">Add your first project</Link></Button>
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
            <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Views</th>
            <th className="text-right font-semibold px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium">
                <div className="flex items-center gap-2">
                  {project.featured && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                  <span className="line-clamp-1">{project.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <Badge variant="outline">{project.category}</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{formatDate(project.createdAt)}</td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <div className="flex items-center gap-1 text-muted-foreground"><Eye className="h-3.5 w-3.5" />{project.views}</div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/projects/${project.id}/edit`}><Edit className="h-4 w-4" /></Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    disabled={deletingId === project.id}
                    onClick={() => handleDelete(project.id)}
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
