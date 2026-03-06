import styles from './FilterChips.module.css'

export default function FilterChips({ filters, active, onChange }) {
  return (
    <div className={styles.wrap}>
      {filters.map((f) => (
        <button
          key={f.id}
          className={`${styles.chip} ${active === f.id ? styles.active : ''}`}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
