"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
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

  try {
    // Upload new CV to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "portfolio/cv", resource_type: "raw" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });

    const fileUrl = uploadResult.secure_url;

    const oldCV = await prisma.cV.findFirst({ orderBy: { updatedAt: "desc" } });
    
    // Attempt to delete old CV from Cloudinary if it exists and is from cloudinary
    if (oldCV && oldCV.fileUrl.includes("cloudinary.com")) {
      const parts = oldCV.fileUrl.split("/");
      const filename = parts[parts.length - 1];
      const publicId = `portfolio/cv/${filename}`;
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      } catch (e) {
        // ignore deletion errors
      }
    }

    if (oldCV) {
      await prisma.cV.update({
        where: { id: oldCV.id },
        data: { fileUrl, fileName: file.name },
      });
    } else {
      await prisma.cV.create({
        data: { fileUrl, fileName: file.name },
      });
    }

    revalidatePath("/admin/cv");
    revalidatePath("/");
    return { success: true, url: fileUrl };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upload file to Cloudinary" };
  }
}
