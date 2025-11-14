import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import NavBar from './components/NavBar';
import { useAuth } from './FoodContext';

const { width } = Dimensions.get('window');

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://192.168.0.217:8080/auth/login',
        {
          email: username,
          password: password,
        }
      );

      if (!response.data || typeof response.data !== 'string') {
        throw new Error('Token not found in response');
      }

      const token = response.data;
      await AsyncStorage.setItem('userToken', token);

      try {
        const decodedPayload = jwtDecode(token);

        console.log('Decoded Token Payload:', decodedPayload);

        for (const key in decodedPayload) {
          if (Object.prototype.hasOwnProperty.call(decodedPayload, key)) {
            const value = String(decodedPayload[key]);
            await AsyncStorage.setItem(key, value);
          }
        }
      } catch (decodeError) {
        console.error('Failed to decode or store token parts:', decodeError);
      }

      setLoading(false);
      await login();
      router.push('/');

    } catch (error) {
      setLoading(false);
      console.error('Login Failed:', error);

      Alert.alert(
        'Login Failed',
        'Invalid username or password. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavBar activeScreen="Login" />
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>FoodApp</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              accessibilityLabel="Username input"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              accessibilityLabel="Password input"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.7}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>LOGIN</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.copyrightText}>©2025 FoodApp</Text>
        </View>

        {Platform.OS === 'web' && (
          <View style={styles.rightSection}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: 'https://i.ibb.co/tFnkCN8/Screenshot-2025-11-13-102250.png',
                }}
                style={styles.foodImage}
                resizeMode="cover"
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...Platform.select({
      default: {
        backgroundColor: '#1a1a1a',
      },
      web: {
        backgroundColor: '#ffffff',
      },
    }),
  },
  contentContainer: {
    flex: 1,
    ...Platform.select({
      default: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      web: {
        flexDirection: 'row',
      },
    }),
  },
  leftSection: {
    ...Platform.select({
      web: {
        flex: 0.45,
        justifyContent: 'space-between',
        padding: width * 0.05,
        paddingTop: width * 0.08,
        paddingBottom: width * 0.05,
      },
      default: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        paddingVertical: 40,
      },
    }),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    ...Platform.select({
      web: {
        color: '#333',
      },
      default: {
        color: '#FF8A00',
      },
    }),
  },
  formContainer: {
    width: '100%',
    ...Platform.select({
      web: {
        alignItems: 'flex-start',
      },
      default: {
        alignItems: 'center',
      },
    }),
  },
  input: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    ...Platform.select({
      web: {
        width: '80%',
        backgroundColor: '#f0f0f0',
        color: '#000',
      },
      default: {
        width: '100%',
        backgroundColor: '#2a2a2a',
        color: '#fff',
      },
    }),
  },
  loginButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    ...Platform.select({
      web: {
        width: '40%',
        backgroundColor: '#333',
      },
      default: {
        width: '100%',
        backgroundColor: '#FF8A00',
      },
    }),
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  copyrightText: {
    fontSize: 12,
    marginTop: 'auto',
    paddingTop: 20,
    ...Platform.select({
      web: {
        color: '#888',
      },
      default: {
        color: '#777',
      },
    }),
  },
  rightSection: {
    flex: 0.55,
    margin:"1%",
    height:"100%",
    marginRight:"1%",
    backgroundColor: '#222',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
});

export default Login;