import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3b82f6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Home',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="category/index" 
        options={{
          title: 'Categories',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="product/index" 
        options={{
          title: 'Products',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
