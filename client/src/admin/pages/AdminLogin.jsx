import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const { login, loginError } = useAdmin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!username || !password) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    login(username, password)
    setLoading(false)
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}><ShieldCheck size={32} color="#fff" /></div>
          <div className={styles.logoText}>Jitu<span>Mobile</span></div>
          <div className={styles.logoSub}>Admin Dashboard</div>
        </div>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to manage your store</p>

        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <div className={styles.inputWrap}>
            <User size={16} className={styles.inputIcon} />
            <input
              className={styles.input}
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKey}
              autoComplete="username"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <div className={styles.inputWrap}>
            <Lock size={16} className={styles.inputIcon} />
            <input
              className={styles.input}
              type={showPass ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
              autoComplete="current-password"
            />
            <button className={styles.eyeBtn} onClick={() => setShowPass(s => !s)}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {loginError && <div className={styles.error}>{loginError}</div>}

        <button
          className={styles.btn + (loading ? ' ' + styles.loading : '')}
          onClick={handleSubmit}
          disabled={loading || !username || !password}
        >
          {loading ? '⏳ Signing in...' : 'Sign In'}
        </button>

        <div className={styles.hint}>
          <Lock size={11} /> Restricted access · Jitu Mobile Store owners only
        </div>
      </div>
    </div>
  )
}
