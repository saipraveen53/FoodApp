import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  // NEW: Cart synchronization
  cartVersion: number;
  refreshCart: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [cartVersion, setCartVersion] = useState(0); // NEW: Cart version tracker

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await AsyncStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to fetch auth status from storage', e);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async () => {
    try {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setCartVersion(v => v + 1); // Refresh cart on login
    } catch (e) {
      console.error('Failed to save auth status to storage', e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setIsAuthenticated(false);
      setCartVersion(v => v + 1); // Refresh cart on logout
    } catch (e) {
      console.error('Failed to clear async storage', e);
    }
  };
  
  // NEW: Function to manually increment cart version, triggering listeners
  const refreshCart = () => {
      setCartVersion(v => v + 1);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isCheckingAuth, login, logout, cartVersion, refreshCart }} // Added cart logic
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};