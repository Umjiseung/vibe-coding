import React, { useState, useContext } from 'react'
import { createBoard } from '../api'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function NewBoard() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const { token } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!token) return alert('login required')
    const res = await createBoard(title, content, category)
    if (res.board_id) {
      alert('created')
      nav('/')
    } else {
      alert(res.msg || 'failed')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>New Board</h2>
      <form onSubmit={submit}>
        <div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
        </div>
        <div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="content" />
        </div>
        <div>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="category" />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}
