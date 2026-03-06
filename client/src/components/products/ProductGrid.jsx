import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '../../data/products'
import ProductCard from './ProductCard'
import LayoutSwitcher from './LayoutSwitcher'
import FilterChips from './FilterChips'
import styles from './ProductGrid.module.css'

const FILTERS = [
  { id: 'all', label: 'All Products' },
  { id: 'mobiles', label: 'Mobiles' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'printers', label: 'Printers' },
  { id: 'appliances', label: 'Appliances' },
]

export default function ProductGrid({ initialCategory, initialBrand, showHeader = true }) {
  const [cols, setCols] = useState(4)
  const [filter, setFilter] = useState(initialCategory || 'all')
  const navigate = useNavigate()

  useEffect(() => {
    if (initialCategory) setFilter(initialCategory)
  }, [initialCategory])

  const filtered = PRODUCTS.filter((p) => {
    const catMatch = filter === 'all' || p.category === filter
    const brandMatch = !initialBrand || p.brand.toLowerCase() === initialBrand.toLowerCase()
    return catMatch && brandMatch
  })

  return (
    <div className={styles.section}>
      {showHeader && (
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Our <span>Products</span></h2>
          <span className={styles.viewAll} onClick={() => navigate('/products')}>
            View All <ArrowRight size={14} />
          </span>
        </div>
      )}

      <div className={styles.toolbar}>
        <FilterChips filters={FILTERS} active={filter} onChange={setFilter} />
        <LayoutSwitcher cols={cols} onChange={setCols} />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No products found. <span onClick={() => { setFilter('all') }} style={{color:'#1a237e',cursor:'pointer',fontWeight:600}}>Show all</span></p>
        </div>
      ) : (
        <div className={styles.grid + ' ' + styles['cols' + cols]}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
