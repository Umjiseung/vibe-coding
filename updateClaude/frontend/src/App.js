import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import api from './api';
import AuthForm from './components/AuthForm';
import BoardList from './components/BoardList';
import BoardForm from './components/BoardForm';
import BoardDetail from './components/BoardDetail';
import MyProfile from './components/MyProfile';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [editingBoard, setEditingBoard] = useState(null);

  useEffect(() => {
    if (api.getToken()) {
      loadUserInfo();
    }
  }, []);

  const loadUserInfo = async () => {
    try {
      const data = await api.request('/users/me');
      setCurrentUser(data);
    } catch (error) {
      api.clearToken();
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('list');
  };

  const handleLogout = () => {
    api.clearToken();
    setCurrentUser(null);
    setCurrentView('list');
  };

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md mb-6">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 
            className="text-2xl font-bold text-blue-500 cursor-pointer"
            onClick={() => setCurrentView('list')}
          >
            Blog
          </h1>
          <button
            onClick={() => setCurrentView('profile')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <User className="w-5 h-5" />
            {currentUser.nickname}
          </button>
        </div>
      </nav>

      {currentView === 'list' && (
        <BoardList
          onSelectBoard={(id) => {
            setSelectedBoardId(id);
            setCurrentView('detail');
          }}
          onWriteClick={() => {
            setEditingBoard(null);
            setCurrentView('form');
          }}
        />
      )}

      {currentView === 'detail' && (
        <BoardDetail
          boardId={selectedBoardId}
          currentUser={currentUser}
          onBack={() => setCurrentView('list')}
          onEdit={(board) => {
            setEditingBoard(board);
            setCurrentView('form');
          }}
        />
      )}

      {currentView === 'form' && (
        <BoardForm
          board={editingBoard}
          onSave={() => setCurrentView('list')}
          onCancel={() => setCurrentView('list')}
        />
      )}

      {currentView === 'profile' && (
        <MyProfile
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;