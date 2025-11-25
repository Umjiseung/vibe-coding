import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const CATEGORIES = [
  '기술',
  '과학',
  '예술',
  '라이프스타일',
  '스포츠',
  '뉴스',
  '기타',
];

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBoards = async () => {
      try {
        const url = selectedCategory === 'All' 
          ? '/boards/' 
          : `/boards/?category=${selectedCategory}`;
        const response = await axios.get(url);
        setBoards(response.data.boards);
      } catch (err) {
        setError(err.response?.data?.error || '게시판을 가져오는 데 실패했습니다. 백엔드 서버가 실행 중입니까?');
      }
    };
    fetchBoards();
  }, [selectedCategory, user, navigate]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>게시판</h2>
        <Link to="/boards/create" className="btn btn-primary">게시판 생성</Link>
      </div>

      <div className="mb-4">
        <label htmlFor="category-filter" className="form-label">카테고리별 필터:</label>
        <select 
          id="category-filter" 
          className="form-select" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">전체</option>
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
              <small className="text-muted">좋아요: {board.like_count} | 댓글: {board.comment_count}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardList;
