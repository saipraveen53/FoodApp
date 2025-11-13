import { Stack } from 'expo-router';
import React from 'react';
import 'setimmediate';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal',
          title: 'Modal Page' 
        }} 
      />
      <Stack.Screen 
        name="FoodApp/AllItems" 
        options={{ 
          headerShown: false,
          title: 'Menu Items', 
        }} 
      />

      {/* --- ADD THESE LINES --- */}
      <Stack.Screen
        name="FoodApp/Login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FoodApp/Register"
        options={{ headerShown: false }}
      />
      {/* ------------------------- */}

    </Stack>
  );
}