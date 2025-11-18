import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router'; // useRouter import chesam
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// MARPU: react-native-safe-area-context nundi import cheyyali (Status bar fix)
import RazorpayCheckout from 'react-native-razorpay'; // <-- NEW: Razorpay Import
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './FoodContext';
import { rootApi } from './axiosInstance';
import NavBar from './components/NavBar';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && screenWidth > 768;

const Cart = () => {
  const router = useRouter(); // <-- ADDED
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartData, setCartData] = useState(null); // Initial state null ga unchadam sarainade
  const [updatingItem, setUpdatingItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false); // <-- NEW: Ordering state
  const { refreshCart } = useAuth(); 

  
  useEffect(() => {
    setLoading(true);
    // Initial load ki cartData null ga unte, fetchCart set chestundi
    fetchCart().finally(() => setLoading(false));
  }, []);

  const fetchCart = async () => {
    try {
      setError(null);
      
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!userToken) {
        throw new Error('No token found. Please login again');
      }
      
      const response = await rootApi.get(
        `cart/myCart`,
         
      );
      
      // API nundi vachina data lo 'items' lekapothe, khali array ni set cheyyali
      if (response.data && !response.data.items) {
          setCartData({ ...response.data, items: [] });
      } else {
          setCartData(response.data);
      }

    } catch (err) {
      if (err.response) {
        console.error('Server Error:', err.response.data);
        setError(`Server error: ${err.response.status}`);
        
        if (err.response.status === 401) {
          Alert.alert('Authentication Error', 'Please login again');
        } else if (err.response.status === 404) {
          // MARPU (BUG FIX): null ki badulu, khali object ni set cheyyali
          setCartData({ items: [], totalAmount: 0 });
        } else if (err.response.status >= 500) {
          Alert.alert('Server Error', 'Something went wrong. Please try again later');
        }
      } else if (err.request) {
        console.error('Network Error:', err.request);
        setError('Network error. Please check your connection');
        Alert.alert('Network Error', 'Unable to connect to server');
      } else {
        console.error('Error:', err.message);
        setError(err.message);
        Alert.alert('Error', err.message);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCart().finally(() => setRefreshing(false));
  }, []);

  const handleIncrement = async (cartItem) => {
    const { id: cartItemId, quantity: currentQuantity, menuItem } = cartItem;
    const menuItemId = menuItem.id;

    if (updatingItem) return;

    try {
      setUpdatingItem(cartItemId);
      
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!userToken) {
        throw new Error('No token found. Please login again');
      }

      await rootApi.post(
        `cart/addItem`,
        {
          menuItemId: menuItemId,
          quantity: 1,
        },
         
      );

      setCartData(prevData => {
        // Guard check (Eppudu null raadu, kani unchadam manchidi)
        if (!prevData) return { items: [], totalAmount: 0 }; 
        
        const newQuantity = currentQuantity + 1;
        const updatedItems = prevData.items.map(item => {
          if (item.id === cartItemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        
        const itemPrice = updatedItems.find(item => item.id === cartItemId)?.menuItem.price || 0;
        const newTotalAmount = prevData.totalAmount + itemPrice;

        return {
          ...prevData,
          items: updatedItems,
          totalAmount: newTotalAmount
        };
      });

      setUpdatingItem(null);
      refreshCart();

    } catch (err) {
      setUpdatingItem(null);
      console.error('Add Item Error:', err);
      
      if (err.response) {
        Alert.alert('Add Item Failed', `Error: ${err.response.status}`);
      } else if (err.request) {
        Alert.alert('Network Error', 'Unable to add item');
      } else {
        Alert.alert('Error', err.message);
      }
    }
  };

  const handleDecrement = async (itemId, currentQuantity) => {
    if (updatingItem) return;

    try {
      setUpdatingItem(itemId);
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!userToken) {
        throw new Error('No token found. Please login again');
      }

      await axios.put( 
        `http://192.168.0.240:8080/cart/decrease/${itemId}`, 
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setCartData(prevData => {
        if (!prevData) return { items: [], totalAmount: 0 };
        
        const currentItem = prevData.items.find(item => item.id === itemId);
        if (!currentItem) return prevData;

        let updatedItems;
        const itemPrice = currentItem.menuItem.price;
        const newTotalAmount = prevData.totalAmount - itemPrice;

        if (currentQuantity > 1) {
            
            updatedItems = prevData.items.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity: currentQuantity - 1 };
                }
                return item;
            });
        } else {
            
            updatedItems = prevData.items.filter(item => item.id !== itemId);
        }

        return {
          ...prevData,
          items: updatedItems,
          totalAmount: newTotalAmount
        };
      });
      
      setUpdatingItem(null);
      refreshCart(); 

    } catch (err) {
      setUpdatingItem(null);
      console.error('Decrease Item Error:', err);
      
      if (err.response) {
        Alert.alert('Decrease Failed', `Error: ${err.response.status}`);
      } else if (err.request) {
        Alert.alert('Network Error', 'Unable to decrease item quantity');
      } else {
        Alert.alert('Error', err.message);
      }
    }
  };
  
  // MARPU: handlePlaceOrder ni handleCheckout ga marchesanu
  const handleCheckout = async () => {
    if (isOrdering) return;
    
    // Check if cartData is loaded and has items
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        Alert.alert('Empty Cart', 'Please add items to your cart before proceeding to checkout.');
        return;
    }

    setIsOrdering(true);
    let orderId: string | undefined;

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!userToken) {
        Alert.alert('Login Required', 'Please login to place your order.');
        router.push('/FoodApp/Login');
        return;
      }

      // 1. Call the placeOrder API to create an Order ID
      const orderResponse = await rootApi.post(
        `order/placeOrder`,
        {}, 
         
      );
      
      orderId = orderResponse.data.id; 
      
      if (!orderId) {
          throw new Error("Could not get a valid Order ID from the server.");
      }

      // 2. Razorpay Payment Integration
      const totalAmount = cartData.totalAmount; 
      
      const options = {
        key: "rzp_test_4INOZPgnCu4YZa", // Mee Test Key ID
        amount: totalAmount * 100, // Amount in paise
        currency: "INR",
        name: "FoodApp",
        description: "Thank you for shopping with us!",
        image: "https://your_logo_url.png",
        order_id: orderResponse.data.razorpayOrderId || undefined, 
        prefill: {
          name: await AsyncStorage.getItem('name') || 'Customer', 
          email: await AsyncStorage.getItem('email') || 'email@example.com',
          contact: await AsyncStorage.getItem('phone') || '9999999999',
        },
        theme: {
          color: "#FF8A00", 
        },
      };

      // RazorpayCheckout.open promise ni return chestundi
      RazorpayCheckout.open(options)
        .then(async (data) => {
          // Payment Successful
          Alert.alert(
            "Payment Successful!", 
            `Payment ID: ${data.razorpay_payment_id}\nOrder ID: #${orderId}`
          );
          
          refreshCart(); 

          // PaymentStatus screen ki vellandi
          router.push({
            pathname: '/FoodApp/PaymentStatus',
            params: { orderId: orderId, status: 'Successful' }
          });

        })
        .catch((error) => {
          // Payment Failed or Cancelled
          let reason = error.description || `Error Code: ${error.code}`;
          Alert.alert(
            "Payment Failed", 
            `Order #${orderId} payment failed. Reason: ${reason}`
          );
          
          router.push({
            pathname: '/FoodApp/PaymentStatus',
            params: { orderId: orderId, status: 'Failed' }
          });
        });
      
    } catch (err) {
      console.error('Order/Payment Pre-Check Failed:', err);
      
      let errorMessage = 'Failed to place order or initialize payment. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response && err.response.status === 401) {
        errorMessage = 'Authentication expired. Please log in again.';
      }

      Alert.alert('Checkout Failed', errorMessage);
      
    } finally {
      setIsOrdering(false);
    }
  };
  
  

  const renderCartItem = ({ item }) => {
    const isUpdating = updatingItem === item.id;

    return (
      <View style={[
        styles.cartItem,
        isDesktop && styles.cartItemDesktop
      ]}>
        <Image 
          source={{ uri: item.menuItem.imageUrl }} 
          style={[
            styles.itemImage,
            isDesktop && styles.itemImageDesktop
          ]}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={[
            styles.itemName,
            isDesktop && styles.itemNameDesktop
          ]}>
            {item.menuItem.name}
          </Text>
          <Text style={styles.itemCategory}>{item.menuItem.menuCategory.name}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.menuItem.description}
          </Text>
          <View style={[
            styles.priceRow,
            isDesktop && styles.priceRowDesktop
          ]}>
            <Text style={[
              styles.itemPrice,
              isDesktop && styles.itemPriceDesktop
            ]}>
              ₹{item.menuItem.price}
            </Text>
            <View style={[
              styles.quantityControls,
              isDesktop && styles.quantityControlsDesktop
            ]}>
              <TouchableOpacity 
                style={[
                  styles.qtyButton,
                  isDesktop && styles.qtyButtonDesktop,
                  (isUpdating || isOrdering) && styles.qtyButtonDisabled // Check isOrdering
                ]}
                onPress={() => handleDecrement(item.id, item.quantity)} 
                disabled={isUpdating || isOrdering} // Disable while ordering
              >
                <Text style={[
                  styles.qtyButtonText,
                  isDesktop && styles.qtyButtonTextDesktop
                ]}>
                  -
                </Text>
              </TouchableOpacity>
              
              <View style={[
                styles.quantityDisplay,
                isDesktop && styles.quantityDisplayDesktop
              ]}>
                {(isUpdating || isOrdering) ? ( // Check isOrdering
                  <ActivityIndicator size="small" color="#FF8A00" />
                ) : (
                  <Text style={[
                    styles.quantityText,
                    isDesktop && styles.quantityTextDesktop
                  ]}>
                    {item.quantity}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.qtyButton,
                  isDesktop && styles.qtyButtonDesktop,
                  (isUpdating || isOrdering) && styles.qtyButtonDisabled // Check isOrdering
                ]}
                onPress={() => handleIncrement(item)}
                disabled={isUpdating || isOrdering} // Disable while ordering
              >
                <Text style={[
                  styles.qtyButtonText,
                  isDesktop && styles.qtyButtonTextDesktop
                ]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[
            styles.itemTotal,
            isDesktop && styles.itemTotalDesktop
          ]}>
            Total: ₹{(item.menuItem.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  // Ekkada cartData null ga unna, loading state true ga untundi, 
  // kabatti ee code block ki raadu.
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} /> 
        <NavBar />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF8A00" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} /> 
        <NavBar />
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchCart().finally(() => setLoading(false))}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Ee check ippudu 'cartData' null unna (initial render) 
  // leda 'items' khali ga unna (404 fix) pani chestundi.
  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} /> 
        <NavBar />
        <View style={styles.centerContainer}>
          <Text style={styles.title}>My Cart</Text>
          <Text style={styles.subtitle}>Your cart is empty</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Refresh Cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isDesktop) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} /> 
        <NavBar />
        <View style={styles.desktopContainer}>
          <View style={styles.desktopContent}>
            <Text style={styles.headerTitle}>My Cart</Text>
            
            <ScrollView 
              style={styles.desktopScrollView}
              showsVerticalScrollIndicator={false}
              refreshControl={ 
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh} 
                  tintColor="#FF8A00"
                />
              }
            >
              {cartData.items.map((item) => (
                <View key={item.id}>
                  {renderCartItem({ item })}
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.desktopSummaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items:</Text>
              <Text style={styles.summaryValue}>{cartData.items.length}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Quantity:</Text>
              <Text style={styles.summaryValue}>
                {cartData.items.reduce((sum, item) => sum + item.quantity, 0)}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₹{cartData.totalAmount.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
                style={[styles.checkoutButton, isOrdering && styles.qtyButtonDisabled]}
                onPress={handleCheckout} // <-- Updated to handleCheckout
                disabled={isOrdering}
            >
              {isOrdering ? (
                  <ActivityIndicator size="small" color="#1a1a1a" />
              ) : (
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} /> 
      <NavBar />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Cart</Text>
        
        <FlatList
          data={cartData.items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={ 
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#FF8A00"
            />
          }
        />

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items:</Text>
            <Text style={styles.summaryValue}>{cartData.items.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Quantity:</Text>
            <Text style={styles.summaryValue}>
              {cartData.items.reduce((sum, item) => sum + item.quantity, 0)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₹{cartData.totalAmount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.checkoutButton, isOrdering && styles.qtyButtonDisabled]}
            onPress={handleCheckout} // <-- Updated to handleCheckout
            disabled={isOrdering}
          >
            {isOrdering ? (
                <ActivityIndicator size="small" color="#1a1a1a" />
            ) : (
                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            )}
          </TouchableOpacity>
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
  },
  
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  desktopContent: {
    flex: 1,
    marginRight: 30,
  },
  desktopScrollView: {
    flex: 1,
  },
  desktopSummaryContainer: {
    width: 380,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 24,
    height: 'fit-content',
    marginTop: 70,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
      }
    }),
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF8A00',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: isDesktop ? 32 : 24,
    fontWeight: 'bold',
    color: '#FF8A00',
    padding: 16,
    textAlign: isDesktop ? 'left' : 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 200,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cartItemDesktop: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
      },
    }),
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#3a3a3a',
  },
  itemImageDesktop: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8A00',
    marginBottom: 4,
  },
  itemNameDesktop: {
    fontSize: 22,
    marginBottom: 8,
  },
  itemCategory: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceRowDesktop: {
    marginTop: 12,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e0e0e0',
  },
  itemPriceDesktop: {
    fontSize: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityControlsDesktop: {
    borderRadius: 10,
  },
  qtyButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8A00',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  qtyButtonDesktop: {
    width: 40,
    height: 40,
  },
  qtyButtonDisabled: {
    backgroundColor: '#666',
  },
  qtyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  qtyButtonTextDesktop: {
    fontSize: 24,
  },
  quantityDisplay: {
    width: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
  },
  quantityDisplayDesktop: {
    width: 50,
    height: 40,
  },
  quantityText: {
    fontSize: 16,
    color: '#FF8A00',
    fontWeight: '600',
  },
  quantityTextDesktop: {
    fontSize: 18,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  itemTotalDesktop: {
    fontSize: 20,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#ccc',
  },
  summaryValue: {
    fontSize: 15,
    color: '#e0e0e0',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8A00',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#FF8A00',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      },
    }),
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  loadingText: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8A00',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF8A00',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});

export default Cart;