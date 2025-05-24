import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { setAuth } from '../utils';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // POST ke endpoint login utama
      const response = await api.post('/login', { username, password });
      const { accessToken, role } = response.data;

      // Simpan token dan role ke localStorage
      setAuth(accessToken, role);

      // Redirect berdasarkan role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'user') {
        navigate('/user');
      } else {
        navigate('/unauthorized');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}

        <label className="block mb-2 font-semibold">Username</label>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          className="w-full p-2 mb-6 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
