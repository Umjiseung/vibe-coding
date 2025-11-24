import React, { useState, useEffect } from 'react';
import { LogOut, Heart, MessageCircle } from 'lucide-react';
import api from '../api';

function MyProfile({ currentUser, onLogout }) {
  const [myBoards, setMyBoards] = useState([]);

  useEffect(() => {
    loadMyBoards();
  }, []);

  const loadMyBoards = async () => {
    try {
      const data = await api.request('/users/me/boards');
      setMyBoards(data.boards);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">내 정보</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            로그아웃
          </button>
        </div>
        <div className="space-y-2 text-gray-700">
          <p><strong>닉네임:</strong> {currentUser.nickname}</p>
          <p><strong>이메일:</strong> {currentUser.email}</p>
          <p><strong>작성한 글:</strong> {myBoards.length}개</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">내가 쓴 글</h2>
      <div className="space-y-4">
        {myBoards.map((board) => (
          <div key={board.board_id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">{board.title}</h3>
            <p className="text-gray-600 mb-4">{board.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {board.like_count}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {board.comment_count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProfile;