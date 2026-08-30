"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RegistrationForm from "@/components/RegistrationForm";
import LoginSection from "@/components/LoginSection";

export default function ApplyPage() {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, isLoading, router]);

  if (!isLoading && isLoggedIn) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FFFEEF] text-[#1E1B24]">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        {verifiedEmail ? (
          <RegistrationForm initialEmail={verifiedEmail} />
        ) : (
          <LoginSection onProceed={setVerifiedEmail} />
        )}
      </Suspense>
    </main>
  );
}
