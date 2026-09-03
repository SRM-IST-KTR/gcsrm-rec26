/**
 * OTP-verified session persistence.
 *
 * After OTP verification the backend returns a JWT proving the email was
 * verified. We keep it (plus the email and expiry) in localStorage so the
 * user does not have to re-verify OTP on every visit. The token is sent as
 * `Authorization: Bearer <jwt>` when submitting the registration form so the
 * backend can reject unverified/spam submissions.
 */

const SESSION_KEY = "gcsrm_otp_session";

export interface OtpSession {
  token: string;
  email: string;
  expiresAt: number; // epoch ms
}

export function saveOtpSession(session: OtpSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error("Failed to persist OTP session:", err);
  }
}

/** Returns the stored session, or null when absent / expired / malformed. */
export function getOtpSession(): OtpSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as OtpSession;
    if (
      typeof parsed?.token !== "string" ||
      typeof parsed?.email !== "string" ||
      typeof parsed?.expiresAt !== "number" ||
      parsed.expiresAt <= Date.now()
    ) {
      clearOtpSession();
      return null;
    }
    return parsed;
  } catch {
    clearOtpSession();
    return null;
  }
}

export function clearOtpSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore storage access errors
  }
}