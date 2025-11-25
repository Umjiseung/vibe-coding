import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  'Technology',
  'Science',
  'Art',
  'Lifestyle',
  'Sports',
  'News',
  'Other',
];

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
        setCategory(category || CATEGORIES[0]); // Set initial category, default to first if none
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch board data. Is the backend server running?');
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
      setError(err.response?.data?.error || 'Failed to update board. Is the backend server running?');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Edit Board</h2>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-4">
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
              <select
                className="form-select" // Use form-select for Bootstrap 5 styled select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
      </div>
    </div>
  );
}

export default EditBoard;
