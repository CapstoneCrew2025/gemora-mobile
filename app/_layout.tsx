import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";
import { useAuthActions } from "../store/useAuthStore";

export default function RootLayout() {
  const { initializeAuth } = useAuthActions();

  useEffect(() => {
    // Initialize auth state when app starts
    initializeAuth();
  }, [initializeAuth]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
