import { Stack } from 'expo-router';

export default function MarketLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Marketplace',
        }}
      />
      <Stack.Screen 
        name="gemdetail" 
        options={{
          title: 'Gem Details',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
