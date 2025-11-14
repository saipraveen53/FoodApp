import axios from 'axios';
import { useRouter } from 'expo-router';
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

const { width } = Dimensions.get('window');

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        'http://192.168.0.217:8080/auth/register',
        {
          name: name,
          email: email,
          phone: phone,
          password: password,
        }
      );

      setLoading(false);
      Alert.alert(
        'Success',
        'Registration successful! You can now login.'
      );
      router.push('/FoodApp/Login');

    } catch (error) {
      setLoading(false);
      console.error('Registration Failed:', error);
      Alert.alert(
        'Registration Failed',
        'An error occurred. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavBar activeScreen="Register" />
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Create Account</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#888"
              accessibilityLabel="Name input"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
              accessibilityLabel="Email input"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              accessibilityLabel="Phone input"
              value={phone}
              onChangeText={setPhone}
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
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry
              accessibilityLabel="Confirm Password input"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.7}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>REGISTER</Text>
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

export default Register;