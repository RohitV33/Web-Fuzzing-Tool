import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('vs_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('vs_token')
    if (!token) { setLoading(false); return }
    authAPI.getMe()
      .then(res  => setUser(res.data))
      .catch(()  => { localStorage.removeItem('vs_token'); localStorage.removeItem('vs_user'); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    const res = await authAPI.login({ email, password })
    localStorage.setItem('vs_token', res.data.token)
    localStorage.setItem('vs_user',  JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }, [])

  const register = useCallback(async (username, email, password) => {
    setError(null)
    const res = await authAPI.register({ username, email, password })
    localStorage.setItem('vs_token', res.data.token)
    localStorage.setItem('vs_user',  JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('vs_token')
    localStorage.removeItem('vs_user')
    setUser(null)
  }, [])

  const loginWithToken = useCallback(async (token) => {
    localStorage.setItem('vs_token', token)
    try {
      const res = await authAPI.getMe()
      localStorage.setItem('vs_user', JSON.stringify(res.data))
      setUser(res.data)
    } catch {
      localStorage.removeItem('vs_token')
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, register, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}