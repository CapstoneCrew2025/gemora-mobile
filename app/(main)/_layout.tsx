// app/(main)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../store/useAuthStore";

export default function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return null; // This prevents any flash during auth check
  }

  // Redirect to index if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="marketplace" />
    </Stack>
  );
}
