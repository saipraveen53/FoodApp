import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rootApi } from './axiosInstance';
import NavBar from './components/NavBar';

const ProfilePage = () => {
  const [user, setUser] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await rootApi.get('user/myProfile');
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);

  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF8A00&color=fff&size=150&bold=true&font-size=0.5`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <NavBar activeScreen="Profile" />
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>
        
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: getAvatarUrl(user.name || 'User') }}
            style={styles.avatar}
          />
        </View>
        
        <View style={styles.profileCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.platformContainer}>
          <Text style={styles.platformText}>Platform: {Platform.OS}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    padding: Platform.OS === 'web' ? 40 : 20,
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
    alignSelf: Platform.OS === 'web' ? 'center' : 'flex-start',
    width: Platform.OS === 'web' ? '60%' : '100%',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: 'bold',
    color: '#FF8A00',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF8A00',
  },
  profileCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: Platform.OS === 'web' ? 30 : 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'web' ? 12 : 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  label: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '600',
    color: '#FF8A00',
    width: Platform.OS === 'web' ? 80 : 60,
  },
  value: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#e0e0e0',
    flex: 1,
    textAlign: 'right',
  },
  platformContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  platformText: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#888',
    fontWeight: '500',
  },
});

export default ProfilePage;