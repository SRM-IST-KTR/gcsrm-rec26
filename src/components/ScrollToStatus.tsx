"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ScrollToStatus() {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      const el = document.getElementById("status");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoggedIn, isLoading]);

  return null;
}
