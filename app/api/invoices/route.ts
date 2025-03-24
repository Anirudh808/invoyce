import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/db";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";

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
    const newInvoice = await db
      .insert(schema.invoices)
      .values({ ...body, userId: authUserId })
      .returning();

    return NextResponse.json({
      success: true,
      message: `Added Invoice #${newInvoice[0].invoiceNumber}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

export async function GET() {
  const session = getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "User not authorized" },
      { status: 401 }
    );
  }

  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id);

  try {
    const invoices = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.userId, authUserId));

    return NextResponse.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
