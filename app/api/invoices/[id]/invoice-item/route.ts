import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/db";
import { invoiceDetails } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export async function POST(
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
    const formData = await req.formData();
    const description = formData.get("description") as string;
    const unitPrice = formData.get("unitPrice") as string;
    const quantity = formData.get("quantity") as string;
    const subTotal = formData.get("subTotal") as string;
    const newInvoiceItem = await db
      .insert(invoiceDetails)
      .values({
        description,
        unitPrice: parseFloat(unitPrice),
        quantity: parseInt(quantity),
        subTotal: parseFloat(subTotal),
        userId: authUserId,
        invoiceId: id,
      });
    return NextResponse.json({ success: true, data: newInvoiceItem });
  } catch (error) {
    return NextResponse.json({ success: false, error });
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
