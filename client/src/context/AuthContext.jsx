import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Check if user is already logged in by verifying cookie
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get('https://expense-tracker-3eaf.onrender.com/auth/verify', {
          withCredentials: true,
        });

        const { isAdmin, userId } = response.data;

        // Fetch additional user info if needed
        // Or just store basic info
        setUser({ isAdmin, userId });
        console.log("✅ Session verified:", { isAdmin, userId });
      } catch (error) {
        console.warn("❌ Session not valid:", error.response?.data?.message || error.message);
        setUser(null);
      }
    };

    verifyUser();
  }, []);

  // ✅ Login sets cookie
  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(
        'https://expense-tracker-3eaf.onrender.com/auth/login',
        { email, password },
        { withCredentials: true }
      );

      const { name, email: userEmail, isAdmin } = response.data;
      const userData = { name, email: userEmail, isAdmin };
      setUser(userData);

      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Invalid credentials, please try again.');
    }
  };

  // ✅ Logout removes cookie
  const logout = async () => {
    try {
      await axios.post('https://expense-tracker-3eaf.onrender.com/auth/logout', {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error('Logout error (possibly already logged out):', err.message);
    }
    setUser(null);
    navigate('/');
  };

  // Register stays same
  const register = async (userInfo) => {
    try {
      const response = await fetch('https://expense-tracker-3eaf.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      await response.json();
      alert('Registration successful! You can now log in.');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
