import React, { useState } from 'react'
import { toggleLike } from '../api'

export default function LikeButton({ board_id, comment_id, initial }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initial || 0)

  const onClick = async () => {
    const res = await toggleLike({ board_id, comment_id })
    // server returns 'liked' or 'unliked'
    if (res.msg === 'liked') {
      setLiked(true)
      setCount((c) => c + 1)
    } else if (res.msg === 'unliked') {
      setLiked(false)
      setCount((c) => Math.max(0, c - 1))
    }
  }

  return (
    <button onClick={onClick} style={{ background: 'transparent', color: '#9fbffb', border: 'none', cursor: 'pointer' }}>
      ❤️ {count}
    </button>
  )
}
