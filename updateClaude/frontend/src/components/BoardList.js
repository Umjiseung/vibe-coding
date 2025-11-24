import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import api from '../api';

function BoardList({ onSelectBoard, onWriteClick }) {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await api.request('/boards');
      setBoards(data.boards);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">블로그</h1>
        <button
          onClick={onWriteClick}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          글쓰기
        </button>
      </div>
      
      <div className="space-y-4">
        {boards.map((board) => (
          <div
            key={board.board_id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
            onClick={() => onSelectBoard(board.board_id)}
          >
            <h2 className="text-xl font-bold mb-2">{board.title}</h2>
            <p className="text-gray-600 mb-4">{board.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{board.author}</span>
              <div className="flex items-center gap-4">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardList;