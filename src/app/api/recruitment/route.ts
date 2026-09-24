import { proxyAdminGet } from "@/lib/backendProxy";

export const dynamic = "force-dynamic";

/**
 * Same-origin proxy for `GET /api/recruitment?email=...` (participant tasks).
 *
 * The backend guards this read with the admin key, so the browser calls this
 * route instead and the key is attached server-side. The query string is
 * forwarded verbatim so the backend's `?email=` branch is preserved.
 */
export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyAdminGet(`/api/recruitment${search}`);
}
