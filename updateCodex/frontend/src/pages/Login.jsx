import React, { useState, useContext } from 'react'
import { login } from '../api'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setToken } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const res = await login(email, password)
    if (res.access_token) {
      setToken(res.access_token)
      nav('/')
    } else {
      alert(res.msg || 'login failed')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
