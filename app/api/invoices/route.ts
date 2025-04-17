import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/db";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";

async function getInvoiceNumber(authUserId: string) {
  const invoices = await db
    .select()
    .from(schema.invoices)
    .where(eq(schema.invoices.userId, authUserId));

  if (invoices.length === 0) {
    return 1;
  }

  const latestInvoice = invoices.reduce(
    (acc, cur) => (cur.createdAt > acc.createdAt ? cur : acc),
    invoices[0] // Start with the first invoice as the initial accumulator
  );

  return Number(latestInvoice.invoiceNumber.toString().slice(4)) + 1;
}

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

  const formData = await req.formData();

  const clientId = formData.get("clientId") as string;
  const total = formData.get("total") as string;
  const notes = formData.get("notes") as string;
  const taxPercentage = formData.get("taxPercentage") as string;
  const taxAmount = formData.get("taxAmount") as string;

  try {
    const invoiceNumberSuffix = await getInvoiceNumber(authUserId);
    const invoiceNumber = Number(
      new Date().getFullYear().toString().concat(invoiceNumberSuffix.toString())
    );

    console.log({
      userId: authUserId,
      clientId: clientId,
      total: parseFloat(total) || 0,
      notes,
      taxPercentage: parseFloat(taxPercentage) || 0,
      taxAmount: parseFloat(taxAmount) || 0,
      invoiceNumber,
    });

    const newInvoice = await db
      .insert(schema.invoices)
      .values({
        userId: authUserId as string,
        clientId: clientId as string,
        total: total as string,
        notes: notes as string,
        taxPercentage: taxPercentage as string,
        tax_amount: taxAmount as string,
        invoiceNumber: invoiceNumber as number,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newInvoice,
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
    const invoices = await db.query.invoices.findMany({
      with: {
        client: true,
      },
      where: (invoices, { eq }) => eq(invoices.userId, authUserId),
    });

    return NextResponse.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
