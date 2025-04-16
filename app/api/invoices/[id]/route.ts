import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import * as schema from "@/database/schema";
import { db } from "@/database/db";
import { and, eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getServerSession(authOptions);
  const { id } = params;

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
    if (body.dueDate) {
      body.dueDate = new Date(body.dueDate);
    }

    const updatedInvoice = await db
      .update(schema.invoices)
      .set({
        ...body,
      })
      .where(
        and(eq(schema.invoices.userId, authUserId), eq(schema.invoices.id, id))
      )
      .returning();

    return NextResponse.json({
      success: true,
      data: `Updated invoice #${updatedInvoice[0].invoiceNumber}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getServerSession(authOptions);
  const { id } = params;

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
      .delete(schema.invoices)
      .where(
        and(eq(schema.invoices.userId, authUserId), eq(schema.invoices.id, id))
      )
      .returning();

    return NextResponse.json({
      success: true,
      data: `Deleted invoice successfully`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getServerSession(authOptions);
  const { id } = params;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "User not authorized" },
      { status: 401 }
    );
  }
  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id);

  try {
    const invoice = await db.query.invoices.findFirst({
      with: {
        invoiceItems: true,
        client: true,
      },
      where: (invoices, { and, eq }) =>
        and(eq(invoices.id, id), eq(invoices.userId, authUserId)),
    });

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
