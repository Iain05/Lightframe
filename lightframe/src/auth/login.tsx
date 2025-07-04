import { useState, useEffect } from 'react';
import { checkTokenAndLogout } from '../utils/auth';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in and token is still valid
    const isLoggedIn = checkTokenAndLogout();
    setIsLoggedIn(isLoggedIn);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Login attempt:', formData);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Incorrect password. Please try again.');
        } else {
          setError('Login failed. Please try again later.');
        }
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem('authToken', data.token);
      window.location.href = '/';
      console.log('Login successful');
    } catch {
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {isLoggedIn ? (
          <>
            <h2>Admin Dashboard</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="logout-section">
              <p>You are currently logged in as administrator.</p>
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Admin Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
