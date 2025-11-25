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
          setError(err.response?.data?.error || 'Failed to fetch profile data. Is the backend server running?');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) return <div className="container mt-4"><div>Loading...</div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!user || !userInfo) return <div className="container mt-4"><div>Please log in to see your profile.</div></div>;

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">{userInfo.nickname}'s Profile</h2>
          <p className="card-text"><strong>Email:</strong> {userInfo.email}</p>
          <p className="card-text"><strong>Joined:</strong> {new Date(userInfo.create_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="card-title">My Boards</h3>
          {boards.length > 0 ? (
            <ul className="list-group list-group-flush">
              {boards.map(board => (
                <li key={board.board_id} className="list-group-item">
                  <Link to={`/boards/${board.board_id}`}>
                    <h5 className="mb-1">{board.title}</h5>
                  </Link>
                  <small>Likes: {board.like_count} | Comments: {board.comment_count}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't created any boards yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
