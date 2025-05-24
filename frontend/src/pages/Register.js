// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}
        {success && <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">{success}</div>}

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
          className="w-full p-2 mb-4 border rounded" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <label className="block mb-2 font-semibold">Konfirmasi Password</label>
        <input 
          type="password" 
          className="w-full p-2 mb-6 border rounded" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>

        <p className="mt-4 text-center">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
