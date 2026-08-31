import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Generate a secure, random 6-digit numeric string
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Establish MongoDB connection using the existing database connection utility
    await connectDB();

    // Save the new OTP to the database using the new Otp model
    await Otp.deleteMany({ email: normalizedEmail });
    await Otp.create({
      email: normalizedEmail,
      otp,
    });

    // Dispatch the OTP email
    await sendOtpEmail(normalizedEmail, otp);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to send OTP",
      },
      { status: 500 }
    );
  }
}
