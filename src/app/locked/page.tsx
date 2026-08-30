"use client";

import { FormEvent, useEffect, useState } from "react";

const STORAGE_KEY = "gcsrm_team_password";
const COOKIE_NAME = "gcsrm_team_password";

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

export default function LockedPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStoredPassword = async () => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setIsChecking(false);
        return;
      }

      const isValid = await verifyPassword(saved);
      if (isValid) {
        window.location.href = "/";
        return;
      }

      window.localStorage.removeItem(STORAGE_KEY);
      setIsChecking(false);
    };

    checkStoredPassword();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const isValid = await verifyPassword(password);
    if (!isValid) {
      window.localStorage.removeItem(STORAGE_KEY);
      setError("Incorrect password. Please try again.");
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, password);
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(password)}; path=/; max-age=86400; SameSite=Lax`;
    window.location.href = "/";
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827] px-4 text-white">
        <div className="text-sm font-medium uppercase tracking-[0.3em] text-slate-300">
          Verifying access...
        </div>
      </div>
    );
  }

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
