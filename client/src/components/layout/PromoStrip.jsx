import styles from './PromoStrip.module.css'

export default function PromoStrip() {
  return (
    <div className={styles.strip}>
      <span className={styles.badge}>🎁 FREE GIFT</span>
      <span>
        Book Online &amp; Pick Up In-Store — Get a{' '}
        <strong>FREE Screen Guard or Cable</strong> with every purchase!
      </span>
      <span className={styles.sub}>· 12 Years of Trust · 5.0 ⭐ Rated</span>
    </div>
  )
}
