// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FiUser, FiLock, FiKey } from 'react-icons/fi';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak sama.');
      return;
    }

    try {
      // Jika backend kamu butuh "role", tambahkan { role: 'user' } di body request
      await api.post('/register', {
        username,
        password,
        confirm_password: confirmPassword,
        // role: 'user' // ← Uncomment ini jika backend perlu role dari frontend
      });

      setSuccess('Registrasi berhasil! Silakan login.');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center px-4">
      <div className="absolute top-4 left-4 flex items-center space-x-2">
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-8 border-red-600"
      >
        <h1 className="text-2xl font-bold text-center text-red-700 mb-1">Register</h1>

        {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}
        {success && <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">{success}</div>}

        <label className="block mb-1 font-semibold">Username</label>
        <div className="flex items-center border rounded px-2 mb-4 bg-gray-50">
          <FiUser className="text-gray-500 mr-2" />
          <input
            type="text"
            className="w-full p-2 outline-none bg-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <label className="block mb-1 font-semibold">Password</label>
        <div className="flex items-center border rounded px-2 mb-4 bg-gray-50">
          <FiLock className="text-gray-500 mr-2" />
          <input
            type="password"
            className="w-full p-2 outline-none bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <label className="block mb-1 font-semibold">Konfirmasi Password</label>
        <div className="flex items-center border rounded px-2 mb-6 bg-gray-50">
          <FiKey className="text-gray-500 mr-2" />
          <input
            type="password"
            className="w-full p-2 outline-none bg-transparent"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;