import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ThemeContext } from "../context/ThemeContext";

const Login = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });  // Ensure login function is awaited
  };

  return (
    <div className={`login-container ${darkMode ? "dark" : "light"}`}>
  <div className="theme-toggle">
    <span className="toggle-label">{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
    <label className="switch">
      <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
      <span className="slider round"></span>
    </label>
  </div>

    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
};

export default Login;
