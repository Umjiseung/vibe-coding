import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function CreateBoard() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]); // Set initial category
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/boards/', { title, content, category });
      navigate('/boards');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create board. Is the backend server running?');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Create Board</h2>
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
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBoard;
