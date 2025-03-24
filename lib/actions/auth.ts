"use server";

import { signIn } from "@/auth";
import { db } from "@/database/db";
import { CreateOrUpdateUser, users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

export const signInWithCredentials = async (
  params: Pick<CreateOrUpdateUser, "email" | "password">
) => {
  const { email, password } = params;

  // const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // const { success } = await ratelimit.limit(ip);

  // if (!success) redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, message: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error, "Signin error");
    return { success: false, message: "Signin error" };
  }
};

export const signUp = async (params: CreateOrUpdateUser) => {
  const { name, email, password } = params;

  // const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // const { success } = await ratelimit.limit(ip);

  // if (!success) redirect("/too-fast");

  // Check if the user already exists.
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, message: "User already exists" };
  }

  const hashedPassword = await hash(password as string, 10);

  try {
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Signup error." };
  }
};
