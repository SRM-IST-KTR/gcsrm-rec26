"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RegistrationForm from "@/components/RegistrationForm";
import EmailOtpForm from "@/components/EmailOtpForm";
import { api, ApiError } from "@/lib/api";
import { getOtpSession, clearOtpSession } from "@/lib/otpSession";

export default function ApplyPage() {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const verifiedRef = useRef<string | null>(null);
  const restoredRef = useRef(false);
  const { isLoggedIn, isLoading, login } = useAuth();
  const router = useRouter();

  // Redirect already-logged-in users, and restore an OTP-verified session.
  useEffect(() => {
    if (isLoading) return;
    if (isLoggedIn) {
      router.replace("/");
      return;
    }
    if (!restoredRef.current) {
      restoredRef.current = true;
      const session = getOtpSession();
      if (session?.email) {
        handleVerified(session.email);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isLoggedIn]);

  const handleVerified = useCallback(
    async (email: string) => {
      verifiedRef.current = email;
      setLookupError(null);
      try {
        const { exists, user } = await api.lookupParticipant(email);

        // Existing user → login and redirect home
        if (exists && user) {
          // Clear the OTP session since the user is now fully logged in.
          clearOtpSession();
          login(user);
          router.push("/");
          return;
        }

        // New user → proceed to registration
        setVerifiedEmail(email);
      } catch (err) {
        setLookupError(
          err instanceof ApiError
            ? err.message
            : "Unable to verify your account. Please try again.",
        );
      }
    },
    [login, router],
  );

  const handleRetry = useCallback(() => {
    if (verifiedRef.current) {
      handleVerified(verifiedRef.current);
    }
  }, [handleVerified]);

  if (!isLoading && isLoggedIn) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FFFEEF] text-[#1E1B24]">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        {verifiedEmail ? (
          <RegistrationForm initialEmail={verifiedEmail} />
        ) : (
          <EmailOtpForm
            onVerified={handleVerified}
            externalError={lookupError}
            onRetry={handleRetry}
          />
        )}
      </Suspense>
    </main>
  );
}