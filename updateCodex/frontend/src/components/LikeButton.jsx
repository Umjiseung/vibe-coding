import React, { useState, useContext, useEffect } from 'react'
import { toggleLike, checkLike } from '../api'
import { AuthContext } from '../AuthContext'

export default function LikeButton({ board_id, comment_id, initial }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initial || 0)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const { token } = useContext(AuthContext)

  // Check if user already liked on mount
  useEffect(() => {
    if (token && (board_id || comment_id)) {
      setInitializing(true)
      checkLike(board_id, comment_id).then((res) => {
        setLiked(res.liked || false)
      }).catch(err => {
        console.error(err)
        setLiked(false)
      }).finally(() => setInitializing(false))
    }
  }, [token, board_id, comment_id])

  const onClick = async () => {
    if (!token) return alert('Login required to like')
    if (loading || initializing) return

    setLoading(true)
    try {
      const res = await toggleLike(board_id, comment_id)
      if (res.msg === 'liked') {
        setLiked(true)
        setCount((c) => c + 1)
      } else if (res.msg === 'unliked') {
        setLiked(false)
        setCount((c) => Math.max(0, c - 1))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading || initializing}
      style={{
        background: 'transparent',
        color: liked ? '#ff6b6b' : '#9fbffb',
        border: 'none',
        cursor: loading || initializing ? 'not-allowed' : 'pointer',
        fontSize: '1em',
        opacity: loading || initializing ? 0.7 : 1,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => !loading && !initializing && (e.currentTarget.style.color = '#ff6b6b')}
      onMouseLeave={(e) => !loading && !initializing && (e.currentTarget.style.color = liked ? '#ff6b6b' : '#9fbffb')}
    >
      ❤️ {count}
    </button>
  )
}
