import React, { useState } from 'react';
import api from '../api';

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: ''
  });

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = await api.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if (isLogin) {
        api.setToken(data.access_token);
        onLogin(data.user);
      } else {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? '로그인' : '회원가입'}
      </h2>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        {!isLogin && (
          <input
            type="text"
            placeholder="닉네임"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.nickname}
            onChange={(e) => setFormData({...formData, nickname: e.target.value})}
          />
        )}
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
        >
          {isLogin ? '로그인' : '회원가입'}
        </button>
      </div>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 text-blue-500 hover:underline"
      >
        {isLogin ? '회원가입하기' : '로그인하기'}
      </button>
    </div>
  );
}

export default AuthForm;