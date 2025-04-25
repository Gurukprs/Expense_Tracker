import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  // const login = async ({ email, password }) => {
  //   try {
  //     const response = await axios.post('http://localhost:5000/auth/login', { email, password });
  
  //     const userData = {
  //       name: response.data.name, // ✅ Ensure name is received from backend
  //       email: response.data.email,
  //       isAdmin: response.data.isAdmin,
  //       token: response.data.token,
  //     };
  
  //     setUser(userData);
  //     localStorage.setItem('user', JSON.stringify(userData));
  
  //     console.log("✅ User logged in:", userData); // ✅ Debugging
  //     navigate(response.data.isAdmin ? '/admin' : '/dashboard');
  //   } catch (error) {
  //     console.error('Login failed:', error.response?.data?.message || error.message);
  //     alert('Invalid credentials, please try again.');
  //   }
  // };
  const login = async ({ email, password }) => {
    try {
      const response = await axios.post('https://expense-tracker-3eaf.onrender.com/auth/login', { email, password });
  
      const userData = {
        name: response.data.name, // ✅ Ensure name is received
        email: response.data.email,
        isAdmin: response.data.isAdmin,
        token: response.data.token,
      };
  
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
  
      console.log("✅ User logged in:", userData); // Debugging
      navigate(response.data.isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Invalid credentials, please try again.');
    }
  };
  

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  // Register function
  const register = async (userInfo) => {
    try {
      const response = await fetch('https://expense-tracker-3eaf.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Get response as text
        throw new Error(errorText || 'Registration failed');
      }
  
      const data = await response.json(); // Ensure response is JSON
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
