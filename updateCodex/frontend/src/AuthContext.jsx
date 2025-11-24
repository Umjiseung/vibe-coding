import React, { createContext, useEffect, useState } from 'react'
import { getMe } from './api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) localStorage.setItem('access_token', token)
    else localStorage.removeItem('access_token')

    // load user when token changes
    async function load() {
      if (!token) return setUser(null)
      const me = await getMe()
      if (me && me.user_id) setUser(me)
      else setUser(null)
    }
    load()
  }, [token])

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, setToken, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
