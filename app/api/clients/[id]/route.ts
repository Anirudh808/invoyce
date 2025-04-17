import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import * as schema from "@/database/schema";
import { db } from "@/database/db";
import { and, eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "User not authorized" },
      { status: 401 }
    );
  }
  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id);

  try {
    const body = await req.json(); // Read request body

    const updatedClient = await db
      .update(schema.clients)
      .set({
        ...body,
      })
      .where(
        and(eq(schema.clients.userId, authUserId), eq(schema.clients.id, id))
      )
      .returning();

    return NextResponse.json({
      success: true,
      data: `Updated client ${updatedClient[0].name}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "User not authorized" },
      { status: 401 }
    );
  }
  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id);

  try {
    await db
      .delete(schema.clients)
      .where(
        and(eq(schema.clients.userId, authUserId), eq(schema.clients.id, id))
      )
      .returning();

    return NextResponse.json({
      success: true,
      data: `Deleted client successfully.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "User not authorized" },
      { status: 401 }
    );
  }
  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id);

  try {
    const client = await db.query.clients.findFirst({
      with: {
        invoices: true,
      },
      where: (clients, { and, eq }) =>
        and(eq(clients.id, id), eq(clients.userId, authUserId)),
    });

    if (client !== undefined) {
      return NextResponse.json({
        success: true,
        data: client,
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
