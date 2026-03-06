import styles from './StatsBar.module.css'

const STATS = [
  { num: '12', suffix: '+', label: 'Years in Business' },
  { num: '5', suffix: '.0', label: 'Google Rating' },
  { num: '4', suffix: '+', label: 'Store Locations' },
  { num: '10k', suffix: '+', label: 'Happy Customers' },
]

export default function StatsBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.item}>
            <div className={styles.num}>
              {s.num}<span>{s.suffix}</span>
            </div>
            <div className={styles.label}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
