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
      setError(err.response?.data?.error || 'Failed to fetch board details. Is the backend server running?');
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
      setError(err.response?.data?.error || 'Failed to post comment. Is the backend server running?');
    }
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(`/boards/${boardId}`);
      navigate('/boards');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete board. Is the backend server running?');
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
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="card-title">{board.title}</h2>
            {user && user.user_id === board.author_id && (
              <div>
                <button onClick={() => navigate(`/boards/${boardId}/edit`)} className="btn btn-secondary me-2">Edit</button>
                <button onClick={handleDelete} className="btn btn-danger">Delete</button>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <p className="card-subtitle text-muted mb-0">
              by {board.author} on {new Date(board.created_at).toLocaleDateString()}
            </p>
            {board.category && <span className="badge bg-secondary">{board.category}</span>}
          </div>
          <hr />
          <p className="card-text">{board.content}</p>
        </div>
      </div>

      <div className="mt-4">
        <h3>Comments</h3>
        {board.comments.length > 0 ? renderComments(board.comments) : <p>No comments yet.</p>}
      </div>

      {user && (
        <div className="card mt-4">
          <div className="card-body">
            <h4 className="card-title">Leave a Comment</h4>
            <form onSubmit={handleCommentSubmit}>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;
