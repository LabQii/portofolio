"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Upload } from "lucide-react";
import Image from "next/image";
import type { Project } from "@prisma/client";
import { useToast } from "@/components/ui/toast";

const CATEGORIES = ["Website", "UI/UX", "Assignment", "Android"];
const TECH_COLORS = [
  "bg-blue-50 text-blue-700", "bg-emerald-50 text-emerald-700",
  "bg-violet-50 text-violet-700", "bg-amber-50 text-amber-700", "bg-rose-50 text-rose-700",
];

const cls = "w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.08)] transition-all bg-white";
const label = "block text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em] mb-1.5";

interface ProjectFormProps {
  project?: Project;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  submitLabel?: string;
}

export default function ProjectForm({ project, action, submitLabel = "Save Project" }: ProjectFormProps) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<string[]>(project?.tags ?? []);
  const [techStack, setTechStack] = useState<string[]>(project?.techStack ?? []);
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(project?.thumbnail ?? null);
  const [featured, setFeatured] = useState(project?.featured ?? false);

  const addTag = () => { if (tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } };
  const removeTag = (index: number) => setTags(tags.filter((_, i) => i !== index));
  const addTech = () => { if (techInput.trim()) { setTechStack([...techStack, techInput.trim()]); setTechInput(""); } };
  const removeTech = (index: number) => setTechStack(techStack.filter((_, i) => i !== index));

  const generateSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    const slugInput = document.getElementById("slug") as HTMLInputElement;
    if (slugInput) slugInput.value = slug;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("tags", tags.join(","));
    formData.set("techStack", techStack.join(","));
    formData.set("featured", featured ? "on" : "");
    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result.success) {
          success(project ? "Project updated successfully!" : "Project created successfully!");
          router.push("/admin/projects");
          router.refresh();
        } else {
          toastError(result.error || "Something went wrong. Please try again.");
        }
      } catch (err) {
        console.error("Form submission error:", err);
        toastError("An unexpected error occurred. The file might be too large.");
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        {/* Title + Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div><label className={label}>Title *</label><input id="title" name="title" defaultValue={project?.title} onChange={generateSlug} required placeholder="My Awesome Project" className={cls} /></div>
          <div><label className={label}>Slug *</label><input id="slug" name="slug" defaultValue={project?.slug} required placeholder="my-awesome-project" className={cls} /></div>
        </div>

        {/* Short Description */}
        <div><label className={label}>Short Description *</label><input id="description" name="description" defaultValue={project?.description} required placeholder="A brief one-line summary" className={cls} /></div>

        {/* Full Description */}
        <div>
          <label className={label}>Full Description</label>
          <textarea id="content" name="content" defaultValue={project?.content ?? ""} rows={6} placeholder="Detailed description, challenges, solutions..." className={`${cls} resize-vertical min-h-[160px]`} />
          <p className="text-[12px] text-[#94a3b8] mt-1.5">Markdown is supported for formatting.</p>
        </div>

        {/* Category + Featured toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={label}>Category *</label>
            <select id="category" name="category" defaultValue={project?.category ?? "Website"} required className={cls}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col justify-end pb-[10px]">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${featured ? "bg-[#1e293b]" : "bg-slate-200"}`}
                onClick={() => setFeatured(!featured)}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${featured ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-[14px] font-medium text-[#0f172a]">Featured on homepage</span>
            </label>
          </div>
        </div>

        {/* Demo + Video + GitHub URLs + Order */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div><label className={label}>Demo URL</label><input id="demoUrl" name="demoUrl" type="url" defaultValue={project?.demoUrl ?? ""} placeholder="https://..." className={cls} /></div>
          <div><label className={label}>YouTube Video URL</label><input id="videoUrl" name="videoUrl" type="url" defaultValue={project?.videoUrl ?? ""} placeholder="https://youtube.com/..." className={cls} /></div>
          <div><label className={label}>GitHub URL</label><input id="githubUrl" name="githubUrl" type="url" defaultValue={project?.githubUrl ?? ""} placeholder="https://github.com/..." className={cls} /></div>
          <div><label className={label}>Display Order</label><input id="order" name="order" type="number" defaultValue={project?.order ?? 0} placeholder="0" className={cls} /></div>
        </div>

        {/* Tags */}
        <div>
          <label className={label}>Tags</label>
          <div className="border border-[#e2e8f0] rounded-lg px-3 py-2 min-h-[44px] flex flex-wrap gap-2 items-center focus-within:border-[#1e293b] focus-within:shadow-[0_0_0_3px_rgba(30,41,59,0.08)] transition-all">
            {tags.map((tag, i) => (
              <span key={`${tag}-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f1f5f9] rounded-full text-[12px] font-medium text-[#0f172a]">
                {tag}<button type="button" onClick={() => removeTag(i)} className="text-[#94a3b8] hover:text-[#ef4444]"><X className="h-3 w-3" /></button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              onBlur={addTag}
              placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
              className="flex-1 min-w-[120px] border-0 outline-none text-[14px] bg-transparent placeholder:text-[#94a3b8]"
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className={label}>Tech Stack</label>
          <div className="border border-[#e2e8f0] rounded-lg px-3 py-2 min-h-[44px] flex flex-wrap gap-2 items-center focus-within:border-[#1e293b] focus-within:shadow-[0_0_0_3px_rgba(30,41,59,0.08)] transition-all">
            {techStack.map((tech, i) => (
              <span key={`${tech}-${i}`} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${TECH_COLORS[i % TECH_COLORS.length]}`}>
                {tech}<button type="button" onClick={() => removeTech(i)} className="opacity-60 hover:opacity-100"><X className="h-3 w-3" /></button>
              </span>
            ))}
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
              onBlur={addTech}
              placeholder={techStack.length === 0 ? "Type and press Enter..." : ""}
              className="flex-1 min-w-[120px] border-0 outline-none text-[14px] bg-transparent placeholder:text-[#94a3b8]"
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className={label}>Thumbnail</label>
          <div className="border-2 border-dashed border-[#cbd5e1] rounded-xl overflow-hidden hover:border-[#1e293b] hover:bg-[#f8fafc] transition-all cursor-pointer relative group">
            <input id="thumbnail" name="thumbnail" type="file" accept="image/*" onChange={(e) => { 
              const f = e.target.files?.[0]; 
              if (f) {
                if (f.size > 5 * 1024 * 1024) {
                  toastError("File is too large. Max size is 5MB.");
                  e.target.value = "";
                  return;
                }
                setThumbnail(URL.createObjectURL(f)); 
              }
            }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            {thumbnail ? (
              <div className="relative aspect-video"><Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" /><div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"><span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1.5 rounded-lg">Change Image</span></div></div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#94a3b8] py-10">
                <Upload className="h-8 w-8" />
                <span className="text-sm">Click or drag to upload thumbnail</span>
                <span className="text-xs">PNG, JPG, WebP accepted</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.push("/admin/projects")} className="px-5 py-[10px] text-[14px] font-medium text-[#64748b] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={isPending} className="px-5 py-[10px] text-[14px] font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}{isPending ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </>
  );
}
