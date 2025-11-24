import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import CreateBoard from './pages/CreateBoard';
import EditBoard from './pages/EditBoard';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/boards" element={<BoardList />} />
            <Route path="/boards/create" element={<CreateBoard />} />
            <Route path="/boards/:boardId/edit" element={<EditBoard />} />
            <Route path="/boards/:boardId" element={<BoardDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
