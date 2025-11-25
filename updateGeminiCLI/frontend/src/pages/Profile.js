import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function Profile() {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          setLoading(true);
          const [userResponse, boardsResponse] = await Promise.all([
            axios.get('/user/me'),
            axios.get('/user/me/boards')
          ]);
          setUserInfo(userResponse.data.user);
          setBoards(boardsResponse.data.boards);
        } catch (err) {
          setError(err.response?.data?.error || '프로필 데이터를 가져오는 데 실패했습니다. 백엔드 서버가 실행 중입니까?');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) return <div className="container mt-4"><div>로딩 중...</div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!user || !userInfo) return <div className="container mt-4"><div>프로필을 보려면 로그인하십시오.</div></div>;

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">{userInfo.nickname}님의 프로필</h2>
          <p className="card-text"><strong>이메일:</strong> {userInfo.email}</p>
          <p className="card-text"><strong>가입일:</strong> {new Date(userInfo.create_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="card-title">내 게시물</h3>
          {boards.length > 0 ? (
            <ul className="list-group list-group-flush">
              {boards.map(board => (
                <li key={board.board_id} className="list-group-item">
                  <Link to={`/boards/${board.board_id}`}>
                    <h5 className="mb-1">{board.title}</h5>
                  </Link>
                  <small>좋아요: {board.like_count} | 댓글: {board.comment_count}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>아직 게시물을 작성하지 않았습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
