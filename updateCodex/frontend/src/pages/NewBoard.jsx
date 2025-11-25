import React, { useState, useContext } from 'react'
import { createBoard } from '../api'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function NewBoard() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!token) return alert('Login required')
    if (!title.trim()) return alert('Title is required')
    if (!content.trim()) return alert('Content is required')

    setLoading(true)
    try {
      const res = await createBoard(title, content, category)
      if (res.board_id) {
        alert('Board created!')
        nav(`/boards/${res.board_id}`)
      } else {
        alert(res.msg || 'Failed to create board')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating board')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Create New Board</h2>
      <form onSubmit={submit} className="card">
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here..."
            style={{ minHeight: 200, width: '100%', padding: 10, marginBottom: 8 }}
            disabled={loading}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Category (optional)</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Technology, Life, etc."
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create Board'}
        </button>
      </form>
    </div>
  )
}
