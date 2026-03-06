import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { LOCATIONS } from '../../data/locations'
import styles from './Footer.module.css'

const PRODUCT_LINKS = [
  { label: 'Mobiles',         cat: 'mobiles' },
  { label: 'Laptops',         cat: 'laptops' },
  { label: 'Headphones',      cat: 'headphones' },
  { label: 'Printers',        cat: 'printers' },
  { label: 'Large Appliances',cat: 'appliances' },
]
const SERVICE_LINKS = ['Screen Replacement', 'Battery Repair', 'Water Damage', 'Laptop Service', 'Book a Diagnosis']

export default function Footer() {
  const navigate = useNavigate()

  const goToCategory = (cat) => {
    navigate('/products/' + cat)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div>
            <div className={styles.logo}>Jitu<span>Mobile</span></div>
            <p className={styles.desc}>
              Your trusted electronics destination in Assam since 2012. Genuine products,
              expert repairs, and customer-first service across 4 locations.
            </p>
            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              5.0 · Google Verified
            </div>
          </div>

          {/* Products */}
          <div>
            <div className={styles.colTitle}>Products</div>
            {PRODUCT_LINKS.map((l) => (
              <button key={l.cat} onClick={() => goToCategory(l.cat)} className={styles.link}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Services */}
          <div>
            <div className={styles.colTitle}>Services</div>
            {SERVICE_LINKS.map((l) => (
              <button key={l} onClick={() => { navigate('/repair'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={styles.link}>
                {l}
              </button>
            ))}
          </div>

          {/* Stores */}
          <div>
            <div className={styles.colTitle}>Our Stores</div>
            {LOCATIONS.map((l) => (
              <button key={l.id} onClick={() => { navigate('/stores'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={styles.link}>
                <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>© 2025 Jitu Mobile &amp; Electronics. All rights reserved.</span>
          <span className={styles.copy}>Boko, Kamrup, Assam</span>
        </div>
      </div>
    </footer>
  )
}
