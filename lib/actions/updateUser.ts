"use server";

import { authOptions } from "@/auth";
import { db } from "@/database/db";
import { users, usersBusiness } from "@/database/schema";
import { eq } from "drizzle-orm";
import getServerSession from "next-auth";
import { GetUserWithBusiness } from "../types";
import { compare, hash } from "bcryptjs";
import { uploadFile } from "../FileUpload";

export async function changeProfilePhoto(file: File) {
  const fileUrl = await uploadFile(file);

  const loggedIn = getServerSession(authOptions);
  const auth = await loggedIn.auth();
  if (!auth?.user) {
    return { success: false, message: "Not Authorized" };
  }
  const authUserId = auth.user.id;

  try {
    const updatedUser = await db
      .update(usersBusiness)
      .set({
        profilePic: fileUrl,
      })
      .where(eq(usersBusiness.userId, authUserId as string))
      .returning();

    return { success: true, data: updatedUser[0] };
  } catch (error) {
    return { success: false, message: error };
  }
}

export async function updateUser(user: Partial<GetUserWithBusiness>) {
  const loggedIn = getServerSession(authOptions);
  const auth = await loggedIn.auth();
  if (!auth?.user) {
    return { success: false, message: "Not Authorized" };
  }
  const authUserId = auth.user.id;

  try {
    const updatedUser = await db
      .update(users)
      .set({
        ...user,
      })
      .where(eq(users.id, authUserId as string))
      .returning();
    const updatedUserBusiness = await db
      .update(usersBusiness)
      .set({
        ...user,
      })
      .where(eq(usersBusiness.userId, authUserId as string))
      .returning();

    return {
      success: true,
      data: {
        ...updatedUser[0],
        usersBusiness: updatedUserBusiness[0],
      },
    };
  } catch (error) {
    return { success: false, message: error };
  }
}

export async function changeBusinessLogo(file: File) {
  const fileUrl = await uploadFile(file);

  const loggedIn = getServerSession(authOptions);
  const auth = await loggedIn.auth();
  if (!auth?.user) {
    return { success: false, message: "Not Authorized" };
  }
  const authUserId = auth.user.id;

  try {
    const updatedUser = await db
      .update(usersBusiness)
      .set({
        businessLogo: fileUrl,
      })
      .where(eq(usersBusiness.userId, authUserId as string))
      .returning();

    return { success: true, data: updatedUser[0] };
  } catch (error) {
    return { success: false, message: error };
  }
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const session = getServerSession(authOptions);

  if (!session) {
    return { success: false, message: "User not authorized" };
  }
  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id);

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, authUserId));
    if (existingUser[0].password) {
      if (await compare(oldPassword, existingUser[0].password)) {
        existingUser[0].password = await hash(newPassword, 10);
        await db.update(users).set({
          password: existingUser[0].password,
        });
        return { success: true, message: "Password changed successfully" };
      } else {
        return { success: false, message: "Incorrect password" };
      }
    }
  } catch (error) {
    return { success: false, message: error };
  }
}
