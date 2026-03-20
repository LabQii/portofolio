import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import CVUploadClient from "@/components/admin/cv-upload";

export default async function AdminCVPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const cv = await prisma.cV.findFirst({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b px-6 py-4">
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Dashboard</Link>
        <h1 className="text-xl font-bold mt-1">CV Management</h1>
      </header>
      <main className="w-full mx-auto px-6 py-8 max-w-[576px]">
        <div className="bg-background rounded-xl border p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Upload New CV</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Upload a PDF file. The old CV will be automatically replaced. The new CV will be available for download on your homepage.
          </p>
          <CVUploadClient currentCV={cv} />
        </div>
      </main>
    </div>
  );
}
