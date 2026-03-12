"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getAdmins() {
  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      email: true,
    },
    orderBy: { email: "asc" },
  });
  return admins;
}

export async function createAdmin(data: { email: string; password: string }) {
  try {
    const existing = await prisma.admin.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return { success: false, error: "Admin with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.admin.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error creating admin:", error);
    return { success: false, error: "Failed to create admin" };
  }
}

export async function deleteAdmin(id: string, currentUserId: string) {
  try {
    if (id === currentUserId) {
      return { success: false, error: "Cannot delete yourself" };
    }

    const count = await prisma.admin.count();
    if (count <= 1) {
      return { success: false, error: "Cannot delete the last admin" };
    }

    await prisma.admin.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting admin:", error);
    return { success: false, error: "Failed to delete admin" };
  }
}
