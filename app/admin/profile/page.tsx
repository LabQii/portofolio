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
  const [projectsTitle, setProjectsTitle] = useState("");
  const [projectsDescription, setProjectsDescription] = useState("");
  const [activitiesTitle, setActivitiesTitle] = useState("");
  const [activitiesDescription, setActivitiesDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        if (data) {
          setName(data.name);
          setDescription(data.description);
          setProjectsTitle(data.projectsTitle || "");
          setProjectsDescription(data.projectsDescription || "");
          setActivitiesTitle(data.activitiesTitle || "");
          setActivitiesDescription(data.activitiesDescription || "");
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
      const result = await updateProfile({
        name,
        description,
        projectsTitle,
        projectsDescription,
        activitiesTitle,
        activitiesDescription
      });
      if (result.success) { router.refresh(); alert("Profile updated successfully!"); }
      else { alert(result.error || "Failed to update profile"); }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 bg-[#f4f5f7] min-h-screen">
      <AdminBreadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Manage Profile" }]} />
      <h1 className="text-[22px] font-bold text-[#0f172a] mt-2 mb-8">Manage Profile</h1>
      
      {isFetching ? (
        <div className="flex justify-center py-20 bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1e293b]" />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6 flex flex-col pb-20">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Profile Information */}
            <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-[28px_32px] flex flex-col h-full">
              <div className="border-l-[3px] border-[#1e293b] pl-3 mb-5">
                <h3 className="text-[15px] font-semibold text-[#0f172a]">
                  Edit Profile Information
                </h3>
              </div>
              <div className="border-b border-[#f1f5f9] mb-5"></div>
              
              <div className="space-y-4 flex-grow">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Name (Hero Heading)
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    required
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Description (Hero Paragraph)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Enter description..."
                    required
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all resize-vertical min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Projects Settings */}
            <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-[28px_32px] flex flex-col h-full">
              <div className="border-l-[3px] border-[#1e293b] pl-3 mb-5">
                <h3 className="text-[15px] font-semibold text-[#0f172a]">
                  Projects Page Settings
                </h3>
              </div>
              <div className="border-b border-[#f1f5f9] mb-5"></div>
              
              <div className="space-y-4 flex-grow">
                <div className="space-y-1.5">
                  <label htmlFor="projectsTitle" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Projects Page Title
                  </label>
                  <input
                    id="projectsTitle"
                    value={projectsTitle}
                    onChange={(e) => setProjectsTitle(e.target.value)}
                    placeholder="E.g., My Projects"
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="projectsDescription" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Projects Page Description
                  </label>
                  <textarea
                    id="projectsDescription"
                    value={projectsDescription}
                    onChange={(e) => setProjectsDescription(e.target.value)}
                    rows={6}
                    placeholder="E.g., A collection of my work..."
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all resize-vertical min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Activities Settings */}
            <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-[28px_32px] flex flex-col h-full">
              <div className="border-l-[3px] border-[#1e293b] pl-3 mb-5">
                <h3 className="text-[15px] font-semibold text-[#0f172a]">
                  Activities Page Settings
                </h3>
              </div>
              <div className="border-b border-[#f1f5f9] mb-5"></div>
              
              <div className="space-y-4 flex-grow">
                <div className="space-y-1.5">
                  <label htmlFor="activitiesTitle" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Activities Page Title
                  </label>
                  <input
                    id="activitiesTitle"
                    value={activitiesTitle}
                    onChange={(e) => setActivitiesTitle(e.target.value)}
                    placeholder="E.g., Writing"
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="activitiesDescription" className="block text-[12px] font-medium text-[#64748b] tracking-[0.03em]">
                    Activities Page Description
                  </label>
                  <textarea
                    id="activitiesDescription"
                    value={activitiesDescription}
                    onChange={(e) => setActivitiesDescription(e.target.value)}
                    rows={6}
                    placeholder="E.g., Sharing my thoughts..."
                    className="w-full border border-[#e2e8f0] rounded-lg px-[14px] py-[10px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#1e293b] focus:shadow-[0_0_0_3px_rgba(30,41,59,0.07)] transition-all resize-vertical min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-4 bg-white rounded-[16px] shadow-sm border border-slate-100 p-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="text-[14px] font-medium text-[#94a3b8] hover:text-[#1e293b] transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#1e293b] text-white px-8 py-[11px] rounded-lg text-[14px] font-semibold hover:bg-[#0f172a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save All Changes"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
