import { proxyAdminGet } from "@/lib/backendProxy";

export const dynamic = "force-dynamic";

/**
 * Same-origin proxy for `GET /api/recruitment/email/:email`.
 *
 * The backend guards this read with the admin key, so the browser calls this
 * route instead and the key is attached server-side.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ email: string }> },
) {
  const { email } = await params;
  return proxyAdminGet(`/api/recruitment/email/${encodeURIComponent(email)}`);
}
