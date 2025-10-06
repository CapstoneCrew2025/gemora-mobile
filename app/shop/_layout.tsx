import { Stack } from 'expo-router';
import React from 'react';

export default function ShopLayout() {
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
        name="products" 
        options={{
          title: 'Products',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="categories" 
        options={{
          title: 'Categories',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
