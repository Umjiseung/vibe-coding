import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('/boards');
        setBoards(response.data.boards);
      } catch (err) {
        setError('Failed to fetch boards.');
      }
    };
    fetchBoards();
  }, []);

  return (
    <div>
      <h2>Boards</h2>
      <Link to="/boards/create" className="btn btn-primary mb-3">Create Board</Link>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="list-group">
        {boards.map(board => (
          <Link key={board.board_id} to={`/boards/${board.board_id}`} className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{board.title}</h5>
              <small>{new Date(board.created_at).toLocaleDateString()}</small>
            </div>
            <p className="mb-1">by {board.author}</p>
            <small>Likes: {board.like_count} | Comments: {board.comment_count}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BoardList;
