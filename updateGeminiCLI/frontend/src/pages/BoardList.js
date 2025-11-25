import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const url = selectedCategory === 'All' 
          ? '/boards/' 
          : `/boards/?category=${selectedCategory}`;
        const response = await axios.get(url);
        setBoards(response.data.boards);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch boards. Is the backend server running?');
      }
    };
    fetchBoards();
  }, [selectedCategory]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Boards</h2>
        <Link to="/boards/create" className="btn btn-primary">Create Board</Link>
      </div>

      <div className="mb-4">
        <label htmlFor="category-filter" className="form-label">Filter by Category:</label>
        <select 
          id="category-filter" 
          className="form-select" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      <div>
        {boards.map(board => (
          <div key={board.board_id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">
                  <Link to={`/boards/${board.board_id}`}>{board.title}</Link>
                </h5>
                <small>{new Date(board.created_at).toLocaleDateString()}</small>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="card-text mb-0">by {board.author}</p>
                {board.category && <span className="badge bg-secondary">{board.category}</span>}
              </div>
              <hr/>
              <small className="text-muted">Likes: {board.like_count} | Comments: {board.comment_count}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardList;
