"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAdmins, deleteAdmin } from "@/app/actions/admin";
import { Loader2, Plus, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Admin = {
  id: string;
  email: string;
};

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession() || {};

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to load admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin account?")) return;
    
    setDeletingId(id);
    try {
      if (!(session?.user as any)?.id) {
        alert("Session error. Cannot delete right now.");
        return;
      }
      const result = await deleteAdmin(id, (session?.user as any).id);
      if (result.success) {
        await fetchAdmins();
        alert("Admin deleted successfully.");
      } else {
        alert(result.error || "Failed to delete admin.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-light-blue py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-navy">Manage Admins</h1>
          <Button asChild className="bg-navy hover:bg-navy/90">
            <Link href="/admin/users/new">
              <Plus className="mr-2 h-4 w-4" /> Add Admin
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>
              Manage users who have access to this dashboard. Note: You cannot delete your own account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-navy" />
              </div>
            ) : admins.length > 0 ? (
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr_auto] gap-4 p-4 font-medium border-b bg-muted/50">
                  <div>Email</div>
                  <div className="text-right pr-4">Actions</div>
                </div>
                <div className="divide-y">
                  {admins.map((admin) => {
                    const isCurrentUser = session?.user?.email === admin.email;
                    return (
                      <div key={admin.id} className="grid grid-cols-[1fr_auto] gap-4 p-4 items-center transition-colors hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{admin.email}</span>
                          {isCurrentUser && (
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-transparent">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isCurrentUser || deletingId === admin.id}
                            onClick={() => handleDelete(admin.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:text-red-700"
                          >
                            {deletingId === admin.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ShieldAlert className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No admins found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
