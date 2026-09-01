/**
 * Centralized REST client for the backend.
 *
 * Base URL resolution:
 * - `NEXT_PUBLIC_API_URL` set → absolute URLs, backend CORS handles cross-origin.
 * - `NEXT_PUBLIC_API_URL` empty (default in dev) → same-origin relative paths;
 *   Next.js rewrites forward `/api/otp/*`, `/api/email/*`, `/api/recruitment/*`
 *   to the backend, avoiding CORS during development.
 *
 * The backend is cookie-free for these endpoints, so `credentials` is not sent;
 * every request is a JSON POST with `Content-Type: application/json`. If auth
 * tokens are ever needed, add a single header interceptor inside `request`.
 */

import type { ParticipantData } from "@/components/ApplicationStatus/types";
import { getOtpEmailHtml } from "@/lib/emailTemplate";

// ── OTP shapes ────────────────────────────────────────────────────────────

export interface OtpSendSuccess {
  success: true;
  message: string;
  expiresInSeconds: number;
}

export interface OtpRateLimited {
  success: false;
  message: string;
  retryAfterSeconds: number;
}

export interface OtpVerifySuccess {
  success: true;
  message: string;
  /** JWT proving this email passed OTP verification. */
  token: string;
  expiresInSeconds?: number;
}

// ── Error shapes ──────────────────────────────────────────────────────────

export interface ApiFieldError {
  param?: string;
  msg?: string;
  field?: string;
  message?: string;
}

export interface ApiFailure {
  success: false;
  message?: string;
  /** Backend may return `error` instead of `message` (e.g. apply endpoints). */
  error?: string;
  errors?: ApiFieldError[];
}

export type ApiErrorBody = ApiFailure | OtpRateLimited;

/** Error thrown for network failure or any non-2xx / `success:false` response. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || (body as ApiFailure).error || `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  /** Backend `error` field when present (some endpoints return `error` instead of `message`). */
  get error(): string | undefined {
    return "error" in this.body ? (this.body as ApiFailure).error : undefined;
  }

  /** Convenience accessor for 429 rate-limit retry-after value. */
  get retryAfterSeconds(): number | undefined {
    return "retryAfterSeconds" in this.body ? this.body.retryAfterSeconds : undefined;
  }
}

// ── Participant shapes (backend → frontend mapping) ───────────────────────

/**
 * Backend response shape from `GET /api/recruitment/email/:email`.
 */
export interface BackendParticipantLookupResponse {
  success: boolean;
  verified: boolean;
  message?: string;
  data: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    registrationNumber?: string;
    regNo?: string;
    phone?: string;
    year?: string;
    domain?: string;
    degreeWithBranch?: string;
    dept?: string;
    status?: string;
    links?: {
      github?: string | null;
      demo?: string | null;
      deployment?: string | null;
    };
    createdAt?: string;
  } | null;
}

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, "");

/** Headers shared by every backend call. */
function jsonHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };
}

async function post<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { ...jsonHeaders() },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(0, {
      success: false,
      message: "Network error. Please check your connection and try again.",
    });
  }

  const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  const isError =
    !response.ok ||
    (data !== null && typeof data === "object" && data.success === false);

  if (isError) {
    throw new ApiError(
      response.status,
      (data as unknown as ApiErrorBody) ?? {
        success: false,
        message: `Request failed with status ${response.status}`,
      },
    );
  }

  return data as T;
}

// ── Mappers ───────────────────────────────────────────────────────────────

function mapBackendLookup(data: any): ParticipantData {
  const source = data || {};
  return {
    _id: source._id || source.id,
    name: source.name || "",
    email: source.email || "",
    registrationNumber: source.registrationNumber || source.regNo || "",
    phone: source.phone || "",
    year: source.year || "",
    domain: source.domain || "",
    degreeWithBranch: source.degreeWithBranch || source.dept || "",
    links: source.links,
    status: (source.status || "registered") as ParticipantData["status"],
    createdAt: source.createdAt,
  };
}

function extractApplyUser(data: Record<string, unknown> | null): Record<string, unknown> {
  if (data !== null && typeof data === "object") {
    if ("user" in data && data.user && typeof data.user === "object") {
      return data.user as Record<string, unknown>;
    }
    if ("data" in data && data.data && typeof data.data === "object") {
      return data.data as Record<string, unknown>;
    }
    if ("participant" in data && data.participant && typeof data.participant === "object") {
      return data.participant as Record<string, unknown>;
    }
    return data;
  }
  throw new ApiError(0, {
    success: false,
    message: "Unexpected response from server.",
  });
}

function mapBackendApplyUser(user: any): ParticipantData {
  return {
    _id: user.id || user._id,
    name: user.name || "",
    email: user.email || "",
    registrationNumber: user.registrationNumber || user.regNo || "",
    domain: user.domain || "",
    year: user.year || "",
    phone: user.phone || "",
    degreeWithBranch: user.degreeWithBranch || user.dept || "",
    status: (user.status || "registered") as ParticipantData["status"],
    createdAt: user.createdAt,
  };
}

// ── Public API ────────────────────────────────────────────────────────────

export const api = {
  /** POST /api/otp/send — throws ApiError on failure (429 carries retryAfterSeconds). */
  sendOtp(email: string) {
    const emailTemplate = getOtpEmailHtml({ otpCode: "{{otp}}" });
    return post<OtpSendSuccess>("/api/otp/send", {
      email,
      emailTemplate,
      subject: "Your GCSRM Login OTP",
    });
  },

  /** POST /api/otp/verify — throws ApiError on failure; returns the verified-session JWT. */
  verifyOtp(email: string, otp: string) {
    return post<OtpVerifySuccess>("/api/otp/verify", { email, otp });
  },

  /**
   * Look up a participant by email via the backend `GET /api/recruitment/email/:email`.
   * Backend response shape:
   * `{ success: true, verified: boolean, message: string, data: ParticipantObject | null }`
   *
   * If verified is true and data exists -> `{ exists: true, user: mapBackendLookup(data) }`.
   * If verified is false or data is null (or 404) -> `{ exists: false, user: null }`.
   */
  async lookupParticipant(email: string): Promise<{ exists: boolean; user: ParticipantData | null }> {
    const url = `${BASE_URL}/api/recruitment/email/${encodeURIComponent(email)}`;
    let response: Response;
    try {
      response = await fetch(url, { headers: { ...jsonHeaders() } });
    } catch {
      throw new ApiError(0, {
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
    }

    // 404 means the email is not registered yet
    if (response.status === 404) {
      return { exists: false, user: null };
    }

    const json = (await response.json().catch(() => null)) as
      | BackendParticipantLookupResponse
      | Record<string, unknown>
      | null;

    const isError =
      !response.ok ||
      (json !== null && typeof json === "object" && json.success === false);

    if (isError) {
      throw new ApiError(
        response.status,
        (json as unknown as ApiErrorBody) ?? {
          success: false,
          message: `Request failed with status ${response.status}`,
        },
      );
    }

    if (json && typeof json === "object") {
      const isVerified = (json as any).verified === true;
      const data = (json as any).data;

      if (isVerified && data) {
        return { exists: true, user: mapBackendLookup(data) };
      }
    }

    return { exists: false, user: null };
  },

  /**
   * Register a new participant via `POST /api/recruitment/apply`.
   * Requires the OTP-verified JWT (Bearer token) to prove email ownership.
   * Throws ApiError on failure; the body contains `error` and optionally `errors`.
   */
  async applyForRecruitment(
    token: string,
    payload: {
      name: string;
      email: string;
      registrationNumber: string;
      phone: string;
      year: string;
      domain: string;
      degreeWithBranch: string;
      links?: { github?: string | null; demo?: string | null; deployment?: string | null };
      submissionTime?: string;
    },
  ): Promise<{ user: ParticipantData }> {
    let response: Response;
    try {
      response = await fetch(`${BASE_URL}/api/recruitment/apply`, {
        method: "POST",
        headers: {
          ...jsonHeaders(),
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new ApiError(0, {
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
    }

    const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    const isError =
      !response.ok ||
      (data !== null && typeof data === "object" && data.success === false);

    if (isError) {
      throw new ApiError(
        response.status,
        (data as unknown as ApiErrorBody) ?? {
          success: false,
          message: `Request failed with status ${response.status}`,
        },
      );
    }

    return { user: mapBackendApplyUser(extractApplyUser(data)) };
  },
};