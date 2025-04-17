/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/db";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import { File } from "node:buffer";

async function uploadFile(file: File) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result: any = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });

  return result.secure_url;
}

export async function POST(req: NextRequest) {
  const session = getServerSession(authOptions); // Add await

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authUser = await session.auth();
  const authUserId = String(authUser?.user?.id); // Convert userId to string

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const companyName = formData.get("companyName") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const file = formData.get("profilePic") as unknown as File;

  let profilePicUrl = "";
  if (file && file.size > 0) {
    profilePicUrl = await uploadFile(file);
  }

  try {
    const newClient = await db.insert(schema.clients).values({
      name,
      email,
      phone,
      companyName,
      profilePic: profilePicUrl || "",
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
