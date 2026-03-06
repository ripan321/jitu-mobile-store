import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Laptop, Printer, Wrench, Headphones, Monitor, ChevronDown } from 'lucide-react'
import { CATEGORIES } from '../../data/categories'
import styles from './NavBar.module.css'

const ICONS = { mobiles: Phone, laptops: Laptop, headphones: Headphones, printers: Printer, appliances: Monitor, repair: Wrench }

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const navRef = useRef()
  const buttonRefs = useRef({})
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMouseEnter = (catId) => {
    const btn = buttonRefs.current[catId]
    if (btn) {
      const rect = btn.getBoundingClientRect()
      setMenuPos({ top: rect.bottom, left: rect.left })
    }
    setOpenMenu(catId)
  }

  const handleSubClick = (catId, subLabel) => {
    setOpenMenu(null)
    if (catId === 'repair') {
      navigate('/repair')
    } else {
      navigate('/products/' + catId + '?brand=' + encodeURIComponent(subLabel))
    }
  }

  const handleCatClick = (catId) => {
    setOpenMenu(null)
    if (catId === 'repair') navigate('/repair')
    else navigate('/products/' + catId)
  }

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.inner}>
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.id]
          const isRepair = cat.id === 'repair'
          return (
            <div key={cat.id} className={styles.item}>
              <button
                ref={(el) => (buttonRefs.current[cat.id] = el)}
                className={styles.btn + (isRepair ? ' ' + styles.repair : '') + (openMenu === cat.id ? ' ' + styles.active : '')}
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={() => setOpenMenu(null)}
                onClick={() => handleCatClick(cat.id)}
              >
                <Icon size={14} />
                {cat.label}
                <ChevronDown size={12} />
              </button>
            </div>
          )
        })}
      </div>

      {openMenu && (function() {
        const cat = CATEGORIES.find(function(c) { return c.id === openMenu })
        if (!cat) return null
        return (
          <div
            className={styles.megaMenu}
            style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }}
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className={styles.megaHeader}>{cat.emoji} {cat.label}</div>
            {cat.sub.map((s) => (
              <div
                key={s}
                className={styles.megaItem}
                onClick={() => handleSubClick(cat.id, s)}
              >
                {s}
              </div>
            ))}
          </div>
        )
      })()}
    </nav>
  )
}
