import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, FileText, FileUp, Plus, User, Users, Image as ImageIcon, Briefcase } from "lucide-react";
import { formatDate } from "@/lib/utils";
import AdminSignOut from "@/components/admin/sign-out-button";
import Image from "next/image";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [projectCount, postCount, cv, experienceCount] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.cV.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.experience.count(),
  ]);

  const stats = [
    { label: "Total Projects", value: projectCount, icon: FolderOpen, href: "/admin/projects" },
    { label: "Total Posts", value: postCount, icon: FileText, href: "/admin/posts" },
    { label: "Experiences", value: experienceCount, icon: Briefcase, href: "/admin/experiences" },
    { label: "CV Updated", value: cv ? formatDate(cv.updatedAt) : "Never", icon: FileUp, href: "/admin/cv" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-page)" }}>
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 w-full py-4">
        <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex-shrink-0">
              <Image 
                src="/images/profile/foto-profile.jpg" 
                alt="Profile" 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy leading-none mb-1">Portfolio Admin</h1>
              <p className="text-xs text-slate-500 font-medium">Welcome back, {session.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/" target="_blank">View Site</Link>
            </Button>
            <AdminSignOut />
          </div>
        </div>
      </header>

      <main className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8 text-navy">Dashboard Overview</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button asChild className="h-20 flex-col gap-2 text-base">
            <Link href="/admin/projects/new">
              <Plus className="h-5 w-5" /> New Project
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2 text-base">
            <Link href="/admin/posts/new">
              <Plus className="h-5 w-5" /> New Post
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2 text-base">
            <Link href="/admin/cv">
              <FileUp className="h-5 w-5" /> Upload CV
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2 text-base">
            <Link href="/admin/profile">
              <User className="h-5 w-5" /> Manage Profile
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2 text-base">
            <Link href="/admin/users">
              <Users className="h-5 w-5" /> Manage Admins
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2 text-base border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-700">
            <Link href="/admin/tech-stacks">
              <ImageIcon className="h-5 w-5" /> Tech Logos
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-2 text-base border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-700">
            <Link href="/admin/experiences">
              <Briefcase className="h-5 w-5" /> Experiences
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
