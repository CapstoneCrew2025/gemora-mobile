import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
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
      <RootStack />
    </ThemeProvider>
  );
}

function RootStack() {
  const { theme } = useTheme();
  const barStyle = theme.mode === 'dark' ? 'light' : 'dark';

  return (
    <>
      <StatusBar style={barStyle} backgroundColor={theme.colors.header} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
