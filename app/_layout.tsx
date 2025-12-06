import { Stack } from "expo-router";
import { useEffect } from "react";
import { ThemeProvider } from "../context/ThemeContext";
import "../global.css";
import { useAuthActions } from "../store/useAuthStore";

export default function RootLayout() {
  const { initializeAuth } = useAuthActions();

  useEffect(() => {
    // Initialize auth state when app starts
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
