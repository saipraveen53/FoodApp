import axios from 'axios';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from './components/NavBar';

// =======================================================
// STYLESHEETS
// =======================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    // ...Platform.select({
    //   web: {
    //     width: '100%',
    //     overflowX: 'hidden',
    //   }
    // })
  },
  headerContent: {
    paddingTop: 10,
    backgroundColor: '#1a1a1a',
    // UPDATED: Added larger horizontal padding for web
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
    // UPDATED: Added larger horizontal padding for web
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

// UPDATED: Increased web image height
const imageBase = {
  width: Platform.OS === 'web' ? '100%' : 120,
  height: Platform.OS === 'web' ? 250 : 120, // <-- CHANGED
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
    // We have 3 columns and 2 gaps of 20px each (total 40px)
    // So the width is (100% - 40px) / 3
    width: 'calc((100% - 40px) / 3)',
  },
  default: {
    // On mobile, numColumns is 1, so flex: 1 is correct
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
    padding: Platform.OS === 'web' ? 20 : 12, // <-- CHANGED
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: Platform.OS === 'web' ? 14 : 13, // <-- CHANGED
    color: '#ccc',
    marginVertical: 4,
    // UPDATED: Added minHeight to normalize card heights
    ...Platform.select({
        web: { minHeight: 40 }, // Reserve space for 2 lines
    })
  },
  category: {
    fontSize: Platform.OS === 'web' ? 13 : 12, // <-- CHANGED
    color: '#aaa',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 16 : 8, // <-- CHANGED
  },
  itemPrice: {
    fontSize: 18,
    color: '#FF8A00',
    fontWeight: '900',
  },
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
  }
});

// =======================================================
// COMPONENTS
// =======================================================

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

const CardItem = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = item.imageUrl?.startsWith('http') 
    ? item.imageUrl 
    : `http://192.168.0.217:8080/images/${item.imageUrl}`;
  
  const handleImageError = () => {
    setImageError(true);
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
          <TouchableOpacity style={itemStyles.addToCartButton}>
            <Text style={itemStyles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function AllItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await axios.get('http://192.168.0.217:8080/items/allItems');
        setItems(response.data);
      } catch (error) {
        setError('Failed to load menu items. Check network connection or server.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

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
          <Text style={styles.errorText}>{error}</Text>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.buttonText}>← Back to Home</Text>
            </TouchableOpacity>
          </Link>
        </View>
      );
    }
    
    return (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CardItem item={item} />}
        contentContainerStyle={styles.listContent}
        // --- UPDATED FOR WEB ---
        columnWrapperStyle={Platform.OS === 'web' && { gap: 20 }}
        numColumns={Platform.OS === 'web' ? 3 : 1}
        // --- END OF UPDATES ---
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
        <Text style={styles.subtitle}>Grab your  favorites now!</Text>
      </View>

      <View style={styles.listWrapper}>
        {renderContent()}
      </View>
      
    </SafeAreaView>
  );
}