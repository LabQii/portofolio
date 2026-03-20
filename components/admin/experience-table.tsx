"use client";

import { deleteExperience, toggleExperienceFeatured } from "@/app/actions/experience-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, Trash2, Star } from "lucide-react";
import { useState } from "react";

type Experience = {
  id: string; category: string; period: string; title: string;
  organization: string; description: string; tags: string[];
  featured: boolean; order: number; createdAt: Date; updatedAt: Date;
};

export default function AdminExperienceTable({ experiences }: { experiences: Experience[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteExperience(id);
    setDeletingId(null);
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setTogglingId(id);
    await toggleExperienceFeatured(id, !current);
    setTogglingId(null);
  };

  if (experiences.length === 0) {
    return (
      <div className="text-center py-24 border rounded-xl border-dashed bg-background">
        <p className="text-muted-foreground mb-4">No experiences yet.</p>
        <Button asChild><Link href="/admin/experiences/new">Add your first experience</Link></Button>
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-background shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="text-left font-semibold px-4 py-3">Title</th>
            <th className="text-left font-semibold px-4 py-3 hidden md:table-cell">Organization</th>
            <th className="text-left font-semibold px-4 py-3 hidden lg:table-cell">Category</th>
            <th className="text-left font-semibold px-4 py-3 hidden lg:table-cell">Period</th>
            <th className="text-center font-semibold px-4 py-3">Featured</th>
            <th className="text-right font-semibold px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {experiences.map((exp) => (
            <tr key={exp.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium"><span className="line-clamp-1">{exp.title}</span></td>
              <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                <span className="line-clamp-1">{exp.organization}</span>
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <Badge variant="outline">{exp.category}</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{exp.period}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleToggleFeatured(exp.id, exp.featured)}
                  disabled={togglingId === exp.id}
                  className={`p-1 rounded transition-colors ${exp.featured ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-yellow-400"}`}
                  title={exp.featured ? "Unmark featured" : "Mark as featured"}
                >
                  <Star className="h-4 w-4" fill={exp.featured ? "currentColor" : "none"} />
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/experiences/${exp.id}/edit`}><Edit className="h-4 w-4" /></Link>
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    disabled={deletingId === exp.id}
                    onClick={() => handleDelete(exp.id)}
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
