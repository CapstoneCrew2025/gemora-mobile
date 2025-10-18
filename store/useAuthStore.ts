import { create } from 'zustand';
import { authService, type AuthResponse, type LoginRequest, type RegisterRequest, type RegisterWithImagesRequest, type User } from '../lib/authService';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  role: string | null;
  error: string | null;

  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  registerWithImages: (userData: RegisterWithImagesRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  role: null,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response: AuthResponse = await authService.login(credentials);
      
      const user: User = {
        email: credentials.email,
        role: response.role,
      };
      
      await authService.storeUser(user);
      
      set({
        isAuthenticated: true,
        user,
        role: response.role,
        isLoading: false,
        error: null,
      });
      
    } catch (error: any) {
      console.error('Auth store: Login failed:', error);
      set({
        isAuthenticated: false,
        user: null,
        role: null,
        isLoading: false,
        error: error.message || 'Login failed',
      });
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response: AuthResponse = await authService.register(userData);
      
      const user: User = {
        name: userData.name,
        email: userData.email,
        role: response.role,
      };
      
      await authService.storeUser(user);
      
      set({
        isAuthenticated: true,
        user,
        role: response.role,
        isLoading: false,
        error: null,
      });
      
    } catch (error: any) {
      console.error('Auth store: Registration failed:', error);
      set({
        isAuthenticated: false,
        user: null,
        role: null,
        isLoading: false,
        error: error.message || 'Registration failed',
      });
      throw error;
    }
  },

  registerWithImages: async (userData: RegisterWithImagesRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response: AuthResponse = await authService.registerWithImages(userData);
      
      const user: User = {
        name: userData.name,
        email: userData.email,
        role: response.role,
      };
      
      await authService.storeUser(user);
      
      set({
        isAuthenticated: true,
        user,
        role: response.role,
        isLoading: false,
        error: null,
      });
      
    } catch (error: any) {
      console.error('Auth store: Registration with images failed:', error);
      set({
        isAuthenticated: false,
        user: null,
        role: null,
        isLoading: false,
        error: error.message || 'Registration failed',
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authService.logout();
      set({
        isAuthenticated: false,
        user: null,
        role: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Logout failed',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      const { isAuthenticated, role } = await authService.initializeAuth();
      
      if (isAuthenticated) {
        const user = await authService.getUser();
        
        set({
          isAuthenticated,
          user,
          role,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          role: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isAuthenticated: false,
        user: null,
        role: null,
        isLoading: false,
        error: error.message || 'Failed to initialize authentication',
      });
    }
  },

  setUser: (user: User) => {
    set({ user });
    authService.storeUser(user);
  },
}));

export const useAuth= () => {
  const store = useAuthStore();
  return {
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    user: store.user,
    role: store.role,
    error: store.error,
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    login: store.login,
    register: store.register,
    registerWithImages: store.registerWithImages,
    logout: store.logout,
    clearError: store.clearError,
    initializeAuth: store.initializeAuth,
    setUser: store.setUser,
  };
};
