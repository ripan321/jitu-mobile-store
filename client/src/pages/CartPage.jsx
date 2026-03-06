import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart, ArrowLeft, Store, Truck, Gift, ArrowRight, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import styles from './CartPage.module.css'

export default function CartPage() {
  const { items, removeFromCart, updateQty, totalItems, totalMRP, totalPrice, totalDiscount } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <ShoppingCart size={64} color="#c5cae9" />
        <h2 className={styles.emptyTitle}>Your cart is empty</h2>
        <p className={styles.emptySub}>Add some products to get started!</p>
        <button className={styles.shopBtn} onClick={() => navigate('/products')}>
          Browse Products <ArrowRight size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={16} /> Continue Shopping
        </button>
        <h1 className={styles.pageTitle}>Your Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})</h1>
      </div>

      <div className={styles.layout}>
        {/* Cart Items */}
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div
                className={styles.itemImg}
                style={{ background: 'linear-gradient(135deg,' + item.color + '18,' + item.color + '06)' }}
                onClick={() => navigate('/product/' + item.id)}
              >
                <span>{item.img}</span>
              </div>

              <div className={styles.itemInfo}>
                <div className={styles.itemBrand}>{item.brand}</div>
                <div className={styles.itemName} onClick={() => navigate('/product/' + item.id)}>{item.name}</div>
                <div className={styles.itemMeta}>
                  {item.orderType === 'pickup' ? (
                    <span className={styles.pickupTag}><Store size={11} /> Pick Up In-Store &nbsp;<Gift size={11} /> Free Gift!</span>
                  ) : (
                    <span className={styles.deliveryTag}><Truck size={11} /> Home Delivery</span>
                  )}
                </div>

                {/* Price */}
                <div className={styles.priceRow}>
                  <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                  <span className={styles.itemOrig}>{formatPrice(item.originalPrice)}</span>
                  <span className={styles.itemDisc}>{Math.round((item.originalPrice - item.price) / item.originalPrice * 100)}% off</span>
                </div>
              </div>

              {/* Qty + Remove */}
              <div className={styles.rightCol}>
                <div className={styles.qtyRow}>
                  <button className={styles.qtyBtn} onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1}>
                    <Minus size={13} />
                  </button>
                  <span className={styles.qtyNum}>{item.qty}</span>
                  <button className={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>
                    <Plus size={13} />
                  </button>
                </div>
                <div className={styles.itemTotal}>{formatPrice(item.price * item.qty)}</div>
                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryRows}>
            {items.map((item) => (
              <div key={item.id} className={styles.summaryRow}>
                <span className={styles.summaryName}>{item.name} × {item.qty}</span>
                <span>{formatPrice(item.originalPrice * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.priceBreakdown}>
            <div className={styles.breakRow}>
              <span>Total MRP</span>
              <span>{formatPrice(totalMRP)}</span>
            </div>
            <div className={styles.breakRow + ' ' + styles.discountRow}>
              <span>Discount on MRP</span>
              <span className={styles.discountAmt}>− {formatPrice(totalDiscount)}</span>
            </div>
            <div className={styles.breakRow + ' ' + styles.freeRow}>
              <span>Delivery</span>
              <span className={styles.freeLabel}>FREE 🎉</span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <div>
              <div className={styles.totalLabel}>Total Amount</div>
              <div className={styles.totalSavings}>You save {formatPrice(totalDiscount)}!</div>
            </div>
            <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
          </div>

          {items.some(i => i.orderType === 'pickup') && (
            <div className={styles.giftBanner}>
              <Gift size={15} />
              <span>You'll receive a <strong>Free Gift</strong> at store pickup!</span>
            </div>
          )}

          <button className={styles.checkoutBtn} onClick={() => navigate('/booking')}>
            Proceed to Booking <ArrowRight size={16} />
          </button>
          <p className={styles.checkoutNote}>
            📞 Our team will confirm your order within 30 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}
