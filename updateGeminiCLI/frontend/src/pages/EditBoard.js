import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  '기술',
  '과학',
  '예술',
  '라이프스타일',
  '스포츠',
  '뉴스',
  '기타',
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
        setError(err.response?.data?.error || '게시판 데이터를 가져오는 데 실패했습니다. 백엔드 서버가 실행 중입니까?');
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
      setError(err.response?.data?.error || '게시판을 업데이트하는 데 실패했습니다. 백엔드 서버가 실행 중입니까?');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">게시판 수정</h2>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label className="form-label">제목</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">카테고리</label>
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
              <label className="form-label">내용</label>
              <textarea
                className="form-control"
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">업데이트</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBoard;
