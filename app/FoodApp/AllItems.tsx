import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link, Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './FoodContext';
import NavBar from './components/NavBar';

// Styles remain the same, adding new styles for quantity controls
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  headerContent: {
    paddingTop: 10,
    backgroundColor: '#1a1a1a',
    ...Platform.select({
      web: { paddingHorizontal: 60, paddingBottom: 10 },
      default: { paddingHorizontal: 16 }
    })
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8A00',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 10,
  },
  listWrapper: {
    flex: 1,
    paddingTop: 5,
    ...Platform.select({
      web: { paddingHorizontal: 60 },
      default: { paddingHorizontal: 16 }
    })
  },
  listContent: {
    paddingBottom: 40, 
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#e0e0e0',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' },
    })
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

const imageBase = {
  width: Platform.OS === 'web' ? '100%' : 120,
  height: Platform.OS === 'web' ? 250 : 120,
  resizeMode: 'contain',
  borderRadius: Platform.OS === 'web' ? 0 : 12,
  borderBottomLeftRadius: Platform.OS === 'web' ? 0 : 0,
  borderTopRightRadius: Platform.OS === 'web' ? 12 : 0,
  overflow: 'hidden',
};

const itemStyles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: Platform.OS === 'web' ? 'column' : 'row',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    ...Platform.select({
  web: {
    width: 'calc((100% - 40px) / 3)',
  },
  default: {
    flex: 1,
  }
}), 
    overflow: 'hidden',
  },
  image: {
    ...imageBase,
    ...Platform.select({
        web: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 0,
        }
    })
  },
  fallbackContainer: {
    ...imageBase,
    backgroundColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    ...Platform.select({
        web: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 0,
        }
    })
  },
  initialsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF8A00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  initialsText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  fallbackName: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
    padding: Platform.OS === 'web' ? 20 : 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#ccc',
    marginVertical: 4,
    ...Platform.select({
        web: { minHeight: 40 },
    })
  },
  category: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#aaa',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 16 : 8,
  },
  itemPrice: {
    fontSize: 18,
    color: '#FF8A00',
    fontWeight: '900',
  },
  // Reusing existing styles for button base
  addToCartButton: {
    backgroundColor: '#FF8A00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    elevation: 2,
    ...Platform.select({
        web: { cursor: 'pointer' },
    })
  },
  addToCartText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  // NEW styles for Quantity Controls
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8A00',
    // Match styles from Cart.tsx
  },
  qtyButtonDisabled: {
    backgroundColor: '#666',
  },
  qtyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  quantityDisplay: {
    width: 40,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    color: '#FF8A00',
    fontWeight: '600',
  },
});

const ImageFallback = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  return (
    <View style={itemStyles.fallbackContainer}>
      <View style={itemStyles.initialsCircle}>
        <Text style={itemStyles.initialsText}>{initial}</Text>
      </View>
      <Text style={itemStyles.fallbackName} numberOfLines={2}>
        {name || 'Item Name'}
      </Text>
    </View>
  );
};

// Modified CardItem to accept cart data and update function
const CardItem = ({ item, cartItem, handleUpdateCart }) => {
  const [imageError, setImageError] = useState(false);
  const { isAuthenticated, refreshCart } = useAuth(); // ADDED refreshCart for direct update
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Cart information for this item
  const currentQuantity = cartItem?.quantity || 0;
  const cartItemId = cartItem?.cartItemId;
  
  const imageUrl = item.imageUrl?.startsWith('http') 
    ? item.imageUrl 
    : `http://192.168.0.217:8080/images/${item.imageUrl}`;
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Logic for '+' button (Add to Cart / Increment)
  const handleIncrement = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'please login for adding items');
      return;
    }
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      // Hit the same endpoint as AddToCart: POST /cart/addItem with quantity: 1
      await axios.post('http://192.168.0.217:8080/cart/addItem', 
        {
          menuItemId: item.id,
          quantity: 1, // Always 1 for increment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // 1. Update local cart map state after successful API call
      handleUpdateCart(item.id, currentQuantity + 1, cartItemId);
      // 2. Notify other screens/context
      refreshCart();
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Logic for '-' button (Decrement / Remove)
  const handleDecrement = async () => {
    if (!isAuthenticated) return;
    if (isUpdating) return;
    if (currentQuantity === 0) return;

    // We need the cartItemId from the backend response, which is stored in cartMap
    if (!cartItemId) {
        Alert.alert('Error', 'Cannot decrement. Item ID not found in cart data.');
        return;
    }
    
    // Logic for decrement or removal: Call the decrease endpoint
    setIsUpdating(true);
    try {
        const token = await AsyncStorage.getItem('userToken');
        
        // POST call to decrease endpoint
        await axios.post(
            `http://192.168.0.217:8080/cart/decrease/${cartItemId}`, // Use POST for the decrease action
            {},
            { headers: { 'Authorization': `Bearer ${token}` } } // TOKEN is sent here
        );
        
        // 1. Update local state (decrement by 1, or set to 0 if it was 1)
        handleUpdateCart(item.id, currentQuantity - 1, cartItemId);
        // 2. Notify other screens/context
        refreshCart();
        
    } catch (error) {
        console.error('Failed to update quantity:', error);
        Alert.alert('Error', 'Failed to update quantity. Please try again.');
    } finally {
        setIsUpdating(false);
    }
  };

  const renderCartControls = () => {
    if (currentQuantity > 0) {
      // Show [ - | QTY | + ]
      return (
        <View style={itemStyles.quantityControls}>
            <TouchableOpacity 
                style={[itemStyles.qtyButton, isUpdating && itemStyles.qtyButtonDisabled]}
                onPress={handleDecrement} // Calls handleDecrement for qty >= 1
                disabled={isUpdating}
            >
                <Text style={itemStyles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            
            <View style={itemStyles.quantityDisplay}>
                {isUpdating ? (
                    <ActivityIndicator size="small" color="#FF8A00" />
                ) : (
                    <Text style={itemStyles.quantityText}>{currentQuantity}</Text>
                )}
            </View>
            
            <TouchableOpacity 
                style={[itemStyles.qtyButton, isUpdating && itemStyles.qtyButtonDisabled]}
                onPress={handleIncrement}
                disabled={isUpdating}
            >
                <Text style={itemStyles.qtyButtonText}>+</Text>
            </TouchableOpacity>
        </View>
      );
    } else {
      // Show 'Add to Cart' button (now using handleIncrement which is the + logic)
      return (
        <TouchableOpacity 
          style={itemStyles.addToCartButton}
          onPress={handleIncrement}
          disabled={isUpdating}
        >
            {isUpdating ? (
                <ActivityIndicator size="small" color="white" />
            ) : (
                <Text style={itemStyles.addToCartText}>Add to Cart</Text>
            )}
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={itemStyles.card}>
      {item.imageUrl && !imageError ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={itemStyles.image} 
          onError={handleImageError}
        />
      ) : (
        <ImageFallback name={item.name} /> 
      )}
      
      <View style={itemStyles.textContainer}>
        <View>
            <Text style={itemStyles.itemName} numberOfLines={1}>{item.name}</Text>
            <Text style={itemStyles.itemDesc} numberOfLines={2}>{item.description}</Text>
            <Text style={itemStyles.category}>Category: {item.menuCategory?.name || 'Uncategorized'}</Text>
        </View>
        
        <View style={itemStyles.bottomRow}>
          <Text style={itemStyles.itemPrice}>₹{item.price}</Text>
          {renderCartControls()}
        </View>
      </View>
    </View>
  );
};


export default function AllItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to store cart items mapped by menuItemId
  const [cartMap, setCartMap] = useState({}); // { menuItemId: { cartItemId, quantity } }
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated, cartVersion } = useAuth(); // MODIFIED: Get cartVersion
  
  // Function to update the local cart state
  const handleUpdateCart = (menuItemId, newQuantity, knownCartItemId) => {
    setCartMap(prevCartMap => {
        const itemInCart = prevCartMap[menuItemId];
        
        // If quantity is 0 or less, remove the item from the map
        if (newQuantity <= 0) {
            const newMap = { ...prevCartMap };
            delete newMap[menuItemId];
            return newMap;
        }

        // If item exists, update quantity
        if (itemInCart) {
            return {
                ...prevCartMap,
                [menuItemId]: {
                    ...itemInCart,
                    quantity: newQuantity,
                }
            };
        } 
        
        // If item is new (just added from 0), add it to the map.
        return {
            ...prevCartMap,
            [menuItemId]: {
                cartItemId: knownCartItemId || menuItemId, 
                quantity: newQuantity,
            }
        };
    });
  };

  // REFACTORED: Combined fetching logic
  const fetchAllItemsAndCart = async (isRefreshing = false) => {
    try {
        if (!isRefreshing) {
            setLoading(true);
            setError(null);
        }
        
        // 1. Fetch All Menu Items
        const itemsResponse = await axios.get('http://192.168.0.217:8080/items/allItems');
        setItems(itemsResponse.data);
        
        // 2. Fetch Cart Data if authenticated
        const token = await AsyncStorage.getItem('userToken');
        if (isAuthenticated && token) {
            try {
                const cartResponse = await axios.get('http://192.168.0.217:8080/cart/myCart', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const newCartMap = {};
                // Map cart items to a map: { menuItemId: { cartItemId, quantity } }
                if (cartResponse.data.items) {
                    cartResponse.data.items.forEach(item => {
                        newCartMap[item.menuItem.id] = { 
                            cartItemId: item.id, 
                            quantity: item.quantity 
                        };
                    });
                }
                setCartMap(newCartMap);
            } catch (cartError) {
                // Ignore 404/empty cart, but log other errors
                if (cartError.response && cartError.response.status !== 404) {
                    console.warn('Failed to fetch cart:', cartError);
                }
                setCartMap({});
            }
        } else {
            setCartMap({});
        }

    } catch (error) {
        setError('Failed to load menu items. Check network connection or server.');
    } finally {
        if (!isRefreshing) {
            setLoading(false);
        }
    }
  };

  // Initial Data Load - TRIGGERS ON isAuthenticated OR cartVersion CHANGE
  useEffect(() => {
    fetchAllItemsAndCart(false);
  }, [isAuthenticated, cartVersion]); // Dependency on cartVersion ensures sync
  
  // Pull to Refresh Handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllItemsAndCart(true); 
    setRefreshing(false);
  }, [isAuthenticated, cartVersion]);


  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF8A00" />
          <Text style={styles.loadingText}>Loading delicious food...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={itemStyles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={onRefresh}>
            <Text style={styles.buttonText}>Refresh Menu</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        // Pass cart-related props to CardItem
        renderItem={({ item }) => (
          <CardItem 
            item={item} 
            cartItem={cartMap[item.id]} 
            handleUpdateCart={handleUpdateCart}
          />
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={Platform.OS === 'web' && { gap: 20 }}
        numColumns={Platform.OS === 'web' ? 3 : 1}
        // ADDED: Pull to refresh control
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#FF8A00" 
            />
        }
        ListFooterComponent={() => (
            <Link href="/" asChild>
                <TouchableOpacity style={styles.backButton}>
                    <Text style={styles.buttonText}>← Back to Home</Text>
                </TouchableOpacity>
            </Link>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ headerShown: false }} 
      />

      <NavBar activeScreen='Shop' /> 

      <View style={styles.headerContent}>
        <Text style={styles.title}>Full Menu</Text>
        <Text style={styles.subtitle}>Grab your favorites now!</Text>
      </View>

      <View style={styles.listWrapper}>
        {renderContent()}
      </View>
      
    </SafeAreaView>
  );
}