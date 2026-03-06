import { useParams, useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid'
import styles from './ProductsPage.module.css'

const CAT_LABELS = {
  mobiles: 'Mobiles', laptops: 'Laptops', headphones: 'Headphones',
  printers: 'Printers', appliances: 'Large Appliances'
}

export default function ProductsPage() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const brand = searchParams.get('brand')

  const title = brand
    ? brand
    : category
    ? CAT_LABELS[category] || (category.charAt(0).toUpperCase() + category.slice(1))
    : 'All Products'

  return (
    <div>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSub}>
          Genuine products · Competitive prices · Available in-store &amp; online
        </p>
      </div>
      <ProductGrid initialCategory={category || 'all'} initialBrand={brand || ''} />
    </div>
  )
}
