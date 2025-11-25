import React, { useEffect, useState } from 'react'
import { getBoards } from '../api'
import { Link } from 'react-router-dom'

export default function BoardsPage() {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBoards().then((r) => {
      setBoards(r.items || [])
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Vibe - Boards</h1>
      {loading && <p>Loading…</p>}
      {!loading && boards.length === 0 && <p>No boards yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {boards.map((b) => (
          <Link to={`/boards/${b.board_id}`} key={b.board_id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
              <h3 style={{ margin: '0 0 8px 0' }}>{b.title}</h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#888' }}>
                by <strong>{b.nickname || 'anonymous'}</strong> • {new Date(b.created_at).toLocaleString()}
              </p>
              <p style={{ margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {b.content}
              </p>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.85em', color: '#888' }}>
                <span>💬 {b.comment_count || 0}</span>
                <span>❤️ {b.like_count || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
