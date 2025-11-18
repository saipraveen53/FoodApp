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
  userRole: string | null;
  login: () => Promise<string | null>;
  logout: () => Promise<void>;
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [cartVersion, setCartVersion] = useState(0);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await AsyncStorage.getItem('isAuthenticated');
        const role = await AsyncStorage.getItem('roles');
        if (authStatus === 'true') {
          setIsAuthenticated(true);
          setUserRole(role);
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
      const role = await AsyncStorage.getItem('roles');
      setIsAuthenticated(true);
      setUserRole(role);
      setCartVersion(v => v + 1);
      return role;
    } catch (e) {
      console.error('Failed to save auth status to storage', e);
      return null;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setIsAuthenticated(false);
      setUserRole(null);
      setCartVersion(v => v + 1);
    } catch (e) {
      console.error('Failed to clear async storage', e);
    }
  };
  
  const refreshCart = () => {
      setCartVersion(v => v + 1);
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        isCheckingAuth, 
        userRole, 
        login, 
        logout, 
        cartVersion, 
        refreshCart 
      }}
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