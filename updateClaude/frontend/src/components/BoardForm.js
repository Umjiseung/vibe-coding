import React, { useState, useEffect } from 'react';
import api from '../api';

function BoardForm({ board, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: board?.title || '',
    content: board?.content || '',
    category: board?.category || '기타'
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.request('/boards/categories');
      setCategories(data.categories);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
      // 기본 카테고리 설정
      setCategories(['일상', '기술', '여행', '음식', '취미', '기타']);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      if (board) {
        await api.request(`/boards/${board.board_id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        alert('게시글이 수정되었습니다.');
      } else {
        await api.request('/boards', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        alert('게시글이 작성되었습니다.');
      }
      onSave();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        {board ? '블로그 수정' : '블로그 작성'}
      </h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="제목을 입력하세요 (최대 20자)"
            maxLength={20}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.title.length}/20자</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="내용을 입력하세요 (최대 300자)"
            maxLength={300}
            rows={10}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.content.length}/300자</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-medium"
          >
            {board ? '수정하기' : '작성하기'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardForm;