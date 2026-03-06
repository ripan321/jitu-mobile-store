import { createContext, useContext, useState } from 'react'

const AdminContext = createContext(null)

// ── Phase 2: replace with real JWT API auth ──
const ADMIN_CREDENTIALS = { username: 'admin', password: 'jitu@2024' }

export function AdminProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('jitu_admin') === 'true')
  const [loginError, setLoginError] = useState('')

  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem('jitu_admin', 'true')
      setIsLoggedIn(true)
      setLoginError('')
      return true
    }
    setLoginError('Invalid username or password')
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('jitu_admin')
    setIsLoggedIn(false)
  }

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout, loginError }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
