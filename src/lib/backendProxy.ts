/**
 * Server-only helpers for proxying reads to the backend.
 *
 * The backend guards its recruitment reads with the admin key
 * (`Authorization: Bearer <SERVICE_API_KEY>`). That key must never reach the
 * browser, so the client calls same-origin route handlers under `src/app/api`
 * and those attach the key here, server-side.
 */

/** Backend origin for server-side calls (mirrors the rewrites in next.config.ts). */
export const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

/** Headers carrying the admin key, or null when the key is not configured. */
export function adminHeaders(): Record<string, string> | null {
  const key = process.env.NEXT_PUBLIC_EMAIL_API_KEY?.trim();
  if (!key) return null;
  return { Accept: "application/json", Authorization: `Bearer ${key}` };
}

/**
 * GET a backend path with the admin key attached and forward the response
 * (status + JSON body) back to the caller.
 */
export async function proxyAdminGet(path: string): Promise<Response> {
  const headers = adminHeaders();
  if (!headers) {
    return Response.json(
      { success: false, message: "Server configuration error" },
      { status: 500 },
    );
  }

  try {
    const upstream = await fetch(`${BACKEND_URL}${path}`, {
      headers,
      cache: "no-store",
    });
    const body = await upstream.text();
    return new Response(body || null, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return Response.json(
      { success: false, message: "Failed to reach the backend" },
      { status: 502 },
    );
  }
}
