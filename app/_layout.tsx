import { Stack } from 'expo-router';
import React from 'react';
import 'setimmediate';
import { AuthProvider } from './FoodApp/FoodContext';

export default function RootLayout() {
  return (
    <AuthProvider>
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
        <Stack.Screen
          name="FoodApp/Login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FoodApp/Register"
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="FoodApp/Cart"
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="FoodApp/PaymentStatus"
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="FoodApp/ProfilePage"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FoodApp/OderHistory"
          options={{ headerShown: false }}
        />
        
        {/* NEW ADMIN DASHBOARD SCREEN */}
        <Stack.Screen
          name="FoodApp/AdminDashboard"
          options={{ headerShown: false }}
        />
        
      </Stack>
    </AuthProvider>
  );
}