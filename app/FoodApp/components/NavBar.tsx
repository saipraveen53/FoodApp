import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../FoodContext';

const NavBar = ({ activeScreen = 'Home' }) => {
  const router = useRouter();
  const { isAuthenticated, isCheckingAuth, logout, userRole } = useAuth();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const isAdmin = userRole === 'ROLE_ADMIN';

  const navigateTo = (path) => {
    setMenuVisible(false);
    // Ee function lo path ni as is ga vesi, below links lo leading slash tesesanu
    router.push(path);
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
    // FIX: Removed leading slash
    router.push('FoodApp/Login'); 
  };

  const handleCartPress = () => {
    setMenuVisible(false);
    if (isAuthenticated) {
      router.push('/FoodApp/Cart');
    } else {
      Alert.alert(
        'Login Required',
        'Please login to view your cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          // FIX: Changed to non-leading slash path
          { text: 'Login', onPress: () => navigateTo('FoodApp/Login') },
        ]
      );
    }
  };
  
  const handleProfilePress = () => {
    setMenuVisible(false);
    if (isAuthenticated) {
      router.push('/FoodApp/ProfilePage');
    } else {
      Alert.alert(
        'Login Required',
        'Please login to view your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          // FIX: Changed to non-leading slash path
          { text: 'Login', onPress: () => navigateTo('FoodApp/Login') },
        ]
      );
    }
  };

  const handleOrdersPress = () => {
    setMenuVisible(false);
    if (isAuthenticated) {
      router.push('/FoodApp/OderHistory');
    } else {
      Alert.alert(
        'Login Required',
        'Please login to view your order history.',
        [
          { text: 'Cancel', style: 'cancel' },
          // FIX: Changed to non-leading slash path
          { text: 'Login', onPress: () => navigateTo('FoodApp/Login') },
        ]
      );
    }
  };
  
  const handleAdminDashboardPress = () => {
    setMenuVisible(false);
    if (isAdmin) {
      // FIX: Removed leading slash
      router.push('FoodApp/AdminDashboard'); 
    } else {
      Alert.alert('Unauthorized', 'You do not have administrative privileges.');
    }
  };

  const renderSearchContainer = Platform.OS === 'web' && (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for dishes..."
        placeholderTextColor="#bbbbbb"
      />
    </View>
  );

  return (
    <View style={styles.navBar}>
      <View style={styles.navLinks}>
        <Text style={styles.brandText}>FoodApp</Text>
      </View>

      {Platform.OS === 'web' && (
        <View style={styles.webNavLinks}>
          <TouchableOpacity onPress={() => navigateTo('/')}>
            <Text style={[styles.navText, activeScreen === 'Home' && styles.navTextActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.navText, activeScreen === 'Gallery' && styles.navTextActive]}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('/FoodApp/AllItems')}>
            <Text style={[styles.navText, activeScreen === 'Shop' && styles.navTextActive]}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.navText, activeScreen === 'Contact' && styles.navTextActive]}>Contact</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderSearchContainer}

      <View style={styles.authLinks}>
        <TouchableOpacity
          onPress={() => setMenuVisible(!isMenuVisible)}
          style={styles.iconButton}
        >
          <Text style={styles.iconText}>User</Text>
        </TouchableOpacity>

        {isMenuVisible && (
          <View style={styles.menuContainer}>
            
            {isAdmin && (
              <TouchableOpacity style={styles.menuItem} onPress={handleAdminDashboardPress}>
                <Text style={styles.menuItemText}>Admin Dashboard</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem} onPress={handleCartPress}>
              <Text style={styles.menuItemText}>Cart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleProfilePress}>
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleOrdersPress}>
              <Text style={styles.menuItemText}>My Orders</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {isCheckingAuth ? (
              <View style={[styles.menuItem, styles.authLoading]}>
                <ActivityIndicator size="small" color="#e0e0e0" />
              </View>
            ) : isAuthenticated ? (
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Text style={styles.menuItemText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('FoodApp/Register')}>
                  <Text style={styles.menuItemText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('FoodApp/Login')}>
                  <Text style={styles.menuItemText}>Login</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101010',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    zIndex: 1000, 
    ...Platform.select({
      web: {
        paddingHorizontal: 60,
        paddingVertical: 18,
        gap: 20,
      },
      default: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        justifyContent: 'space-between',
      },
    }),
  },
  brandText: {
    color: '#FF8A00',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  navLinks: {
    flexDirection: 'row',
    flex: Platform.OS === 'web' ? 1 : 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  webNavLinks: {
    flexDirection: 'row',
    gap: 20,
    flex: 2,
    ...Platform.select({
      default: { display: 'none' },
    }),
  },
  navText: {
    color: '#e0e0e0',
    fontWeight: '500',
    ...Platform.select({
      web: { fontSize: 16, letterSpacing: 0.5 },
      default: { fontSize: 12 },
    }),
  },
  navTextActive: {
    color: '#FF8A00',
    fontWeight: '700',
  },
  searchContainer: {
    flex: 1.5,
  },
  searchInput: {
    backgroundColor: '#282828',
    color: 'white',
    borderRadius: 25,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#444444',
    ...Platform.select({
      web: {
        paddingHorizontal: 20,
        paddingVertical: 10,
      },
      default: {
        paddingHorizontal: 15,
        paddingVertical: 8,
      },
    }),
  },
  authLinks: {
    flexDirection: 'row',
    flex: 1.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    zIndex: 100, 
  },
  iconButton: {
    paddingHorizontal: Platform.OS === 'web' ? 10 : 8,
  },
  iconText: {
    color: '#FF8A00',
    fontWeight: '700',
    fontSize: 16,
  },
  authLoading: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    marginTop: 8,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuItemText: {
    color: '#e0e0e0',
    fontSize: 15,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#444444',
    marginVertical: 4,
  },
});

export default NavBar;