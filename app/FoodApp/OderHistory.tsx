import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rootApi } from './axiosInstance';
import NavBar from './components/NavBar';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await rootApi.get('order/myHistory');
        setOrders(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return '#4CAF50';
      case 'PENDING': return '#FF9800';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <NavBar activeScreen="Orders" />
        <View style={styles.container}>
          <Text style={styles.title}>My Order History</Text>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <NavBar activeScreen="Orders" />
      <View style={styles.container}>
        <Text style={styles.title}>My Order History</Text>
        
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>Order #{order.id}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) }]}>
                    <Text style={styles.statusText}>
                      {order.orderStatus || 'PROCESSING'}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemsContainer}>
                  {order.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <Image 
                        source={{ uri: item.menuItem.imageUrl }} 
                        style={styles.itemImage}
                        defaultSource={require('../../assets/images/burg.png')}
                      />
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.menuItem.name}</Text>
                        <Text style={styles.itemCategory}>{item.menuItem.menuCategory.name}</Text>
                        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                      </View>
                      <Text style={styles.itemPrice}>₹{item.price}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.totalAmount}>Total: ₹{order.totalAmount}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
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
    maxWidth: Platform.OS === 'web' ? 800 : '100%',
    alignSelf: Platform.OS === 'web' ? 'center' : 'flex-start',
    width: Platform.OS === 'web' ? '70%' : '100%',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: 'bold',
    color: '#FF8A00',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: Platform.OS === 'web' ? 25 : 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
    paddingBottom: 15,
  },
  orderId: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: 'bold',
    color: '#e0e0e0',
  },
  orderDate: {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    color: '#888',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: Platform.OS === 'web' ? 12 : 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemsContainer: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  itemImage: {
    width: Platform.OS === 'web' ? 60 : 50,
    height: Platform.OS === 'web' ? 60 : 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '600',
    color: '#e0e0e0',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: Platform.OS === 'web' ? 12 : 10,
    color: '#FF8A00',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: Platform.OS === 'web' ? 12 : 10,
    color: '#888',
  },
  itemPrice: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: 'bold',
    color: '#FF8A00',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    paddingTop: 15,
  },
  totalAmount: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: 'bold',
    color: '#FF8A00',
  },
});

export default OrderHistory;