import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// MARPU: react-native-safe-area-context nundi import cheyyali
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "./FoodContext";
import NavBar from './components/NavBar';

// Payment Status types
type Status = 'Processing' | 'Successful' | 'Failed';

const PaymentStatus = () => {
  // Cart screen nundi vachina params ni get cheyyali
  const { orderId, status: initialStatus } = useLocalSearchParams();
  const { refreshCart } = useAuth(); // Success ayithe cart refresh cheyyadaniki

  // Ee screen payment ni simulate cheyyadu, kevalam status ni chupistundi
  const [status, setStatus] = useState<Status>(initialStatus as Status || 'Processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'Successful') {
      setMessage(`Payment for Order #${orderId} was successful! Your food is being prepared.`);
      // Payment success ayindi kabatti cart ni clear cheyyali
      refreshCart(); 
    } else if (status === 'Failed') {
      setMessage(`Payment failed for Order #${orderId}. Please try again.`);
    } else {
      // Default (processing or unknown)
      setMessage('Processing your order status...');
    }
  }, [orderId, status, refreshCart]);

  const getStatusColor = () => {
    switch (status) {
      case 'Successful':
        return '#4CAF50'; // Green
      case 'Failed':
        return '#FF4444'; // Red
      case 'Processing':
      default:
        return '#FF8A00'; // Orange
    }
  };

  const renderIcon = () => {
    if (status === 'Processing') {
      return <ActivityIndicator size="large" color="#FF8A00" style={styles.icon} />;
    } else if (status === 'Successful') {
      return <Text style={[styles.icon, styles.successIcon]}>✓</Text>;
    } else {
      return <Text style={[styles.icon, styles.failIcon]}>✕</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <NavBar />
      <View style={styles.container}>
        <View style={styles.statusBox}>
          {renderIcon()}
          <Text style={[styles.title, { color: getStatusColor() }]}>
            Payment {status}
          </Text>
          <Text style={styles.message}>{message}</Text>
          {status === 'Successful' && (
            <Text style={styles.orderIdText}>Order ID: #{orderId}</Text>
          )}

          {status !== 'Processing' && (
            <Link href="/" asChild>
              <TouchableOpacity style={styles.homeButton}>
                <Text style={styles.homeButtonText}>Go to Home</Text>
              </TouchableOpacity>
            </Link>
          )}

          {status === 'Failed' && (
            <Link href="/FoodApp/components/Cart" asChild>
                <TouchableOpacity style={[styles.homeButton, styles.retryButton]}>
                    <Text style={styles.homeButtonText}>Retry Payment</Text>
                </TouchableOpacity>
            </Link>
          )}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  icon: {
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 60,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  failIcon: {
    fontSize: 60,
    color: '#FF4444',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  orderIdText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: '#FF8A00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  retryButton: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#FF8A00',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default PaymentStatus;