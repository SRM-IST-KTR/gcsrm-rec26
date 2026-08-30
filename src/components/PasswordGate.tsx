"use client";

import { FormEvent, useEffect, useState } from "react";

const STORAGE_KEY = "gcsrm_team_password";

async function verifyPassword(value: string): Promise<boolean> {
  try {
    const response = await fetch("/api/verify-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: value }),
    });

    const data = await response.json();
    return Boolean(data?.ok);
  } catch {
    return false;
  }
}

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const isAccessGateEnabled =
    process.env.ACCESS_GATE_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_ACCESS_GATE_ENABLED === "true";
  const [isReady, setIsReady] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isAccessGateEnabled) {
    return <>{children}</>;
  }

  useEffect(() => {
    const checkSavedPassword = async () => {
      try {
        const savedPassword = window.localStorage.getItem(STORAGE_KEY);

        if (!savedPassword) {
          setIsUnlocked(false);
          setIsReady(true);
          return;
        }

        const isValid = await verifyPassword(savedPassword);
        if (isValid) {
          setIsUnlocked(true);
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // Ignore storage access issues and fall back to the password form.
      } finally {
        setIsReady(true);
      }
    };

    checkSavedPassword();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const isValid = await verifyPassword(password);

    if (isValid) {
      try {
        window.localStorage.setItem(STORAGE_KEY, password);
      } catch {
        // Ignore storage issues and still allow access for the session.
      }

      setIsUnlocked(true);
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    setError("Incorrect password. Please try again.");
  };

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7EE] text-[#1E1B24]">
        <div className="text-sm font-medium tracking-[0.2em] text-[#1E1B24]/70 uppercase">
          Verifying access...
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827] px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1f2937] p-8 shadow-2xl shadow-black/25">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D1D5DB]">
              Team Access
            </p>
            <h1 className="mt-3 text-2xl font-bold text-white">Restricted Preview</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-[#E5E7EB]" htmlFor="team-password">
              Enter password
            </label>
            <input
              id="team-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-[#A78BFA] focus:outline-none"
            />

            {error ? (
              <p className="text-sm text-red-300">{error}</p>
            ) : (
              <p className="text-sm text-slate-400">This preview is locked for team members only.</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#8B5CF6] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
            >
              Unlock site
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
