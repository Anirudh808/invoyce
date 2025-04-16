"use server";

import { authOptions } from "@/auth";
import { uploadFile } from "../FileUpload";
import getServerSession from "next-auth";
import { db } from "@/database/db";
import { clients, GetClient } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function changeClientPhoto(file: File) {
  const fileUrl = await uploadFile(file);

  const loggedIn = getServerSession(authOptions);
  const auth = await loggedIn.auth();
  if (!auth?.user) {
    return { success: false, message: "Not Authorized" };
  }
  const authUserId = auth.user.id;

  try {
    const updatedUser = await db
      .update(clients)
      .set({
        profilePic: fileUrl,
      })
      .where(eq(clients.userId, authUserId as string))
      .returning();

    return { success: true, data: updatedUser[0] };
  } catch (error) {
    return { success: false, message: error };
  }
}

export async function updateClient(client: Partial<GetClient>, id: string) {
  const loggedIn = getServerSession(authOptions);
  const auth = await loggedIn.auth();
  if (!auth?.user) {
    return { success: false, message: "Not Authorized" };
  }
  const authUserId = auth.user.id;

  try {
    const updatedClient = await db
      .update(clients)
      .set({
        ...client,
      })
      .where(and(eq(clients.userId, authUserId as string), eq(clients.id, id)))
      .returning();

    return {
      success: true,
      data: updatedClient,
    };
  } catch (error) {
    return { success: false, message: error };
  }
}
