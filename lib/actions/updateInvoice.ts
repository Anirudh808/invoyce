"use server";

import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/db";
import { invoices } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export async function updateInvoice(
  status: "pending" | "paid" | "overdue",
  id: string
) {
  const loggedIn = getServerSession(authOptions);
  const auth = await loggedIn.auth();
  if (!auth?.user) {
    return { success: false, message: "Not Authorized" };
  }
  const authUserId = auth.user.id;

  try {
    const updatedInvoice = await db
      .update(invoices)
      .set({
        status: status,
      })
      .where(
        and(eq(invoices.id, id), eq(invoices.userId, authUserId as string))
      )
      .returning();
    return { success: true, data: updatedInvoice[0] };
  } catch (error) {
    return { success: false, message: error };
  }
}
