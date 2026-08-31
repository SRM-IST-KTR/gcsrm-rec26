import { NextResponse } from "next/server";

const BACKEND_URL = "https://octacore-beta.githubsrmist.in";

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
    const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/recruitment?email=${email}`);
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 404) {
            return NextResponse.json({
                success: true,
                exists: false,
                user: null
            });
        }
        return NextResponse.json(
            { success: false, error: data.message || "Failed to fetch participant." },
            { status: response.status }
        );
    }

    return NextResponse.json({
      success: true,
      exists: true,
      user: data.participant || data.user || {},
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
    const body = await parseRequestBody(request);
    const response = await fetch(`${BACKEND_URL}/api/recruitment/apply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            { success: false, error: data.error || "Failed to register participant." },
            { status: response.status }
        );
    }

    return NextResponse.json(
      {
        success: true,
        user: data.user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to register participant.",
      },
      { status: 400 }
    );
  }
}
