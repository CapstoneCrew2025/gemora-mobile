import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Text } from "react-native";
import { useAuth } from "../../store/useAuthStore";

export default function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirectedRef = useRef(false);

  // Handle redirect when not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      // Use setTimeout to avoid state update during render
      setTimeout(() => {
        router.replace('/');
      }, 0);
    }
    
    // Reset the flag when authenticated again
    if (isAuthenticated) {
      hasRedirectedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  // Show loading while checking auth
  if (isLoading) {
    return null;
  }

  // Don't render tabs if not authenticated
  if (!isAuthenticated) {
    return null;
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
        name="(inbox)" 
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>💬</Text>
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
        name="inbox" 
        options={{
          href: null,
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
