import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import BoardsPage from './pages/Boards'
import Login from './pages/Login'
import Register from './pages/Register'
import NewBoard from './pages/NewBoard'
import BoardDetail from './pages/BoardDetail'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ padding: 12 }}>
          <nav>
            <Link to="/">Boards</Link> | <Link to="/new">New</Link>
            {' | '}
            <AuthStatus />
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<BoardsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/new" element={<NewBoard />} />
          <Route path="/boards/:board_id" element={<BoardDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function AuthStatus() {
  const { user, logout } = useContext(AuthContext)
  if (!user)
    return (
      <>
        <Link to="/login">Login</Link>
        {' | '}
        <Link to="/register">Register</Link>
      </>
    )

  return (
    <>
      <span style={{ color: '#cfe9ff', marginRight: 8 }}>Hi, {user.nickname}</span>
      <button onClick={logout} style={{ background: 'transparent', color: '#9fbffb', border: 'none', cursor: 'pointer' }}>Logout</button>
    </>
  )
}
