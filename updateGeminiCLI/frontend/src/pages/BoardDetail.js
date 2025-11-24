import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function BoardDetail() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchBoard = async () => {
    try {
      const response = await axios.get(`/boards/${boardId}`);
      setBoard(response.data.board);
    } catch (err) {
      setError('Failed to fetch board details.');
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/comments/${boardId}`, { content: newComment });
      setNewComment('');
      fetchBoard(); // Re-fetch to show the new comment
    } catch (err) {
      setError('Failed to post comment.');
    }
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(`/boards/${boardId}`);
      navigate('/boards');
    } catch (err) {
      setError('Failed to delete board.');
    }
  };

  const renderComments = (comments) => {
    return comments.map(comment => (
      <div key={comment.comment_id} className="card mb-2">
        <div className="card-body">
          <p className="card-text">{comment.content}</p>
          <footer className="blockquote-footer">
            {comment.author} on {new Date(comment.created_time).toLocaleDateString()}
          </footer>
          {/* Nested replies could be rendered here */}
        </div>
      </div>
    ));
  };
  
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!board) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>{board.title}</h2>
        {user && user.user_id === board.author_id && (
          <div>
            <button onClick={() => navigate(`/boards/${boardId}/edit`)} className="btn btn-secondary me-2">Edit</button>
            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          </div>
        )}
      </div>
      <p>by {board.author} on {new Date(board.created_at).toLocaleDateString()}</p>
      <hr />
      <p>{board.content}</p>
      <hr />
      <h3>Comments</h3>
      {board.comments.length > 0 ? renderComments(board.comments) : <p>No comments yet.</p>}

      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <h4>Leave a Comment</h4>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      )}
    </div>
  );
}

export default BoardDetail;
