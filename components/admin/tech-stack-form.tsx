"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import { createOrUpdateTechStack, deleteTechStack } from "@/app/actions/tech-stack-actions";

type TechStackItem = {
  id: string;
  name: string;
  customLogoUrl: string | null;
};

interface TechStackFormProps {
  techStacks: TechStackItem[];
}

export default function TechStackAdminForm({ techStacks }: TechStackFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingTech, setEditingTech] = useState<TechStackItem | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleEdit = (tech: TechStackItem) => {
    setEditingTech(tech);
    setThumbnailPreview(tech.customLogoUrl);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingTech(null);
    setThumbnailPreview(null);
    setError("");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    startTransition(async () => {
      const result = await deleteTechStack(id);
      if (result.success) {
        if (editingTech?.id === id) handleCancelEdit();
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingTech && editingTech.customLogoUrl) {
      formData.set("existingLogoUrl", editingTech.customLogoUrl);
    }

    startTransition(async () => {
      const result = await createOrUpdateTechStack(formData);
      if (result.success) {
        handleCancelEdit();
        router.refresh();
        (e.target as HTMLFormElement).reset();
      } else {
        setError(result.error || "Failed to save tech stack");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* List Existing Custom Tech Stacks */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Tech Stacks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {techStacks.length === 0 ? (
              <p className="text-muted-foreground italic text-sm">No custom tech stacks found.</p>
            ) : (
              techStacks.map((tech) => (
                <div key={tech.id} className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {tech.customLogoUrl ? (
                       <div className="relative w-8 h-8 rounded-md overflow-hidden bg-white border shadow-sm">
                         <Image src={tech.customLogoUrl} alt={tech.name} fill className="object-cover p-1" />
                       </div>
                    ) : (
                       <div className="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                         {tech.name.charAt(0).toUpperCase()}
                       </div>
                    )}
                    <span className="font-semibold text-slate-800">{tech.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tech)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(tech.id, tech.name)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingTech ? "Edit Custom Logo" : "Add Custom Logo"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="space-y-2">
              <Label htmlFor="name">Tech Stack Name (e.g. Next.js) *</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={editingTech?.name ?? ""} 
                key={editingTech?.name ?? "new-name"} 
                required 
                placeholder="React Native" 
                disabled={!!editingTech} // Disable name edit to maintain constraints nicely, or handle rename logic securely
              />
              {editingTech && <p className="text-xs text-muted-foreground">Name cannot be changed while editing to preserve project associations. Create a new one instead.</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Upload Custom SVG/PNG</Label>
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer relative">
                <input id="logo" name="logo" type="file" accept="image/png, image/svg+xml, image/webp, image/jpeg" onChange={handleThumbnailChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {thumbnailPreview ? (
                  <div className="flex flex-col items-center gap-3">
                     <div className="relative w-16 h-16 rounded-lg overflow-hidden border shadow-sm bg-white p-2">
                      <Image src={thumbnailPreview} alt="Logo preview" fill className="object-contain p-1" />
                    </div>
                    <span className="text-sm font-medium text-blue-600">Change image</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm">Click or drag to upload logo</span>
                    <span className="text-xs">SVG, PNG, JPG, WebP</span>
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : (editingTech ? "Update Logo" : "Save Custom Logo")}
              </Button>
              {editingTech && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
