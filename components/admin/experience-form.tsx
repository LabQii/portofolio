"use client";

import { useState, useTransition, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";

type Experience = {
  id: string; category: string; period: string; title: string;
  organization: string; description: string; tags: string[];
  featured: boolean; order: number; createdAt: Date; updatedAt: Date;
};

const CATEGORIES = [
  "Work",
  "Internship",
  "Organization",
  "Event Committee",
  "Research & Leadership",
  "Volunteer",
  "Freelance",
  "Mentorship",
];

interface ExperienceFormProps {
  experience?: Experience;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  submitLabel?: string;
}

export default function ExperienceForm({ experience, action, submitLabel = "Save Experience" }: ExperienceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [tags, setTags] = useState<string[]>(experience?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val) && tags.length < 6) {
      setTags((prev) => [...prev, val]);
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Inject tags as comma-separated
    formData.set("tags", tags.join(","));
    setError("");
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        router.push("/admin/experiences");
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title + Organization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" defaultValue={experience?.title} required placeholder="e.g. Team Lead" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization">Organization *</Label>
          <Input id="organization" name="organization" defaultValue={experience?.organization} required placeholder="e.g. PKM-KC BINUS University" />
        </div>
      </div>

      {/* Category + Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            name="category"
            defaultValue={experience?.category ?? "Organization"}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">Period *</Label>
          <Input id="period" name="period" defaultValue={experience?.period} required placeholder="e.g. Jun 2024 – Oct 2024" />
          <p className="text-xs text-muted-foreground">You can write a range or a single year.</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" defaultValue={experience?.description} required rows={5} placeholder="Describe your role and achievements..." />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTag}
          placeholder="Type a tag and press Enter or comma  (max 6)"
          disabled={tags.length >= 6}
        />
      </div>

      {/* Order + Featured */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Input id="order" name="order" type="number" min={0} defaultValue={experience?.order ?? 0} />
          <p className="text-xs text-muted-foreground">Lower number = shown first.</p>
        </div>
        <div className="flex items-center gap-3 pt-8">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={experience?.featured ?? false}
            className="h-4 w-4 rounded border-gray-300 accent-navy cursor-pointer"
          />
          <Label htmlFor="featured" className="cursor-pointer">Mark as featured (shown prominently)</Label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="min-w-36">
          {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/experiences")}>Cancel</Button>
      </div>
    </form>
  );
}
