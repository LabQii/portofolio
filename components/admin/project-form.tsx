"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Upload } from "lucide-react";
import Image from "next/image";
import type { Project } from "@prisma/client";

const CATEGORIES = ["Website", "UI/UX", "Assignment", "Android"];

interface ProjectFormProps {
  project?: Project;
  action: (formData: FormData) => Promise<{ success: boolean }>;
  submitLabel?: string;
}

export default function ProjectForm({ project, action, submitLabel = "Save Project" }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<string[]>(project?.tags ?? []);
  const [techStack, setTechStack] = useState<string[]>(project?.techStack ?? []);
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(project?.thumbnail ?? null);
  const [error, setError] = useState("");

  const addTag = () => { if (tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } };
  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));
  const addTech = () => { if (techInput.trim()) { setTechStack([...techStack, techInput.trim()]); setTechInput(""); } };
  const removeTech = (t: string) => setTechStack(techStack.filter((x) => x !== t));

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setThumbnail(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Inject computed arrays
    formData.set("tags", tags.join(","));
    formData.set("techStack", techStack.join(","));

    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  const generateSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    const slugInput = document.getElementById("slug") as HTMLInputElement;
    if (slugInput) slugInput.value = slug;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" defaultValue={project?.title} onChange={generateSlug} required placeholder="My Awesome Project" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" defaultValue={project?.slug} required placeholder="my-awesome-project" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description *</Label>
        <Input id="description" name="description" defaultValue={project?.description} required placeholder="A brief one-line summary" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Full Description (Markdown supported)</Label>
        <Textarea id="content" name="content" defaultValue={project?.content ?? ""} rows={6} placeholder="Detailed description, challenges, solutions..." className="resize-y" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select id="category" name="category" defaultValue={project?.category ?? "Website"} required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2 flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={project?.featured} className="h-4 w-4 rounded border-input accent-blue-600" />
            <span className="text-sm font-medium">Featured on homepage</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input id="demoUrl" name="demoUrl" type="url" defaultValue={project?.demoUrl ?? ""} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input id="githubUrl" name="githubUrl" type="url" defaultValue={project?.githubUrl ?? ""} placeholder="https://github.com/..." />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
          <Button type="button" variant="outline" onClick={addTag}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-muted rounded-full text-sm">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="space-y-2">
        <Label>Tech Stack</Label>
        <div className="flex gap-2">
          <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} />
          <Button type="button" variant="outline" onClick={addTech}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {techStack.map((tech, i) => {
            const colors = [
              "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
              "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
              "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
              "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
              "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
            ];
            const colorClass = colors[i % colors.length];
            return (
              <span key={tech} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm transition-colors ${colorClass}`}>
                {tech}
                <button type="button" onClick={() => removeTech(tech)}><X className="h-3 w-3" /></button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail</Label>
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer relative">
          <input id="thumbnail" name="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          {thumbnail ? (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <span className="text-sm">Click or drag to upload thumbnail</span>
              <span className="text-xs">PNG, JPG, WebP accepted</span>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>Cancel</Button>
      </div>
    </form>
  );
}
