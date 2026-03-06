import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, MapPin, Eye, Heart } from 'lucide-react'
import { formatPrice, calcDiscount } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const discount = calcDiscount(product.price, product.originalPrice)

  const badgeClass =
    product.badge === 'Best Deal' ? styles.badgeDeal
    : product.badge && product.badge.includes('Hot') ? styles.badgeHot
    : styles.badgeStock

  const handleQuickView = (e) => {
    e.stopPropagation()
    navigate('/product/' + product.id)
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    setWishlisted((w) => !w)
  }

  return (
    <div className={styles.card} onClick={() => navigate('/product/' + product.id)}>
      <div
        className={styles.imgWrap}
        style={{ background: 'linear-gradient(135deg, ' + product.color + '18, ' + product.color + '06)' }}
      >
        {product.images && product.images[0]
          ? <img src={product.images[0]} alt={product.name} className={styles.productImg} />
          : <span className={styles.productEmoji}>{product.img || '📦'}</span>
        }
        <span className={styles.badge + ' ' + badgeClass}>{product.badge}</span>
        <button className={styles.wishBtn} onClick={handleWishlist} title="Add to Wishlist">
          <Heart
            size={14}
            fill={wishlisted ? '#e53935' : 'none'}
            color={wishlisted ? '#e53935' : '#62727b'}
          />
        </button>
      </div>

      <div className={styles.info}>
        <div className={styles.brand}>{product.brand}</div>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.location}><MapPin size={11} /> In-Stock at {product.location}</div>
        <div className={styles.rating}>
          <Star size={12} fill="#ffd600" color="#ffd600" />
          {product.rating}
          <span className={styles.reviews}>({product.reviews})</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.orig}>{formatPrice(product.originalPrice)}</span>
          <span className={styles.discount}>{discount}% off</span>
        </div>
        <button className={styles.quickView} onClick={handleQuickView}>
          <Eye size={14} /> View Details
        </button>
      </div>
    </div>
  )
}
