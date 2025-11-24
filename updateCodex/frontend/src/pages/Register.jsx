import React, { useState } from 'react'
import { register } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const res = await register(email, nickname, password)
    if (res.msg) {
      alert('registered')
      nav('/login')
    } else {
      alert('failed')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </div>
        <div>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="nickname" />
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
