import React, { useState, useEffect } from 'react';
import { Heart, Edit2, Trash2, Send } from 'lucide-react';
import api from '../api';
import Comment from './Comment';

function BoardDetail({ boardId, currentUser, onBack, onEdit }) {
  const [board, setBoard] = useState(null);
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    try {
      const data = await api.request(`/boards/${boardId}`);
      setBoard(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLike = async () => {
    try {
      await api.request(`/likes/board/${boardId}`, { method: 'POST' });
      loadBoard();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    try {
      await api.request('/comments', {
        method: 'POST',
        body: JSON.stringify({
          board_id: boardId,
          content: comment,
          parent_comment: replyTo
        })
      });
      setComment('');
      setReplyTo(null);
      loadBoard();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await api.request(`/boards/${boardId}`, { method: 'DELETE' });
        onBack();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  if (!board) return <div className="text-center py-20">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="mb-6 text-blue-500 hover:underline"
      >
        ← 목록으로
      </button>
      
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{board.title}</h1>
          {currentUser?.user_id === board.author_id && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(board)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <span>{board.author}</span>
          <span>{new Date(board.created_at).toLocaleString()}</span>
        </div>
        
        <p className="text-gray-700 whitespace-pre-wrap mb-6">{board.content}</p>
        
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
        >
          <Heart className="w-5 h-5" />
          좋아요 {board.like_count}
        </button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          댓글 {board.comment_count}
        </h2>
        
        <div className="mb-6">
          {replyTo && (
            <div className="mb-2 text-sm text-blue-500">
              답글 작성 중... 
              <button onClick={() => setReplyTo(null)} className="ml-2 underline">
                취소
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="댓글을 입력하세요"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button
              onClick={handleComment}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {board.comments.map(comment => (
            <Comment 
              key={comment.comment_id} 
              comment={comment} 
              onReply={setReplyTo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;