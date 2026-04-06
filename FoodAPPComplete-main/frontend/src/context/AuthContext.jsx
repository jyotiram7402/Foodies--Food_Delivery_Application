import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const credentials = localStorage.getItem('authCredentials')
    if (credentials && !user) {
      getMe()
        .then((res) => {
          setUser(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        })
        .catch(() => {
          localStorage.removeItem('authCredentials')
          localStorage.removeItem('user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const credentials = btoa(`${email}:${password}`)
    localStorage.setItem('authCredentials', credentials)
    try {
      const res = await getMe()
      const userData = res.data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (err) {
      localStorage.removeItem('authCredentials')
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('authCredentials')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAuthenticated = !!user
  const userType = user?.userType || null

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, userType }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
