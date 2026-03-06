import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ShoppingCart, Phone, ChevronDown, BadgeCheck, Star, Shield, Wrench } from 'lucide-react'
import { useLocation } from '../../context/LocationContext'
import { useCart } from '../../context/CartContext'
import { LOCATIONS } from '../../data/locations'
import SearchBar from '../common/SearchBar'
import styles from './Header.module.css'

export default function Header() {
  const { location, setLocation } = useLocation()
  const { totalItems } = useCart()
  const [showLoc, setShowLoc] = useState(false)
  const locRef = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (locRef.current && !locRef.current.contains(e.target)) setShowLoc(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        {/* Logo */}
        <Link to="/" className={styles.logoWrap}>
          <div className={styles.logoMain}>
            Jitu<span>Mobile</span>
          </div>
          <div className={styles.logoSub}>&amp; Electronics · Est. 2012</div>
        </Link>

        {/* Location Picker */}
        <div ref={locRef} className={styles.locWrap}>
          <button className={styles.locBtn} onClick={() => setShowLoc(!showLoc)}>
            <MapPin size={14} />
            <span>{location.label}</span>
            <ChevronDown size={13} />
          </button>
          {showLoc && (
            <div className={styles.locDropdown}>
              {LOCATIONS.map((l) => (
                <div
                  key={l.id}
                  className={`${styles.locOption} ${l.id === location.id ? styles.selected : ''}`}
                  onClick={() => { setLocation(l); setShowLoc(false) }}
                >
                  <MapPin size={13} />
                  <span>{l.label}</span>
                  {l.isMain && <span className={styles.mainBadge}>MAIN</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <SearchBar />

        {/* Actions */}
        <div className={styles.actions}>
          <a href="tel:+91XXXXXXXXXX" className={styles.iconBtn} title="Call Us">
            <Phone size={18} />
          </a>
          <Link to="/cart" className={styles.iconBtn} title="View Cart">
            <ShoppingCart size={18} />
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </Link>
        </div>
      </div>

      {/* Trust Bar */}
      <div className={styles.trustBar}>
        <span className={styles.trustItem}><BadgeCheck size={13} />12 Years in Business</span>
        <span className={styles.divider}>|</span>
        <span className={styles.trustItem}><Star size={13} />5.0 Google Rated</span>
        <span className={styles.divider}>|</span>
        <span className={styles.trustItem}><MapPin size={13} />4 Store Locations</span>
        <span className={styles.divider}>|</span>
        <span className={styles.trustItem}><Shield size={13} />Genuine Products Only</span>
        <span className={styles.divider}>|</span>
        <span className={styles.trustItem}><Wrench size={13} />Expert Repair Centre</span>
      </div>
    </header>
  )
}
