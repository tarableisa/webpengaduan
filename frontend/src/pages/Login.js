import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { setAuth } from '../utils';
import { FiUser, FiLock } from 'react-icons/fi';


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
    <div className="min-h-screen bg-red-100 flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-6 left-6 flex items-center gap-2">
      </div>

    
      <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-6 text-center tracking-wide">
        SISTEM PENGADUAN KECURANGAN UTBK
      </h1>

      {/* Form Login */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-8 border-red-600"
      >
        <h1 className="text-2xl font-bold text-center text-red-700 mb-1">Login</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 mb-4 rounded font-medium">
            {error}
          </div>
        )}

        {/* Username */}
        <label className="block mb-2 text-red-700 font-medium">Username</label>
        <div className="flex items-center border border-red-300 rounded mb-4 p-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-400">
          <FiUser className="text-red-500 mr-2" />
          <input
            type="text"
            className="w-full bg-transparent focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <label className="block mb-2 text-red-700 font-medium">Password</label>
        <div className="flex items-center border border-red-300 rounded mb-4 p-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-400">
          <FiLock className="text-red-500 mr-2" />
          <input
            type="password"
            className="w-full bg-transparent focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Role */}
        <label className="block mb-2 text-red-700 font-medium">Login Sebagai</label>
        <select
          className="w-full p-2 border border-red-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-red-400"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
        >
          Masuk
        </button>

        {/* Register Link */}
        <p className="mt-4 text-center text-red-600">
          Belum punya akun?{' '}
          <Link to="/register" className="underline font-semibold">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
