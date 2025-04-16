/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/database/db";
import { usersBusiness } from "@/database/schema";
import { v2 as cloudinary } from "cloudinary";

export async function uploadFile(file: File) {
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

  const doorNo = formData.get("doorNo");
  const street = formData.get("street");
  const city = formData.get("city");
  const state = formData.get("state");
  const zipcode = formData.get("zipcode");
  const country = formData.get("country");
  const businessUrl = formData.get("businessUrl");
  const businessName = formData.get("businessName");
  const profilePic = formData.get("profilePic") as unknown as File;
  const businessLogo = formData.get("businessLogo") as unknown as File;
  const currency = formData.get("currency");
  const phone = formData.get("phone");

  let profilePicUrl = "";
  if (profilePic && profilePic.size > 0) {
    profilePicUrl = await uploadFile(profilePic);
  }

  let businessLogoUrl = "";
  if (businessLogo && businessLogo.size > 0) {
    businessLogoUrl = await uploadFile(businessLogo);
  }

  try {
    const newUserData = await db.insert(usersBusiness).values({
      userId: authUserId,
      doorNo,
      street,
      city,
      state,
      zipcode,
      country,
      businessUrl,
      profilePic: profilePicUrl,
      businessLogo: businessLogoUrl,
      currency,
      phone,
      businessName,
    });

    return NextResponse.json({ success: true, data: newUserData });
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
    const userData = await db.query.users.findFirst({
      with: {
        usersBusiness: true,
      },
      where: (users, { eq }) => eq(users.id, authUserId),
    });

    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
