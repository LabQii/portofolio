"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const profile = await prisma.profile.findFirst();
  return profile;
}

export async function updateProfile(data: { 
  name: string; 
  description: string;
  projectsTitle?: string;
  projectsDescription?: string;
  activitiesTitle?: string;
  activitiesDescription?: string;
}) {
  try {
    const existing = await prisma.profile.findFirst();
    
    if (existing) {
      await prisma.profile.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.profile.create({
        data,
      });
    }
    
    revalidatePath("/");
    revalidatePath("/admin/profile");
    revalidatePath("/projects");
    revalidatePath("/posts");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
