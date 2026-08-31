/**
 * Centralized REST client for the backend.
 *
 * Base URL resolution:
 * - `NEXT_PUBLIC_API_URL` set → absolute URLs, backend CORS handles cross-origin.
 * - `NEXT_PUBLIC_API_URL` empty (default in dev) → same-origin relative paths;
 *   Next.js rewrites forward `/api/otp/*`, `/api/email/*`, `/api/recruitment/*`
 *   to the backend, avoiding CORS during development.
 */

import type { ParticipantData } from "@/components/ApplicationStatus/types";

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
 * Response from `GET /api/recruitment?email=` (getParticipantTasks).
 * Fields differ from the frontend ParticipantData shape.
 */
interface BackendParticipantLookup {
  success: true;
  name: string;
  regNo: string;
  email: string;
  year: string;
  dept: string;
  phone: string;
  domain: string;
  status: string;
}

/**
 * User payload returned by `POST /api/recruitment/apply` on success.
 * Uses `id` instead of `_id`, and no `links`/`phone`/`degreeWithBranch`.
 */
interface BackendApplyUser {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  domain: string;
  year: string;
  status: string;
  createdAt: string;
}

// ── Transport ─────────────────────────────────────────────────────────────

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, "");

async function post<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

function mapBackendLookup(raw: BackendParticipantLookup): ParticipantData {
  return {
    name: raw.name,
    email: raw.email,
    registrationNumber: raw.regNo,
    phone: raw.phone,
    year: raw.year,
    domain: raw.domain,
    degreeWithBranch: raw.dept,
    status: raw.status as ParticipantData["status"],
  };
}

function mapBackendApplyUser(user: BackendApplyUser): ParticipantData {
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    registrationNumber: user.registrationNumber,
    domain: user.domain,
    year: user.year,
    status: user.status as ParticipantData["status"],
    createdAt: user.createdAt,
  };
}

// ── Public API ────────────────────────────────────────────────────────────

export const api = {
  /** POST /api/otp/send — throws ApiError on failure (429 carries retryAfterSeconds). */
  sendOtp(email: string) {
    return post<OtpSendSuccess>("/api/otp/send", { email });
  },

  /** POST /api/otp/verify — throws ApiError on failure. */
  verifyOtp(email: string, otp: string) {
    return post<OtpVerifySuccess>("/api/otp/verify", { email, otp });
  },

  /**
   * Look up a participant by email via the backend `GET /api/recruitment?email=`.
   * If the participant is found (200) → `{ exists: true, user }`.
   * If not found (404) → `{ exists: false, user: null }`.
   * Network / unexpected status → throws ApiError.
   */
  async lookupParticipant(email: string): Promise<{ exists: boolean; user: ParticipantData | null }> {
    const url = `${BASE_URL}/api/recruitment?email=${encodeURIComponent(email)}`;
    let response: Response;
    try {
      response = await fetch(url, { headers: { "Content-Type": "application/json" } });
    } catch {
      throw new ApiError(0, {
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
    }

    // 404 means the email is not registered yet — not an error.
    if (response.status === 404) {
      return { exists: false, user: null };
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

    return { exists: true, user: mapBackendLookup(data as unknown as BackendParticipantLookup) };
  },

  /**
   * Register a new participant via `POST /api/recruitment/apply`.
   * Throws ApiError on failure; the body contains `error` and optionally `errors`.
   */
  async applyForRecruitment(payload: {
    name: string;
    email: string;
    registrationNumber: string;
    phone: string;
    year: string;
    domain: string;
    degreeWithBranch: string;
    links?: { github?: string | null; demo?: string | null; deployment?: string | null };
    submissionTime?: string;
  }): Promise<{ user: ParticipantData }> {
    const data = await post<{ success: true; message: string; user: BackendApplyUser }>(
      "/api/recruitment/apply",
      payload as unknown as Record<string, unknown>,
    );
    return { user: mapBackendApplyUser(data.user) };
  },
};