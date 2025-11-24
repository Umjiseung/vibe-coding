import React from 'react';
import { Heart } from 'lucide-react';

function Comment({ comment, isReply = false, onReply }) {
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
        <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
          <Heart className="w-4 h-4" />
          {comment.likes}
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
        <Comment key={reply.comment_id} comment={reply} isReply={true} />
      ))}
    </div>
  );
}

export default Comment;