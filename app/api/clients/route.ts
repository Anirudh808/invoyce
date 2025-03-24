import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/db";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = getServerSession(authOptions); // Add await

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id); // Convert userId to string

  const body = await req.json();
  const { name, email, profilePic, companyName, address, phone } = body;

  try {
    const newClient = await db.insert(schema.clients).values({
      name,
      email,
      phone,
      companyName,
      profilePic: profilePic || "",
      address,
      userId: authUserId,
    });

    console.log(newClient);
    return NextResponse.json({
      success: true,
      message: `Added client ${name}`,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "User not authorized" },
      { status: 401 }
    );
  }

  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id);

  try {
    const clients = await db
      .select()
      .from(schema.clients)
      .where(eq(schema.clients.userId, authUserId));
    return NextResponse.json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
