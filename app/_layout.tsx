import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3b82f6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <Text style={{ 
              fontSize: 24, 
              opacity: focused ? 1 : 0.4 
            }}>
              🏠
            </Text>
          ),
          tabBarLabel: 'Home',
        }} 
      />
      <Tabs.Screen 
        name="cart/index" 
        options={{
          title: 'Shopping Cart',
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'relative' }}>
              <Text style={{ 
                fontSize: 24, 
                opacity: focused ? 1 : 0.4 
              }}>
                🛒
              </Text>
              <View style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: '#ef4444',
                borderRadius: 8,
                width: 16,
                height: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ 
                  color: 'white', 
                  fontSize: 10, 
                  fontWeight: 'bold' 
                }}>
                  3
                </Text>
              </View>
            </View>
          ),
          tabBarLabel: 'Cart',
        }} 
      />
      <Tabs.Screen 
        name="alerts/index" 
        options={{
          title: 'Notifications',
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'relative' }}>
              <Text style={{ 
                fontSize: 24, 
                opacity: focused ? 1 : 0.4 
              }}>
                🔔
              </Text>
              <View style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: '#ef4444',
                borderRadius: 8,
                width: 16,
                height: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ 
                  color: 'white', 
                  fontSize: 10, 
                  fontWeight: 'bold' 
                }}>
                  5
                </Text>
              </View>
            </View>
          ),
          tabBarLabel: 'Alerts',
        }} 
      />
      <Tabs.Screen 
        name="profile/index" 
        options={{
          title: 'My Profile',
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <Text style={{ 
              fontSize: 24, 
              opacity: focused ? 1 : 0.4 
            }}>
              👤
            </Text>
          ),
          tabBarLabel: 'Profile',
        }} 
      />
      <Tabs.Screen 
        name="shop" 
        options={{
          title: 'Shop',
          headerShown: false,
          href: null, // Hide from tab bar but keep accessible via navigation
        }} 
      />
      <Tabs.Screen 
        name="category/index" 
        options={{
          title: 'Categories',
          headerShown: true,
          href: null, 
        }} 
      />
      <Tabs.Screen 
        name="product/index" 
        options={{
          title: 'Products',
          headerShown: true,
          href: null, 
        }} 
      />
    </Tabs>
  );
}
