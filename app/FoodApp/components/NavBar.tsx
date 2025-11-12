import { useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const NavBar = ({ activeScreen = 'Home' }) => {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

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

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={Platform.OS === 'web' ? "Search for dishes..." : "Search..."}
          placeholderTextColor="#bbbbbb"
        />
      </View>

      <View style={styles.authLinks}>
        <TouchableOpacity onPress={() => navigateTo('/FoodApp/Register')}>
          <Text style={styles.navText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo('/FoodApp/Login')}>
          <Text style={styles.navText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#101010',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    ...Platform.select({
      web: { 
        paddingHorizontal: 25,
        paddingVertical: 18,
      },
      default: { 
        paddingHorizontal: 10,
        paddingVertical: 15,
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
    flex: 1,
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
  navTextActive: {
    color: '#FF8A00',
    fontWeight: '700',
  },
  searchContainer: {
    flex: 1.5,
    marginHorizontal: 10,
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
    flex: 1,
    justifyContent: 'flex-end',
    ...Platform.select({
      web: { gap: 15 },
      default: { gap: 8 }
    })
  },
});

export default NavBar;