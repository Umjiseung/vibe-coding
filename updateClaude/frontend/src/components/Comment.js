import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../api';

function Comment({ comment, isReply = false, onReply, onUpdate, currentUserId }) {
  // 초기 좋아요 상태를 서버에서 받은 값으로 설정
  const [isLiked, setIsLiked] = useState(comment.is_liked || false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);

  const handleCommentLike = async (e) => {
    e.stopPropagation();
    
    try {
      const response = await api.request(`/likes/comment/${comment.comment_id}`, { 
        method: 'POST' 
      });
      
      // 좋아요 상태 토글
      if (response.liked) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      } else {
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      }
      
      // 부모 컴포넌트 새로고침 (선택사항)
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
      alert(error.message);
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 mt-2' : 'mt-4'} p-4 bg-gray-50 rounded-lg`}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{comment.author}</span>
        <span className="text-xs text-gray-500">
          {new Date(comment.created_time).toLocaleString()}
        </span>
      </div>
      <p className="text-gray-700 mb-2">{comment.content}</p>
      <div className="flex items-center gap-4 text-sm">
        <button 
          onClick={handleCommentLike}
          className={`flex items-center gap-1 transition ${
            isLiked 
              ? 'text-red-500 font-semibold' 
              : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart 
            className="w-4 h-4" 
            fill={isLiked ? 'currentColor' : 'none'}
          />
          {likeCount}
        </button>
        {!isReply && onReply && (
          <button
            onClick={() => onReply(comment.comment_id)}
            className="text-blue-500 hover:underline"
          >
            답글
          </button>
        )}
      </div>
      {comment.replies && comment.replies.map(reply => (
        <Comment 
          key={reply.comment_id} 
          comment={reply} 
          isReply={true}
          onUpdate={onUpdate}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

export default Comment;