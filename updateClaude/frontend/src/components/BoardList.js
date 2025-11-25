import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Filter } from 'lucide-react';
import api from '../api';

function BoardList({ onSelectBoard, onWriteClick }) {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
    loadBoards();
  }, []);

  useEffect(() => {
    loadBoards();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await api.request('/boards/categories');
      setCategories(data.categories);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
      setCategories(['일상', '기술', '여행', '음식', '취미', '기타']);
    }
  };

  const loadBoards = async () => {
    try {
      setLoading(true);
      const endpoint = selectedCategory 
        ? `/boards?category=${selectedCategory}` 
        : '/boards';
      const data = await api.request(endpoint);
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

      {/* 카테고리 필터 */}
      <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
            selectedCategory === ''
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {boards.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {selectedCategory 
              ? `'${selectedCategory}' 카테고리에 게시글이 없습니다.` 
              : '게시글이 없습니다.'}
          </div>
        ) : (
          boards.map((board) => (
            <div
              key={board.board_id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
              onClick={() => onSelectBoard(board.board_id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold">{board.title}</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap ml-2">
                  {board.category}
                </span>
              </div>
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
          ))
        )}
      </div>
    </div>
  );
}

export default BoardList;