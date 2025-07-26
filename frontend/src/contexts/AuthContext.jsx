import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  });
  
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        console.log('AuthProvider: Found existing session');
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(user),
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('AuthProvider: Error parsing user data', error);
        handleLogout();
      }
    } else {
      console.log('AuthProvider: No existing session found');
      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  }, []);

  // Handle user login
  const login = useCallback(async (email, password) => {
    try {
      console.log('AuthProvider: Logging in user:', email);
      
      // In a real app, you would make an API call to authenticate
      // This is a simplified version
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Generate a consistent UID based on email for demo purposes
          const uid = 'user_' + Math.random().toString(36).substr(2, 9);
          resolve({
            user: {
              uid,
              email,
              displayName: email.split('@')[0],
              emailVerified: true,
              // Add other default user properties
              phoneNumber: '',
              location: '',
              lastLogin: new Date().toISOString()
            },
            token: 'dummy-jwt-token'
          });
        }, 1000);
      });
      
      // Ensure user object has required fields
      const userWithDefaults = {
        uid: response.user.uid,
        email: response.user.email,
        displayName: response.user.displayName || email.split('@')[0],
        emailVerified: response.user.emailVerified || false,
        phoneNumber: response.user.phoneNumber || '',
        location: response.user.location || '',
        ...response.user
      };
      
      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userWithDefaults));
      
      // Update state
      setAuthState({
        isAuthenticated: true,
        user: userWithDefaults,
        isLoading: false,
        error: null
      });
      
      console.log('AuthProvider: Login successful', { user: userWithDefaults });
      return { success: true, user: userWithDefaults };
    } catch (error) {
      console.error('AuthProvider: Login error', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Failed to log in'
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Handle user signup
  const signup = useCallback(async (email, password, userData) => {
    try {
      console.log('AuthProvider: Signing up user:', email, userData);
      
      // In a real app, you would make an API call to register the user
      // This is a simplified version
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Generate a consistent UID based on email for demo purposes
          const uid = 'user_' + Math.random().toString(36).substr(2, 9);
          resolve({
            user: {
              uid,
              email,
              displayName: userData?.name || email.split('@')[0],
              emailVerified: false,
              // Add other default user properties
              phoneNumber: userData?.phoneNumber || '',
              location: userData?.location || '',
              lastLogin: new Date().toISOString(),
              ...userData
            },
            token: 'dummy-jwt-token'
          });
        }, 1000);
      });
      
      // Ensure user object has required fields
      const userWithDefaults = {
        uid: response.user.uid,
        email: response.user.email,
        displayName: response.user.displayName || email.split('@')[0],
        emailVerified: response.user.emailVerified || false,
        phoneNumber: response.user.phoneNumber || '',
        location: response.user.location || '',
        ...response.user
      };
      
      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userWithDefaults));
      
      // Update state
      setAuthState({
        isAuthenticated: true,
        user: userWithDefaults,
        isLoading: false,
        error: null
      });
      
      console.log('AuthProvider: Signup successful', { user: userWithDefaults });
      return { success: true, user: userWithDefaults };
    } catch (error) {
      console.error('AuthProvider: Signup error', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Failed to sign up'
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Handle password reset
  const resetPassword = useCallback(async (email) => {
    try {
      console.log('AuthProvider: Sending password reset email to:', email);
      
      // In a real app, you would make an API call to send a password reset email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('AuthProvider: Password reset email sent');
      return { success: true };
    } catch (error) {
      console.error('AuthProvider: Password reset error', error);
      throw error;
    }
  }, []);

  // Handle password update
  const updatePassword = useCallback(async (oobCode, newPassword) => {
    try {
      console.log('AuthProvider: Updating password');
      
      // In a real app, you would verify the oobCode and update the password
      // This is a simplified version
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('AuthProvider: Password updated successfully');
      return { success: true };
    } catch (error) {
      console.error('AuthProvider: Update password error', error);
      throw error;
    }
  }, []);

  // Handle user logout
  const logout = useCallback(() => {
    console.log('AuthProvider: Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    });
    navigate('/login');
  }, [navigate]);

  // Get the current user
  const getCurrentUser = useCallback(() => {
    return authState.user;
  }, [authState.user]);

  // Update user profile
  const updateUserProfile = useCallback(async (userData) => {
    try {
      console.log('AuthProvider: Updating user profile', userData);
      
      if (!authState.user) {
        throw new Error('No user is currently logged in');
      }
      
      // In a real app, you would make an API call to update the profile
      const updatedUser = {
        ...authState.user,
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isAuthenticated: true // Ensure isAuthenticated is set to true
      }));
      
      console.log('AuthProvider: Profile updated successfully', { updatedUser });
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('AuthProvider: Error updating profile', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Failed to update profile'
      }));
      return { success: false, error: error.message };
    }
  }, [authState.user]);

  // Context value
  const contextValue = {
    // State
    currentUser: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    
    // Methods
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    updateUserProfile,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!authState.isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('ProtectedRoute: Not authenticated, redirecting to /login');
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

// Public Route Component (for auth pages when already logged in)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('PublicRoute: Already authenticated, redirecting to /dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : null;
};
