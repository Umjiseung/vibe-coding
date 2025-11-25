const BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000/api'

function authHeaders() {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getBoards() {
  const res = await fetch(`${BASE}/boards/`)
  if (!res.ok) return { items: [] }
  return res.json()
}

export async function register(email, nickname, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, nickname, password }),
  })
  return res.json()
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function createBoard(title, content, category) {
  const res = await fetch(`${BASE}/boards/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ title, content, category }),
  })
  return res.json()
}

export async function getBoard(board_id) {
  const res = await fetch(`${BASE}/boards/${board_id}`)
  return res.json()
}

export async function getMe() {
  const res = await fetch(`${BASE}/users/me`, { headers: { ...authHeaders() } })
  if (!res.ok) return null
  return res.json()
}

export async function createComment(board_id, content, parent_comment) {
  const res = await fetch(`${BASE}/comments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ board_id, content, parent_comment }),
  })
  return res.json()
}

export async function toggleLike(board_id, comment_id) {
  const payload = {}
  if (board_id) payload.board_id = board_id
  if (comment_id) payload.comment_id = comment_id
  
  const res = await fetch(`${BASE}/likes/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function checkLike(board_id, comment_id) {
  const params = new URLSearchParams()
  if (board_id) params.append('board_id', board_id)
  if (comment_id) params.append('comment_id', comment_id)
  
  const res = await fetch(`${BASE}/likes/check?${params.toString()}`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) return { liked: false }
  return res.json()
}