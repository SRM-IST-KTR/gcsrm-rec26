"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ParticipantData } from "@/components/ApplicationStatus/types";
import { api } from "@/lib/api";

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

  // Restore session from localStorage on initial load and fetch latest DB status in background
  useEffect(() => {
    let isMounted = true;

    const restoreAndRefreshSession = async () => {
      let cachedUser: ParticipantData | null = null;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          cachedUser = JSON.parse(stored) as ParticipantData;
          if (isMounted) {
            setParticipant(cachedUser);
          }
        }
      } catch (err) {
        console.error("Failed to restore auth session from localStorage:", err);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("gcsrm_registration_cache");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      // Background fetch to sync latest status from database
      if (cachedUser?.email) {
        try {
          const { exists, user } = await api.lookupParticipant(cachedUser.email);
          if (exists && user && isMounted) {
            const updated = { ...cachedUser, ...user };
            setParticipant(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }
        } catch (err) {
          console.error("Failed to refresh participant session from backend:", err);
        }
      }
    };

    restoreAndRefreshSession();

    return () => {
      isMounted = false;
    };
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
