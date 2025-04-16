import Email from "@/emails/remind";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "anirudhmounasamy@gmail.com",
        pass: "lxmu pgqy njkx djof",
      },
    });

    const htmlString = await render(Email(), {
      pretty: true,
    });

    const info = await transporter.sendMail({
      from: '"Anirudh Mounasamy" <anirudhmounasamy@gmail.com>',
      to: "anirudhmounasamy@gmail.com",
      subject: "Test",
      html: htmlString,
    });

    console.log("Email sent:", info.response);

    // Return the response after successful email sending
    return NextResponse.json({
      success: true,
      message: `Email sent: ${info.response}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error });
  }
}
