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
  const [role, setRole] = useState('user'); // ⬅️ default: user
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Pilih endpoint sesuai role
      const endpoint = role === 'admin' ? '/admin/login' : '/login';

      const response = await api.post(endpoint, { username, password });

      const { accessToken, role: returnedRole } = response.data;

      // Simpan token dan role
      setAuth(accessToken, returnedRole || role); // fallback ke selected role jika role tidak dikembalikan dari backend

      // Redirect berdasarkan role
      if ((returnedRole || role) === 'admin') {
        navigate('/admin');
      } else if ((returnedRole || role) === 'user') {
        navigate('/user');
      } else {
        navigate('/unauthorized');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Coba lagi.');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6 tracking-wide uppercase">
          Sistem Pengaduan UTBK
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>}

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500">
              <FiUser />
            </span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500">
              <FiLock />
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium mb-1 block">Login Sebagai</label>
            <select
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Masuk
          </motion.button>

          <p className="text-sm text-center text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-red-600 font-medium hover:underline">
              Daftar di sini
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
