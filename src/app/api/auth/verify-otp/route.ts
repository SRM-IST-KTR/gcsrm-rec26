import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import ParticipantUser from "@/models/participant.model";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (
      !email ||
      typeof email !== "string" ||
      !email.trim() ||
      !otp ||
      typeof otp !== "string" ||
      !otp.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    // Establish MongoDB connection
    await connectDB();

    // Query the Otp model for a matching record
    const otpDoc = await Otp.findOne({
      email: normalizedEmail,
      otp: normalizedOtp,
    });

    if (!otpDoc) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Delete the OTP document to prevent reuse
    await Otp.deleteOne({ _id: otpDoc._id });

    // Check if a participant with this email already exists
    const existingParticipant = await ParticipantUser.findOne({
      email: normalizedEmail,
    }).lean();

    return NextResponse.json(
      {
        success: true,
        isRegistered: Boolean(existingParticipant),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to verify OTP",
      },
      { status: 500 }
    );
  }
}
