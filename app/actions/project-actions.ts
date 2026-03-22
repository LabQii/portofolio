"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";

import { randomBytes } from "crypto";

function generateSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  
  const hash = randomBytes(3).toString("hex");
  return `${baseSlug}-${hash}`;
}

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tags = Array.from(new Set((formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)));
  const techStack = Array.from(new Set((formData.get("techStack") as string).split(",").map((t) => t.trim()).filter(Boolean)));
  const demoUrl = formData.get("demoUrl") as string | null;
  const videoUrl = formData.get("videoUrl") as string | null;
  const githubUrl = formData.get("githubUrl") as string | null;
  const featured = formData.get("featured") === "on";
  
  let slug = formData.get("slug") as string;
  if (!slug || slug.trim() === "") {
    slug = generateSlug(title);
  }
  
  // Ensure slug is unique in the database to prevent Prisma constraint errors
  const existingProject = await prisma.project.findUnique({ where: { slug } });
  if (existingProject) {
    slug = `${slug}-${randomBytes(3).toString("hex")}`;
  }

  // Handle thumbnail upload
  const thumbnailFile = formData.get("thumbnail") as File | null;
  let thumbnailUrl = "";
  if (thumbnailFile && thumbnailFile.size > 0) {
    if (thumbnailFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "Thumbnail file size must be less than 5MB" };
    }
    const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "portfolio/projects", format: "webp", quality: "auto", width: 1200, crop: "limit" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });
    thumbnailUrl = uploadResult.secure_url;
  }

  await prisma.project.create({
    data: {
      title,
      slug,
      description,
      content: content || null,
      thumbnail: thumbnailUrl,
      images: [],
      tags,
      techStack,
      demoUrl: demoUrl || null,
      videoUrl: videoUrl || null,
      githubUrl: githubUrl || null,
      category,
      featured,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tags = Array.from(new Set((formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean)));
  const techStack = Array.from(new Set((formData.get("techStack") as string).split(",").map((t) => t.trim()).filter(Boolean)));
  const demoUrl = formData.get("demoUrl") as string | null;
  const videoUrl = formData.get("videoUrl") as string | null;
  const githubUrl = formData.get("githubUrl") as string | null;
  const featured = formData.get("featured") === "on";
  const slug = formData.get("slug") as string;

  const existing = await prisma.project.findUnique({ where: { id } });
  let thumbnailUrl = existing?.thumbnail || "";

  const thumbnailFile = formData.get("thumbnail") as File | null;
  if (thumbnailFile && thumbnailFile.size > 0) {
    if (thumbnailFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "Thumbnail file size must be less than 5MB" };
    }
    const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "portfolio/projects", format: "webp", quality: "auto", width: 1200, crop: "limit" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });
    thumbnailUrl = uploadResult.secure_url;
  }

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      content: content || null,
      thumbnail: thumbnailUrl,
      tags,
      techStack,
      demoUrl: demoUrl || null,
      videoUrl: videoUrl || null,
      githubUrl: githubUrl || null,
      category,
      featured,
    },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}
