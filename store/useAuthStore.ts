import { create } from 'zustand';
import { authService, type AuthResponse, type LoginRequest, type RegisterRequest, type User } from '../lib/authService';

interface AuthState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  role: string | null;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  isLoading: false,
  user: null,
  role: null,
  error: null,

  // Login action
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response: AuthResponse = await authService.login(credentials);
      
      // Create user object
      const user: User = {
        email: credentials.email,
        role: response.role,
      };
      
      // Store user data
      await authService.storeUser(user);
      
      set({
        isAuthenticated: true,
        user,
        role: response.role,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
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

  // Register action
  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response: AuthResponse = await authService.register(userData);
      
      // Create user object
      const user: User = {
        name: userData.name,
        email: userData.email,
        role: response.role,
      };
      
      // Store user data
      await authService.storeUser(user);
      
      set({
        isAuthenticated: true,
        user,
        role: response.role,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
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

  // Logout action
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

  // Clear error action
  clearError: () => {
    set({ error: null });
  },

  // Initialize auth on app startup
  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      const { isAuthenticated, role } = await authService.initializeAuth();
      
      if (isAuthenticated) {
        // Get stored user data
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

  // Set user action
  setUser: (user: User) => {
    set({ user });
    // Also store in AsyncStorage
    authService.storeUser(user);
  },
}));

// Selectors for convenient access
export const useAuth = () => {
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
    logout: store.logout,
    clearError: store.clearError,
    initializeAuth: store.initializeAuth,
    setUser: store.setUser,
  };
};
