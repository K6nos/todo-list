import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      alert('Googleログイン失敗: ' + err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">ログイン</h2>
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 text-white py-2 rounded"
      >
        Googleでログイン
      </button>
    </div>
  );
}
