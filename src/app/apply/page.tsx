"use client";

import { useState } from "react";
import RegistrationForm from "@/components/RegistrationForm";
import RegisterSection from "@/components/RegisterSection";

export default function ApplyPage() {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#FFFEEF] text-[#1E1B24]">
      {verifiedEmail ? (
        <RegistrationForm initialEmail={verifiedEmail} />
      ) : (
        <RegisterSection onProceed={setVerifiedEmail} />
      )}
    </main>
  );
}
