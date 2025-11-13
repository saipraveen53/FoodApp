import axios from 'axios'; // Import axios for API calls
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import React, { useState } from 'react'; // Import useState
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

// Get the screen width for responsive styling
const { width } = Dimensions.get('window');

const Login = () => {
  const router = useRouter(); // Initialize the router

  // State to hold user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State for loading and error messages
  const [loading, setLoading] = useState(false);

  /**
   * Handles the login button press.
   */
  const handleLogin = async () => {
    if (loading) return; // Prevent multiple clicks

    // Basic validation
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      // --- This is your API call ---
      const response = await axios.post(
        'http://192.168.0.217:8080/auth/login',
        {
          email: username,
          password: password,
        }
      );

      // --- Handle Success ---
      setLoading(false);

      // Assuming a successful login, navigate to the Home page
      // router.push('/') will navigate to 'app/(tabs)/index.tsx' which loads your HomePage
      router.push('/');
      
      // You would typically save the token from response.data here
      // e.g., await AsyncStorage.setItem('token', response.data.token);

    } catch (error) {
      // --- Handle Failure ---
      setLoading(false);
      console.error('Login Failed:', error);

      // Show a user-friendly error message
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
        {/* Left Section - Login Form */}
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
              onChangeText={setUsername} // Set username state
              editable={!loading} // Disable input when loading
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry // Hides the password
              accessibilityLabel="Password input"
              value={password}
              onChangeText={setPassword} // Set password state
              editable={!loading} // Disable input when loading
            />
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.7}
              onPress={handleLogin} // Call handleLogin on press
              disabled={loading} // Disable button when loading
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

        {/* Right Section - Image (Only shown on web or large screens) */}
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

// --- STYLES (No changes, just pasting them back) ---

const styles = StyleSheet.create({
  // This is the main screen wrapper
  safeArea: {
    flex: 1,
    ...Platform.select({
      default: {
        backgroundColor: '#1a1a1a', // Keep dark mode for mobile
      },
      web: {
        backgroundColor: '#ffffff', // White background for web
      },
    }),
  },
  // This container holds the left (form) and right (image) sections
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

  // --- Left (Form) Section ---
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
        color: '#FF8A00', // Use brand color on dark background
      },
    }),
  },
  formContainer: {
    width: '100%',
    ...Platform.select({
      web: {
        alignItems: 'flex-start', // Align inputs to the left
      },
      default: {
        alignItems: 'center', // Center inputs on mobile
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
        width: '80%', // 80% of left section width
        backgroundColor: '#f0f0f0',
        color: '#000',
      },
      default: {
        width: '100%', // Full width on mobile
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
        width: '40%', // Smaller width on web
        backgroundColor: '#333', // Dark button
      },
      default: {
        width: '100%', // Full width on mobile
        backgroundColor: '#FF8A00', // Brand color button
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
    marginTop: 'auto', // Push to bottom
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

  // --- Right (Image) Section (Web-only) ---
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