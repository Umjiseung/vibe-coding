import React, { useEffect, useState } from 'react'
import { getBoards } from '../api'

export default function BoardsPage() {
  const [boards, setBoards] = useState([])

  useEffect(() => {
    getBoards().then((r) => setBoards(r.items || []))
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Vibe - Boards</h1>
      {boards.length === 0 && <p>No boards yet.</p>}
      <ul>
        {boards.map((b) => (
          <li key={b.board_id}>
            <strong>{b.title}</strong> — {b.nickname || 'anonymous'}
          </li>
        ))}
      </ul>
    </div>
  )
}
