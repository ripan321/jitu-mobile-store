import { MapPin, Phone } from 'lucide-react'
import { LOCATIONS } from '../data/locations'
import styles from './StoreLocatorPage.module.css'

export default function StoreLocatorPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Our Store Locations</h1>
        <p className={styles.heroSub}>Visit us at any of our 4+ locations across Assam</p>
      </div>

      <div className={styles.grid}>
        {LOCATIONS.map((loc) => (
          <div key={loc.id} className={`${styles.card} ${loc.isMain ? styles.main : ''}`}>
            {loc.isMain && <div className={styles.mainTag}>⭐ Main Branch</div>}
            <div className={styles.iconRow}>
              <MapPin size={22} color="#1a237e" />
              <div className={styles.name}>{loc.label}</div>
            </div>
            <div className={styles.address}>{loc.address}</div>
            <a href={`tel:${loc.phone}`} className={styles.phone}>
              <Phone size={13} /> {loc.phone}
            </a>
            <button className={styles.dirBtn}>Get Directions</button>
          </div>
        ))}
      </div>
    </div>
  )
}
