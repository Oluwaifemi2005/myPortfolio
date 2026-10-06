import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, authStorage } from '../../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => authStorage.getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check active session on mount
  useEffect(() => {
    async function verifySession() {
      const storedToken = authStorage.getToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiRequest('/auth/me');
        if (res?.user) {
          setUser(res.user);
          setToken(storedToken);
        } else {
          throw new Error('Invalid user payload');
        }
      } catch (err) {
        console.warn('[Auth] Session expired or invalid. Logging out.');
        authStorage.removeToken();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, []);

  /**
   * Log in with admin email and password
   */
  const login = async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res?.token && res?.user) {
      authStorage.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }

    throw new Error('Invalid response from server');
  };

  /**
   * Log out and clear stored session
   */
  const logout = () => {
    authStorage.removeToken();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
