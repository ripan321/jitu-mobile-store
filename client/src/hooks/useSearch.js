import { useState, useMemo } from 'react'
import { PRODUCTS } from '../data/products'
import { REPAIR_SERVICES } from '../data/categories'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('Product') // 'Product' | 'Service'

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()

    if (searchType === 'Product') {
      return PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    } else {
      return REPAIR_SERVICES.filter((s) =>
        s.title.toLowerCase().includes(q)
      )
    }
  }, [query, searchType])

  return { query, setQuery, searchType, setSearchType, results }
}
