import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { getBoard, createComment } from '../api'
import LikeButton from '../components/LikeButton'
import { AuthContext } from '../AuthContext'

export default function BoardDetail() {
  const { board_id } = useParams()
  const [board, setBoard] = useState(null)
  const [text, setText] = useState('')
  const { token } = useContext(AuthContext)

  useEffect(() => {
    getBoard(board_id).then((r) => setBoard(r))
  }, [board_id])

  const submit = async (e) => {
    e.preventDefault()
    if (!token) return alert('login required')
    const res = await createComment(board.board_id, text, null)
    if (res.comment_id) {
      // reload
      const r = await getBoard(board_id)
      setBoard(r)
      setText('')
    } else alert('failed')
  }

  if (!board) return <div className="card">Loading…</div>

  return (
    <div>
      <div className="card">
        <h2>{board.title}</h2>
        <p className="small">by {board.user_id} • {new Date(board.created_at).toLocaleString()}</p>
        <p>{board.content}</p>
        <LikeButton board_id={board.board_id} initial={board.like_count} />
      </div>

      <div className="card">
        <h3>Comments ({board.comment_count})</h3>
        {board.comments.map((c) => (
          <div key={c.comment_id} className="list-item">
            <div>
              <strong>{c.user_id}</strong>
              <div className="small">{c.content}</div>
            </div>
            <div className="small">{new Date(c.created_time || c.created_at || Date.now()).toLocaleString()}</div>
          </div>
        ))}

        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." />
          <button type="submit">Comment</button>
        </form>
      </div>
    </div>
  )
}
