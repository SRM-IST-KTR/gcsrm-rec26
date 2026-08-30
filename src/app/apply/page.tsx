"use client";

import { useState } from "react";
import RegistrationForm from "@/components/RegistrationForm";
import LoginSection from "@/components/LoginSection";

export default function ApplyPage() {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#FFFEEF] text-[#1E1B24]">
      {verifiedEmail ? (
        <RegistrationForm initialEmail={verifiedEmail} />
      ) : (
        <LoginSection onProceed={setVerifiedEmail} />
      )}
    </main>
  );
}
