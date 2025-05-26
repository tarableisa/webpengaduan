// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { setAuth } from '../utils';
import { FiUser, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = role === 'admin' ? '/admin/login' : '/login';
      const { data } = await api.post(endpoint, { username, password });
      setAuth(data.accessToken, data.role || role);
      navigate(data.role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-red-600 p-6">
          <h1 className="text-center text-3xl font-bold text-white tracking-wide">
            SISTEM PENGADUAN UTBK
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 text-red-700 p-3 rounded"
            >
              {error}
            </motion.div>
          )}

          <InputGroup
            icon={<FiUser />}
            label="Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <InputGroup
            icon={<FiLock />}
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <div>
            <label className="block mb-1 font-medium text-red-700">Login Sebagai</label>
            <select
              className="w-full border border-red-300 rounded-lg p-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Masuk
          </motion.button>

          <p className="text-center text-sm text-red-600">
            Belum punya akun?{' '}
            <Link to="/register" className="underline font-semibold hover:text-red-800">
              Daftar di sini
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ icon, label, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-red-500 pointer-events-none group-focus-within:text-red-600">
      {icon}
    </div>
    <input
      {...props}
      className="w-full pl-10 pr-3 py-2 border border-red-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
      placeholder={label}
    />
  </div>
);

export default Login;
