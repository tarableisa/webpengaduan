// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FiUser, FiLock, FiKey } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi tidak sama.');
      return;
    }
    try {
      await api.post('/register', { username, password, confirm_password: confirmPassword });
      setSuccess('Registrasi berhasil! Mengalihkan ke login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-red-600 p-6">
          <h1 className="text-center text-3xl font-bold text-white tracking-wide">
            SISTEM PENGADUAN UTBK
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          <InputGroup icon={<FiUser />} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <InputGroup icon={<FiLock />} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <InputGroup icon={<FiKey />} placeholder="Konfirmasi Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Register
          </motion.button>

          <p className="text-center text-sm">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-red-600 font-semibold hover:underline">
              Login di sini
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

const Alert = ({ type, children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`p-3 rounded ${
      type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
    }`}
  >
    {children}
  </motion.div>
);

const InputGroup = ({ icon, placeholder, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-red-500 group-focus-within:text-red-600 pointer-events-none">
      {icon}
    </div>
    <input
      placeholder={placeholder}
      {...props}
      className="w-full pl-10 pr-3 py-2 border border-red-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
    />
  </div>
);

export default Register;
