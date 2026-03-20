"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile, getProfile } from "@/app/actions/profile";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
          setDescription("Fullstack JavaScript Developer with hands-on experience in Google Apps Script automation and web application development for operational and business needs. He has a strong interest in Front-End Development and continuously improves his skills in Laravel and modern web technologies. Experienced in supporting internal systems, improving workflow efficiency, and mentoring learners in coding environments.");
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
    if (!name.trim() || !description.trim()) {
      alert("Name and description are required.");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await updateProfile({ name, description });
      if (result.success) {
        router.refresh();
        alert("Profile updated successfully!");
      } else {
        alert(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-12" style={{ background: "var(--gradient-page)" }}>
      <div className="w-full mx-auto max-w-[768px] px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-navy mb-8">Manage Hero/Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-navy" />
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Name (Hero Heading)
                  </label>
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Hi, I am John Doe" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description (Hero Paragraph)
                  </label>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Enter your short bio or profile description..." 
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push("/admin")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="bg-navy hover:bg-navy/90">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
