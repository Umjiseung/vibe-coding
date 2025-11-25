import React, { useState } from 'react'
import { register } from '../api'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return alert('Email is required')
    if (!nickname.trim()) return alert('Nickname is required')
    if (!password.trim()) return alert('Password is required')
    if (password !== confirmPassword) return alert('Passwords do not match')
    if (password.length < 6) return alert('Password must be at least 6 characters')

    setLoading(true)
    try {
      const res = await register(email, nickname, password)
      if (res.msg === 'registered') {
        alert('Registration successful! Please log in.')
        nav('/login')
      } else if (res.msg === 'email exists') {
        alert('Email already exists')
      } else {
        alert(res.msg || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      alert('Error during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <h2>Register</h2>
      <form onSubmit={submit} className="card">
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Nickname *</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your nickname"
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Confirm Password *</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.9em' }}>
          Already have an account? <Link to="/login" style={{ color: '#60a5fa' }}>Login here</Link>
        </p>
      </form>
    </div>
  )
}
