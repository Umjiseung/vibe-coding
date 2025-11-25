import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBoard, createComment } from '../api'
import LikeButton from '../components/LikeButton'
import { AuthContext } from '../AuthContext'

export default function BoardDetail() {
  const { board_id } = useParams()
  const nav = useNavigate()
  const [board, setBoard] = useState(null)
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [loading, setLoading] = useState(true)
  const { token, user } = useContext(AuthContext)

  const loadBoard = async () => {
    try {
      const r = await getBoard(board_id)
      setBoard(r)
    } catch (err) {
      console.error(err)
      alert('Failed to load board')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBoard()
  }, [board_id])

  const submit = async (e) => {
    e.preventDefault()
    if (!token) return alert('Login required')
    if (!text.trim()) return alert('Please write a comment')

    try {
      const res = await createComment(board.board_id, text, replyTo || null)
      if (res.comment_id) {
        await loadBoard()
        setText('')
        setReplyTo(null)
      } else {
        alert(res.msg || 'Failed to create comment')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating comment')
    }
  }

  if (loading) return <div className="card">Loading…</div>
  if (!board) return <div className="card">Board not found</div>

  // Group comments by parent
  const mainComments = board.comments?.filter(c => !c.parent || c.parent === null) || []
  const commentMap = new Map()
  board.comments?.forEach(c => {
    if (c.parent) {
      if (!commentMap.has(c.parent)) commentMap.set(c.parent, [])
      commentMap.get(c.parent).push(c)
    }
  })

  return (
    <div>
      <div className="card">
        <button onClick={() => nav('/')} style={{ background: 'transparent', color: '#9fbffb', border: 'none', cursor: 'pointer', marginBottom: 12 }}>← Back</button>
        <h2 style={{ margin: '0 0 8px 0' }}>{board.title}</h2>
        <p className="small" style={{ margin: 0 }}>by {board.user_id} • {new Date(board.created_at).toLocaleString()}</p>
        <p style={{ marginTop: 12 }}>{board.content}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <LikeButton board_id={board.board_id} initial={board.like_count} />
          <span className="small">💬 {board.comment_count || 0}</span>
        </div>
      </div>

      <div className="card">
        <h3>Comments ({board.comment_count})</h3>
        {mainComments.length === 0 ? (
          <p className="small">No comments yet. Be the first!</p>
        ) : (
          <div style={{ marginBottom: 20 }}>
            {mainComments.map((c) => (
              <div key={c.comment_id}>
                <div className="list-item">
                  <div>
                    <strong>{c.user_id}</strong>
                    <div className="small">{c.content}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div className="small">{new Date(c.created_time || c.created_at || Date.now()).toLocaleString()}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <LikeButton comment_id={c.comment_id} initial={c.likes} />
                      {token && (
                        <button onClick={() => setReplyTo(c.comment_id)} style={{ background: 'transparent', color: '#9fbffb', border: 'none', cursor: 'pointer', fontSize: '0.85em' }}>
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {/* Replies */}
                {commentMap.has(c.comment_id) && (
                  <div style={{ marginLeft: 24, borderLeft: '2px solid #ddd', paddingLeft: 12, marginTop: 8 }}>
                    {commentMap.get(c.comment_id).map(reply => (
                      <div key={reply.comment_id} className="list-item">
                        <div>
                          <strong>{reply.user_id}</strong>
                          <div className="small">{reply.content}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <div className="small">{new Date(reply.created_time || reply.created_at || Date.now()).toLocaleString()}</div>
                          <LikeButton comment_id={reply.comment_id} initial={reply.likes} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={submit} style={{ marginTop: 12 }}>
          {replyTo && (
            <div style={{ background: '#f5f5f5', padding: 8, marginBottom: 12, borderLeft: '3px solid #9fbffb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="small">Replying to comment #{replyTo}</span>
              <button type="button" onClick={() => setReplyTo(null)} style={{ background: 'transparent', color: '#999', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          )}
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={replyTo ? "Write a reply…" : "Write a comment…"} style={{ width: '100%', minHeight: 80 }} />
          <button type="submit">{replyTo ? 'Reply' : 'Comment'}</button>
        </form>
      </div>
    </div>
  )
}
