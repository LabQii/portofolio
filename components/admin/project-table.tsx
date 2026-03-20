"use client";

import { deleteProject } from "@/app/actions/project-actions";
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
      <div className="text-center py-24 border-2 border-dashed border-[#e2e8f0] rounded-xl bg-white">
        <p className="text-[#64748b] mb-4 text-sm">No projects yet.</p>
        <Link href="/admin/projects/new" className="px-4 py-2 text-sm font-medium text-white bg-[#1e293b] rounded-lg">Add your first project</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3">Title</th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3 hidden md:table-cell">Category</th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3 hidden lg:table-cell">Created</th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3 hidden sm:table-cell">Views</th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3">Featured</th>
            <th className="text-right text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors">
              <td className="px-4 py-[14px] font-medium text-[#0f172a]">
                <span className="line-clamp-1">{project.title}</span>
              </td>
              <td className="px-4 py-[14px] hidden md:table-cell">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                  {project.category}
                </span>
              </td>
              <td className="px-4 py-[14px] text-[#64748b] hidden lg:table-cell text-xs">{formatDate(project.createdAt)}</td>
              <td className="px-4 py-[14px] hidden sm:table-cell">
                <div className="flex items-center gap-1 text-[#94a3b8] text-xs"><Eye className="h-3.5 w-3.5" />{project.views}</div>
              </td>
              <td className="px-4 py-[14px]">
                {project.featured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Featured
                  </span>
                ) : (
                  <span className="text-[#94a3b8] text-xs">—</span>
                )}
              </td>
              <td className="px-4 py-[14px]">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/projects/${project.id}/edit`} className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100 transition-colors">
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-red-50 transition-colors disabled:opacity-40"
                    disabled={deletingId === project.id}
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
