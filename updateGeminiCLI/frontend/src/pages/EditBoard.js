import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditBoard() {
  const { boardId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`/boards/${boardId}`);
        const { title, content, category } = response.data.board;
        setTitle(title);
        setContent(content);
        setCategory(category || '');
      } catch (err) {
        setError('Failed to fetch board data.');
      }
    };
    fetchBoard();
  }, [boardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/boards/${boardId}`, { title, content, category });
      navigate(`/boards/${boardId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update board.');
    }
  };

  return (
    <div>
      <h2>Edit Board</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}

export default EditBoard;
