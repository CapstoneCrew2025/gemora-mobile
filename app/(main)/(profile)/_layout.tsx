import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen 
        name="myads" 
        options={{
          title: 'My Ads',
          presentation: 'card',
        }}
      />
      <Stack.Screen 
        name="editgem" 
        options={{
          title: 'Edit Gem',
          presentation: 'card',
          headerShown: true,
        }}
      />
    </Stack>
  );
}