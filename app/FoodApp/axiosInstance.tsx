import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from 'axios';

const TOKEN_KEY: string = 'userToken';

const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("userToken");
};

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance: AxiosInstance = axios.create({
    baseURL: baseURL,
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      const token: string | null = await getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
  );

  return instance;
};

export const IMAGE_BASE_URL = 'http://192.168.0.240:8080';

export const authApi: AxiosInstance = createAxiosInstance(
  'http://192.168.0.240:8080/auth'
);

export const itemsApi: AxiosInstance = createAxiosInstance(
  'http://192.168.0.240:8080/items'
);

export const cartApi: AxiosInstance = createAxiosInstance(
  'http://192.168.0.240:8080/cart'
);

export const orderApi: AxiosInstance = createAxiosInstance(
  'http://192.168.0.240:8080/order'
);

export const rootApi: AxiosInstance = createAxiosInstance(
  'http://192.168.0.240:8080'
);