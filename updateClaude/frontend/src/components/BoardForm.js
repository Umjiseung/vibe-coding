import React, { useState } from 'react';
import api from '../api';

function BoardForm({ board, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: board?.title || '',
    content: board?.content || '',
    category: board?.category || ''
  });

  const handleSubmit = async () => {
    try {
      if (board) {
        await api.request(`/boards/${board.board_id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await api.request('/boards', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
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
        <input
          type="text"
          placeholder="제목"
          maxLength={20}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        <input
          type="text"
          placeholder="카테고리"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        />
        <textarea
          placeholder="내용"
          maxLength={300}
          rows={10}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
        />
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            {board ? '수정하기' : '작성하기'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardForm;