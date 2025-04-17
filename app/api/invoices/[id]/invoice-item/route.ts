import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/db";
import { CreateOrUpdateInvoiceItems, invoiceDetails } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export async function POST(
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
    const formData = await req.formData();

    const description = formData.get("description") as string;
    const unitPrice = parseFloat(formData.get("unitPrice") as string);
    const quantity = parseInt(formData.get("quantity") as string);
    const subTotal = parseFloat(formData.get("subTotal") as string);

    const newInvoiceItem: CreateOrUpdateInvoiceItems = {
      // Use the inferred type
      unitPrice: unitPrice.toString(), // Ensure it's a string for numeric type
      description,
      quantity,
      subTotal: subTotal.toString(), // Ensure it's a string for numeric type
      userId: authUserId,
      invoiceId: id,
    };

    const insertedItem = await db
      .insert(invoiceDetails)
      .values(newInvoiceItem)
      .returning(); // Consider using returning()

    return NextResponse.json({ success: true, data: insertedItem });
  } catch (error) {
    return NextResponse.json({ success: false, error });
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
    const invoiceItems = await db
      .select()
      .from(invoiceDetails)
      .where(
        and(
          eq(invoiceDetails.userId, authUserId),
          eq(invoiceDetails.invoiceId, id)
        )
      );
    return NextResponse.json({ success: true, data: invoiceItems });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
