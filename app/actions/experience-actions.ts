"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Experience } from "@prisma/client";

export async function createExperience(formData: FormData) {
  const title = formData.get("title") as string;
  const organization = formData.get("organization") as string;
  const category = formData.get("category") as string;
  const period = formData.get("period") as string;
  const description = formData.get("description") as string;
  const tagsRaw = formData.get("tags") as string;
  const featured = formData.get("featured") === "on";
  const order = parseInt(formData.get("order") as string, 10) || 0;

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (!title || !organization || !category || !period || !description) {
    return { success: false, error: "All required fields must be filled." };
  }

  await prisma.experience.create({
    data: { title, organization, category, period, description, tags, featured, order },
  });

  revalidatePath("/");
  revalidatePath("/admin/experiences");
  return { success: true };
}

export async function updateExperience(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const organization = formData.get("organization") as string;
  const category = formData.get("category") as string;
  const period = formData.get("period") as string;
  const description = formData.get("description") as string;
  const tagsRaw = formData.get("tags") as string;
  const featured = formData.get("featured") === "on";
  const order = parseInt(formData.get("order") as string, 10) || 0;

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  await prisma.experience.update({
    where: { id },
    data: { title, organization, category, period, description, tags, featured, order },
  });

  revalidatePath("/");
  revalidatePath("/admin/experiences");
  return { success: true };
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/experiences");
  return { success: true };
}

export async function toggleExperienceFeatured(id: string, featured: boolean) {
  await prisma.experience.update({ where: { id }, data: { featured } });
  revalidatePath("/");
  revalidatePath("/admin/experiences");
  return { success: true };
}

export async function updateExperiencesOrder(ids: string[]) {
  const updates = ids.map((id, index) =>
    prisma.experience.update({
      where: { id },
      data: { order: index + 1 },
    })
  );
  await Promise.all(updates);
  revalidatePath("/");
  revalidatePath("/admin/experiences");
  return { success: true };
}
