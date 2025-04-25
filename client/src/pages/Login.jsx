import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ThemeContext } from "../context/ThemeContext";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './styles/Login.css'; // Import your CSS file for styling

const Login = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login({ email, password });
    setLoading(false);
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Expense Tracker</h1>
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-input-wrapper" style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', paddingRight: '40px' }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading} style={{ marginLeft: '0px', marginTop: '0px', position: 'relative' }}>
            {loading ? (
              <div className="spinner" />
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p style={{ marginTop: '1rem', fontSize: '14px', textAlign:'center'}}>
          Click here to{' '}
          <Link to="/register" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Signup
          </Link>
        </p>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>&copy; 2025 Expense Tracker. All rights reserved.</p>
        <p>Developed by <a href="https://guruprasaaths.netlify.app" target="_blank" rel="noopener noreferrer">Guruprasaath</a></p>
      </footer>
    </div>
  );
};

export default Login;
