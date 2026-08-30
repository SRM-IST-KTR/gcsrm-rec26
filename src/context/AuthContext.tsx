"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ParticipantData } from "@/components/ApplicationStatus/types";

interface AuthContextType {
  participant: ParticipantData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: ParticipantData) => void;
  logout: () => void;
  updateParticipant: (partialData: Partial<ParticipantData>) => void;
}

const STORAGE_KEY = "gcsrm_participant_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ParticipantData;
        setParticipant(parsed);
      }
    } catch (err) {
      console.error("Failed to restore auth session from localStorage:", err);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("gcsrm_registration_cache");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((userData: ParticipantData) => {
    setParticipant(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (err) {
      console.error("Failed to persist session to localStorage:", err);
    }
  }, []);

  const logout = useCallback(() => {
    setParticipant(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("gcsrm_registration_cache");
    } catch (err) {
      console.error("Failed to remove session from localStorage:", err);
    }
  }, []);

  const updateParticipant = useCallback((partialData: Partial<ParticipantData>) => {
    setParticipant((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partialData } as ParticipantData;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to update session in localStorage:", err);
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        participant,
        isLoggedIn: Boolean(participant),
        isLoading,
        login,
        logout,
        updateParticipant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
