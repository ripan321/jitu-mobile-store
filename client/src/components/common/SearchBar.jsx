import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, MapPin, Wrench } from 'lucide-react'
import { PRODUCTS } from '../../data/products'
import { REPAIR_SERVICES } from '../../data/categories'
import { formatPrice } from '../../utils/helpers'
import styles from './SearchBar.module.css'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('Product')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef()
  const inputRef = useRef()
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Compute results
  const q = query.trim().toLowerCase()
  const results = q.length < 1 ? [] : searchType === 'Product'
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 6)
    : REPAIR_SERVICES.filter(s =>
        s.title.toLowerCase().includes(q)
      ).slice(0, 6)

  const handleSelect = (item) => {
    setQuery('')
    setOpen(false)
    if (searchType === 'Product') {
      navigate('/product/' + item.id)
    } else {
      navigate('/repair')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && q) {
      setOpen(false)
      if (searchType === 'Product') {
        navigate('/products?q=' + encodeURIComponent(query))
      } else {
        navigate('/repair')
      }
    }
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const highlight = (text) => {
    if (!q) return text
    const idx = text.toLowerCase().indexOf(q)
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: '#e8eaf6', color: '#1a237e', borderRadius: 2, padding: '0 1px' }}>
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    )
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.inputRow}>
        <Search size={16} className={styles.searchIcon} />
        <input
          ref={inputRef}
          className={styles.input}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { if (query) setOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder={
            searchType === 'Product'
              ? 'Search phones, laptops, headphones...'
              : 'Search repair services...'
          }
        />
        {query && (
          <button className={styles.clearBtn} onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }}>
            <X size={14} />
          </button>
        )}
        <div className={styles.toggle}>
          {['Product', 'Service'].map((t) => (
            <button
              key={t}
              className={styles.typeBtn + ' ' + (searchType === t ? styles.active : '')}
              onClick={() => { setSearchType(t); setQuery(''); inputRef.current?.focus() }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown */}
      {open && query.length > 0 && (
        <div className={styles.dropdown}>
          {results.length === 0 ? (
            <div className={styles.noResults}>
              No {searchType === 'Product' ? 'products' : 'services'} found for "<strong>{query}</strong>"
            </div>
          ) : (
            <>
              <div className={styles.dropHeader}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </div>
              {results.map((item) => (
                <div key={item.id || item.title} className={styles.resultItem} onClick={() => handleSelect(item)}>
                  {searchType === 'Product' ? (
                    <>
                      <span className={styles.resultEmoji}>{item.img}</span>
                      <div className={styles.resultInfo}>
                        <div className={styles.resultName}>{highlight(item.name)}</div>
                        <div className={styles.resultMeta}>
                          <span className={styles.resultBrand}>{item.brand}</span>
                          <span className={styles.resultDot}>·</span>
                          <MapPin size={10} />
                          <span>{item.location}</span>
                        </div>
                      </div>
                      <div className={styles.resultPrice}>{formatPrice(item.price)}</div>
                    </>
                  ) : (
                    <>
                      <span className={styles.resultEmoji}>{item.icon}</span>
                      <div className={styles.resultInfo}>
                        <div className={styles.resultName}>{highlight(item.title)}</div>
                        <div className={styles.resultMeta}>
                          <Wrench size={10} />
                          <span>{item.time}</span>
                          <span className={styles.resultDot}>·</span>
                          <span style={{ color: '#ff6f00', fontWeight: 600 }}>{item.price}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div
                className={styles.seeAll}
                onClick={() => { setOpen(false); navigate(searchType === 'Product' ? '/products' : '/repair') }}
              >
                See all {searchType === 'Product' ? 'products' : 'repair services'} →
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
