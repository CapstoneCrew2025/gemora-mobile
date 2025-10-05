import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          headerShown: false // Hide header since you have custom styling
        }} 
      />
      <Stack.Screen 
        name="category" 
        options={{ 
          title: 'Categories',
          headerShown: false // Hide header since you have custom back button
        }} 
      />
      <Stack.Screen 
        name="product" 
        options={{ 
          title: 'Products',
          headerShown: false // Hide header since you have custom back button
        }} 
      />
    </Stack>
  );
}