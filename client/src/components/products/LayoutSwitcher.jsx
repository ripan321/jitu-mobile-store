import { LayoutGrid, Columns, Sidebar } from 'lucide-react'
import styles from './LayoutSwitcher.module.css'

const OPTIONS = [
  { n: 2, icon: <Sidebar size={14} />, label: '2' },
  { n: 3, icon: <Columns size={14} />, label: '3' },
  { n: 4, icon: <LayoutGrid size={14} />, label: '4' },
]

export default function LayoutSwitcher({ cols, onChange }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Layout:</span>
      {OPTIONS.map(({ n, icon, label }) => (
        <button
          key={n}
          className={`${styles.btn} ${cols === n ? styles.active : ''}`}
          onClick={() => onChange(n)}
          title={`${n} columns`}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  )
}
