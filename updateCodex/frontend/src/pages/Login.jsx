import React, { useState, useContext } from 'react'
import { login } from '../api'
import { AuthContext } from '../AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setToken } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return alert('Email is required')
    if (!password.trim()) return alert('Password is required')

    setLoading(true)
    try {
      const res = await login(email, password)
      if (res.access_token) {
        setToken(res.access_token)
        nav('/')
      } else {
        alert(res.msg || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      alert('Error logging in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={submit} className="card">
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.9em' }}>
          Don't have an account? <Link to="/register" style={{ color: '#60a5fa' }}>Register here</Link>
        </p>
      </form>
    </div>
  )
}
