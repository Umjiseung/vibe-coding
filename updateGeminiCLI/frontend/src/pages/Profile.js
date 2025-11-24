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
          setError('Failed to fetch profile data.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user || !userInfo) return <div>Please log in to see your profile.</div>;

  return (
    <div>
      <h2>{userInfo.nickname}'s Profile</h2>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>Joined:</strong> {new Date(userInfo.create_at).toLocaleDateString()}</p>
      <hr />
      <h3>My Boards</h3>
      {boards.length > 0 ? (
        <div className="list-group">
          {boards.map(board => (
            <Link key={board.board_id} to={`/boards/${board.board_id}`} className="list-group-item list-group-item-action">
              <h5 className="mb-1">{board.title}</h5>
              <small>Likes: {board.like_count} | Comments: {board.comment_count}</small>
            </Link>
          ))}
        </div>
      ) : (
        <p>You haven't created any boards yet.</p>
      )}
    </div>
  );
}

export default Profile;
