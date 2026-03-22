"use client";

import { deleteExperience, toggleExperienceFeatured, updateExperiencesOrder } from "@/app/actions/experience-actions";
import Link from "next/link";
import { Edit, Trash2, Star, GripVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { useConfirm } from "@/components/ui/confirm-modal";
import { useToast } from "@/components/ui/toast";
import { Reorder } from "framer-motion";

type Experience = {
  id: string; category: string; period: string; title: string;
  organization: string; description: string; tags: string[];
  featured: boolean; order: number; createdAt: Date; updatedAt: Date;
};

const categoryColors: Record<string, string> = {
  Work: "bg-blue-50 text-blue-700",
  Internship: "bg-purple-50 text-purple-700",
  Experience: "bg-slate-100 text-slate-700",
  Achievement: "bg-slate-100 text-slate-700",
};

export default function AdminExperienceTable({ experiences: initialExperiences }: { experiences: Experience[] }) {
  const confirm = useConfirm();
  const { success, error: toastError } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [items, setItems] = useState(initialExperiences);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setItems(initialExperiences);
  }, [initialExperiences]);

  const handleReorder = async (newOrder: Experience[]) => {
    setItems(newOrder);
    setIsUpdating(true);
    try {
      await updateExperiencesOrder(newOrder.map(e => e.id));
      success("Order updated successfully");
    } catch (err) {
      toastError("Failed to update order");
      setItems(initialExperiences);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete Experience",
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      type: "danger"
    });

    if (!ok) return;

    setDeletingId(id);
    try {
      await deleteExperience(id);
      success("Experience deleted successfully!");
    } catch (err) {
      toastError("Failed to delete experience.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setTogglingId(id);
    await toggleExperienceFeatured(id, !current);
    setTogglingId(null);
  };

  if (initialExperiences.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-[#e2e8f0] rounded-xl bg-white">
        <p className="text-[#64748b] mb-4 text-sm">No experiences yet.</p>
        <Link href="/admin/experiences/new" className="px-4 py-2 text-sm font-medium text-white bg-[#1e293b] rounded-lg">Add your first experience</Link>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] transition-opacity ${isUpdating ? 'opacity-70 pointer-events-none' : ''}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <th className="w-10 px-4 py-3"></th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3">Title</th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3 hidden md:table-cell">Organization</th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3 hidden lg:table-cell">Category</th>
            <th className="text-left text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3 hidden lg:table-cell">Period</th>
            <th className="text-center text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3">Featured</th>
            <th className="text-right text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] px-4 py-3">Actions</th>
          </tr>
        </thead>
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} as="tbody">
          {items.map((exp) => (
            <Reorder.Item 
              key={exp.id} 
              value={exp} 
              as="tr" 
              className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors cursor-default"
            >
              <td className="px-4 py-[14px] text-center">
                <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors">
                  <GripVertical className="h-4 w-4 mx-auto" />
                </div>
              </td>
              <td className="px-4 py-[14px] font-medium text-[#0f172a]"><span className="line-clamp-1">{exp.title}</span></td>
              <td className="px-4 py-[14px] text-[#64748b] hidden md:table-cell"><span className="line-clamp-1">{exp.organization}</span></td>
              <td className="px-4 py-[14px] hidden lg:table-cell">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[exp.category] ?? "bg-slate-100 text-slate-700"}`}>
                  {exp.category}
                </span>
              </td>
              <td className="px-4 py-[14px] text-[#64748b] text-xs hidden lg:table-cell">{exp.period}</td>
              <td className="px-4 py-[14px] text-center">
                <button
                  onClick={() => handleToggleFeatured(exp.id, exp.featured)}
                  disabled={togglingId === exp.id}
                  className="p-1.5 rounded-lg transition-colors hover:bg-amber-50 disabled:opacity-40"
                  title={exp.featured ? "Unmark featured" : "Mark as featured"}
                >
                  <Star className="h-4 w-4" fill={exp.featured ? "#f59e0b" : "none"} stroke={exp.featured ? "#f59e0b" : "#94a3b8"} />
                </button>
              </td>
              <td className="px-4 py-[14px]">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/experiences/${exp.id}/edit`} className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100 transition-colors">
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#ef4444] hover:bg-red-50 transition-colors disabled:opacity-40"
                    disabled={deletingId === exp.id}
                    onClick={() => handleDelete(exp.id, exp.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </table>
    </div>
  );
}
