"use client";

import { useState, useEffect } from "react";
import { updateProfile, getProfile } from "@/app/actions/profile";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        if (data) {
          setName(data.name);
          setDescription(data.description);
        } else {
          setName("Hi, I am Muhammad Iqbal Firmansyah");
          setDescription("Fullstack JavaScript Developer...");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsFetching(false);
      }
    }
    loadProfile();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) { alert("Name and description are required."); return; }
    setIsLoading(true);
    try {
      const result = await updateProfile({ name, description });
      if (result.success) { router.refresh(); alert("Profile updated successfully!"); }
      else { alert(result.error || "Failed to update profile"); }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Manage Profile" }]} />
      <h1 className="text-[22px] font-bold text-[#0f172a] mt-1 mb-1">Manage Profile</h1>
      <p className="text-[13px] text-[#64748b] mb-1">Update your hero heading and bio shown on the public site.</p>
      <hr className="border-[#f1f5f9] mb-6" />

      <div className="max-w-[680px] bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] p-8">
        <h2 className="text-[16px] font-semibold text-[#0f172a] mb-6">Edit Profile Information</h2>

        {isFetching ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-7 w-7 animate-spin text-[#64748b]" />
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em]">
                Name (Hero Heading)
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Hi, I am John Doe"
                required
                className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.08)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.05em]">
                Description (Hero Paragraph)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Enter your short bio or profile description..."
                required
                className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.08)] transition-all resize-vertical min-h-[140px]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/admin")}
                disabled={isLoading}
                className="px-5 py-[10px] text-[14px] font-medium text-[#64748b] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-[10px] text-[14px] font-medium text-white bg-[#1e293b] rounded-lg hover:bg-[#0f172a] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
