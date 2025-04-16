import { authOptions } from "@/auth";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import getServerSession from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "User not authorized" },
      { status: 401 }
    );
  }
  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id);

  const body = await req.json();

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, authUserId));
    if (existingUser[0].password) {
      if (await compare(body.oldPassword, existingUser[0].password)) {
        existingUser[0].password = await hash(body.newPassword, 10);
        await db.update(users).set({
          password: existingUser[0].password,
        });
      } else {
        return NextResponse.json(
          { success: false, message: "Password not same" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
