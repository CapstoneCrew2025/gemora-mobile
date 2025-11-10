import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10b981', 
        tabBarInactiveTintColor: '#6b7280', 
        tabBarStyle: {
          backgroundColor: '#DFF7E2',
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }}
    >
      <Tabs.Screen 
        name="(home)" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen 
        name="(market)" 
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>📊</Text>
          ),
        }}
      />
      <Tabs.Screen 
        name="search" 
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🔍</Text>
          ),
        }}
      />
      <Tabs.Screen 
        name="history" 
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>📜</Text>
          ),
        }}
      />
      <Tabs.Screen 
        name="(profile)" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
