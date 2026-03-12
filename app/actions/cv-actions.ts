"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function uploadCV(formData: FormData) {
  const file = formData.get("cv") as File;
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" };
  }
  if (!file.name.endsWith(".pdf")) {
    return { success: false, error: "Only PDF files are allowed" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `cv-${Date.now()}.pdf`;

  // Remove old CV from storage
  const oldCV = await prisma.cV.findFirst({ orderBy: { updatedAt: "desc" } });
  if (oldCV) {
    const oldFileName = oldCV.fileUrl.split("/").pop();
    if (oldFileName) {
      await supabase.storage.from("cv-files").remove([oldFileName]);
    }
  }

  // Upload new CV to Supabase Storage
  const { data, error } = await supabase.storage
    .from("cv-files")
    .upload(fileName, buffer, { contentType: "application/pdf", upsert: true });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage.from("cv-files").getPublicUrl(fileName);

  // Upsert CV record (only keep one)
  if (oldCV) {
    await prisma.cV.update({
      where: { id: oldCV.id },
      data: { fileUrl: urlData.publicUrl, fileName: file.name },
    });
  } else {
    await prisma.cV.create({
      data: { fileUrl: urlData.publicUrl, fileName: file.name },
    });
  }

  revalidatePath("/admin/cv");
  revalidatePath("/");
  return { success: true, url: urlData.publicUrl };
}
