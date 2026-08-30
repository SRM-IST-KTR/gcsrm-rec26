import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ParticipantUser from "@/models/participant.model";

async function parseRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const jsonBody = await request.json();
    return {
      ...jsonBody,
      links: jsonBody?.links || {},
    };
  }

  const formData = await request.formData();
  const links = {
    github: formData.get("links.github")?.toString().trim() || null,
    demo: formData.get("links.demo")?.toString().trim() || null,
    deployment: formData.get("links.deployment")?.toString().trim() || null,
  };

  return {
    name: formData.get("name")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    registrationNumber: formData.get("registrationNumber")?.toString().trim() || "",
    phone: formData.get("phone")?.toString().trim() || "",
    year: formData.get("year")?.toString().trim() || "",
    domain: formData.get("domain")?.toString().trim() || "",
    degreeWithBranch: formData.get("degreeWithBranch")?.toString().trim() || "",
    links,
  };
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const participant = await ParticipantUser.findOne({ email }).lean();
    return NextResponse.json({
      success: true,
      exists: Boolean(participant),
      user: participant || null,
    });
  } catch (error: any) {
    console.error("Participant lookup error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to verify email." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await parseRequestBody(request);
    const now = new Date();
    const startDate = new Date(2026, 7, 25, 0, 0, 0);
    const endDate = new Date(2026, 9, 11, 23, 59, 59);

    if (now.getTime() < startDate.getTime()) {
      return NextResponse.json(
        {
          success: false,
          error: "Registration has not started yet. Please wait until August 25, 2026.",
        },
        { status: 403 }
      );
    }

    if (now.getTime() > endDate.getTime()) {
      return NextResponse.json(
        {
          success: false,
          error: "Registration period has ended. No new registrations are being accepted.",
        },
        { status: 403 }
      );
    }

    if (body.submissionTime) {
      const submissionTime = new Date(body.submissionTime);
      if (submissionTime.getTime() > endDate.getTime()) {
        return NextResponse.json(
          {
            success: false,
            error: "Registration period has ended. Submission timestamp is invalid.",
          },
          { status: 403 }
        );
      }
    }

    const {
      submissionTime,
      name,
      email,
      registrationNumber,
      phone,
      year,
      domain,
      degreeWithBranch,
      ...rest
    } = body;

    const links = body.links || {};
    const { github, demo, deployment } = links;

    if (
      !name ||
      !email ||
      !registrationNumber ||
      !phone ||
      !year ||
      !domain ||
      !degreeWithBranch
    ) {
      return NextResponse.json(
        { success: false, error: "All required fields are required." },
        { status: 400 }
      );
    }

    const existingUser = await ParticipantUser.findOne({
      $or: [{ email }, { registrationNumber }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: existingUser.email === email
            ? "This email address is already registered."
            : "This registration number is already registered.",
        },
        { status: 400 }
      );
    }

    const participant = await ParticipantUser.create({
      name,
      email,
      registrationNumber,
      phone,
      year,
      domain,
      degreeWithBranch,
      links: {
        github: github || null,
        demo: demo || null,
        deployment: deployment || null,
      },
      status: "registered",
      ...rest,
    });

    return NextResponse.json(
      {
        success: true,
        user: participant,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error?.code === 11000) {
      const message = error.message || "";

      if (message.includes("regNo_1") || message.includes("registrationNumber")) {
        return NextResponse.json(
          { success: false, error: "This registration number is already registered." },
          { status: 400 }
        );
      }

      if (message.includes("email")) {
        return NextResponse.json(
          { success: false, error: "This email address is already registered." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to register participant.",
      },
      { status: 400 }
    );
  }
}