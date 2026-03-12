"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import type { Post } from "@prisma/client";

const CATEGORIES = ["Event", "Achievement", "Experience", "Certification", "Other"];

interface PostFormProps {
  post?: Post;
  action: (formData: FormData) => Promise<{ success: boolean }>;
  submitLabel?: string;
}

export default function PostForm({ post, action, submitLabel = "Save Post" }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [thumbnail, setThumbnail] = useState<string | null>(post?.thumbnail ?? null);
  const [error, setError] = useState("");

  const generateSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    const slugInput = document.getElementById("slug") as HTMLInputElement;
    if (slugInput) slugInput.value = slug;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" defaultValue={post?.title} onChange={generateSlug} required placeholder="Post title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" defaultValue={post?.slug} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" defaultValue={post?.description} required rows={3} placeholder="Brief summary of this post..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select id="category" name="category" defaultValue={post?.category ?? "Event"} required className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventName">Event Name</Label>
          <Input id="eventName" name="eventName" defaultValue={post?.eventName ?? ""} placeholder="e.g. DICODING CYCLE 6" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="teamName">Team Name</Label>
          <Input id="teamName" name="teamName" defaultValue={post?.teamName ?? ""} placeholder="e.g. THREE HEARTS, ONE MISSION" />
        </div>
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail</Label>
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer relative">
          <input id="thumbnail" name="thumbnail" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setThumbnail(URL.createObjectURL(f)); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          {thumbnail ? (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <span className="text-sm">Click or drag to upload thumbnail</span>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/posts")}>Cancel</Button>
      </div>
    </form>
  );
}
