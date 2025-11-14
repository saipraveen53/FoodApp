import { useRouter } from 'expo-router';
import React from 'react';
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
  const { isAuthenticated, isCheckingAuth, logout } = useAuth();

  const navigateTo = (path) => {
    router.push(path);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Cart బటన్ కోసం కొత్త హ్యాండ్లర్, ఇది లాగిన్ స్థితిని తనిఖీ చేస్తుంది
  const handleCartPress = () => {
    if (isAuthenticated) {
      // లాగిన్ అయి ఉంటే, Cart పేజీకి నావిగేట్ చేయండి
      router.push('/FoodApp/components/Cart'); 
    } else {
      // లాగిన్ కాకపోతే, Alert చూపించి లాగిన్ పేజీకి వెళ్ళడానికి ఆప్షన్ ఇవ్వండి
      Alert.alert(
        'Login Required',
        'Please login to view your cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          // 'Login' నొక్కితే Login పేజీకి వెళ్లండి
          { text: 'Login', onPress: () => router.push('/FoodApp/Login') } 
        ]
      );
    }
  };

  // Only render the search container if on web
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

      {/* RENDER SEARCH BAR ONLY ON WEB */}
      {renderSearchContainer} 

      <View style={styles.authLinks}>
        <TouchableOpacity 
          onPress={handleCartPress} // handleCartPress ను ఉపయోగిస్తున్నాము
          style={styles.iconButton}
        >
          {/* Cart text */}
          <Text style={styles.cartText}>Cart</Text>
        </TouchableOpacity>
        
        {isCheckingAuth ? (
          <View style={styles.authLoading}>
            <ActivityIndicator size="small" color="#e0e0e0" />
          </View>
        ) : isAuthenticated ? (
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.navText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigateTo('/FoodApp/Register')}>
              <Text style={styles.navText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo('/FoodApp/Login')}>
              <Text style={styles.navText}>Login</Text>
            </TouchableOpacity>
          </>
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
    ...Platform.select({
      web: { 
        paddingHorizontal: 60,
        paddingVertical: 18,
        gap:20,
      },
      default: { 
        paddingHorizontal: 10,
        paddingVertical: 15,
        justifyContent: 'space-between',
      }
    })
  },
  brandText: {
    color: '#FF8A00',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  navLinks: {
    flexDirection: 'row',
    // Make navLinks take up full available space on mobile (default) when search is hidden
    flex: Platform.OS === 'web' ? 1 : 1, 
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  webNavLinks: {
    flexDirection: 'row',
    gap: 20,
    flex: 2,
    ...Platform.select({
        default: { display: 'none' }
    })
  },
  navText: {
    color: '#e0e0e0',
    fontWeight: '500',
    ...Platform.select({
      web: { fontSize: 16, letterSpacing: 0.5 },
      default: { fontSize: 12 }
    })
  },
  cartText: {
    color: '#FF0000', // Red color for Cart text
    fontWeight: '700',
    ...Platform.select({
      web: { fontSize: 16, letterSpacing: 0.5 },
      default: { fontSize: 12 }
    })
  },
  navTextActive: {
    color: '#FF8A00',
    fontWeight: '700',
  },
  searchContainer: {
    // Only applies to web, as it's conditionally rendered
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
      }
    })
  },
  authLinks: {
    flexDirection: 'row',
    // INCREASED flex on web to give it more space
    flex: 1.5, 
    justifyContent: 'flex-end',
    alignItems: 'center',
    ...Platform.select({
      // REDUCED gap on web
      web: { gap: 8 }, 
      default: { gap: 8 }
    })
  },
  iconButton: {
    // INCREASED padding on web to make it more visible/clickable
    paddingHorizontal: Platform.OS === 'web' ? 10 : 8, 
  },
  authLoading: {
    width: 50,
    alignItems: 'center',
  },
});

export default NavBar;