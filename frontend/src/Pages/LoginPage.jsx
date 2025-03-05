import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImg from '../../assets/Nodado.jpg';  

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const urlAPI = import.meta.env.VITE_API_URL

  useEffect(() => {
    const checkToken = localStorage.getItem('token')
    if(checkToken){
      navigate('/dashboard/overview')
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault();
    
    // POST request to the backend
    axios.post(`${urlAPI}/auth-api/login`, { username, password })
      .then(response => {
        if (response.data.success) {
          // Store the JWT token in localStorage
          localStorage.setItem('token', response.data.token);
          // Redirect to the dashboard after successful login
          navigate('/dashboard');
        } else {
          alert('Invalid credentials');
        }
      })
      .catch(error => console.error('Login error:', error));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section for logo and login */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        {/* Logo */}
        <div className="mb-6">
          <img src="/assets/Nodado.jfif" alt="Finance Department" className="h-23 w-auto" />
          <h1 className="text-2xl font-bold mb-4">Finance Department</h1>
        </div>

        {/* Sign In Form */}
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-4 w-64">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Stay signed in</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500">
          Not yet Registered? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>

      {/* Right section with the background image */}
      <div className="w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundImg})` }}>
        {/* Additional content if needed */}
      </div>
    </div>
  );
};

export default LoginPage;