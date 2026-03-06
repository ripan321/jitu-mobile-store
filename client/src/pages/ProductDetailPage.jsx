import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Star, MapPin, ShoppingCart, Store, Truck, Shield, ArrowLeft,
         CheckCircle, Gift, CreditCard, Banknote, ChevronDown, ChevronUp } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'
import { formatPrice, calcDiscount } from '../utils/helpers'
import styles from './ProductDetailPage.module.css'

const EMI_PLANS = [
  { months: 3,  label: '3 months',  rate: 0 },
  { months: 6,  label: '6 months',  rate: 0 },
  { months: 9,  label: '9 months',  rate: 1.5 },
  { months: 12, label: '12 months', rate: 1.5 },
  { months: 18, label: '18 months', rate: 2 },
  { months: 24, label: '24 months', rate: 2 },
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [activeImg, setActiveImg]         = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [orderType, setOrderType]         = useState('pickup')
  const [paymentMode, setPaymentMode]     = useState('cash')  // 'cash' | 'emi'
  const [selectedEmi, setSelectedEmi]     = useState(EMI_PLANS[0])
  const [showAllEmi, setShowAllEmi]       = useState(false)
  const [added, setAdded]                 = useState(false)
  const [descExpanded, setDescExpanded]   = useState(false)

  const product = PRODUCTS.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Products
        </button>
      </div>
    )
  }

  const discount = calcDiscount(product.price, product.originalPrice)
  const emiAmount = Math.ceil(
    paymentMode === 'emi'
      ? product.price * (1 + selectedEmi.rate / 100) / selectedEmi.months
      : product.price / 6
  )

  const handleAddToCart = () => {
    addToCart({
      ...product,
      orderType,
      paymentMode,
      emiPlan: paymentMode === 'emi' ? selectedEmi : null,
      selectedColor: product.colorVariants?.[selectedColor] || null,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const activeVariant = product.colorVariants?.[selectedColor]
  const descLines = product.description ? product.description.split('\n').filter(Boolean) : []
  const showLines = descExpanded ? descLines : descLines.slice(0, 4)

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.topBar}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={15} /> Back
        </button>
        <span className={styles.breadcrumb}>
          Home &rsaquo; {product.category} &rsaquo; {product.brand} &rsaquo; {product.name}
        </span>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className={styles.container}>

        {/* ── COL 1: IMAGES ── */}
        <div className={styles.imageCol}>
          {/* Thumbnails (left side) */}
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbCol}>
              {product.images.map((url, i) => (
                <div
                  key={i}
                  className={styles.thumb + (i === activeImg ? ' ' + styles.thumbActive : '')}
                  onMouseEnter={() => setActiveImg(i)}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={url} alt={'view-' + i} />
                </div>
              ))}
            </div>
          )}
          {/* Main image */}
          <div className={styles.mainImgWrap}>
            <span className={styles.imgBadge}>{product.badge}</span>
            {product.images && product.images[activeImg]
              ? <img src={product.images[activeImg]} alt={product.name} className={styles.mainImg} />
              : <span className={styles.productEmoji}>{product.img || '📦'}</span>
            }
          </div>
        </div>

        {/* ── COL 2: DETAILS ── */}
        <div className={styles.detailsCol}>
          <div className={styles.brandTag}>{product.brand}</div>
          <h1 className={styles.productName}>{product.name}</h1>
          {activeVariant && (
            <div className={styles.colorLabel}>
              Colour: <strong>{activeVariant.name}</strong>
            </div>
          )}

          {/* Rating */}
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={15}
                  fill={s <= Math.round(product.rating) ? '#ffd600' : '#e0e0e0'}
                  color={s <= Math.round(product.rating) ? '#ffd600' : '#e0e0e0'}
                />
              ))}
            </div>
            <span className={styles.ratingNum}>{product.rating}</span>
            <span className={styles.ratingCount}>({product.reviews} ratings)</span>
          </div>

          <div className={styles.separator} />

          {/* Price block */}
          <div className={styles.priceBlock}>
            <div className={styles.discPct}>-{discount}%</div>
            <div className={styles.salePrice}>{formatPrice(product.price)}</div>
            <div className={styles.mrpRow}>
              M.R.P.: <span className={styles.mrp}>{formatPrice(product.originalPrice)}</span>
            </div>
            <div className={styles.savedMsg}>
              You save <strong>{formatPrice(product.originalPrice - product.price)}</strong>!
            </div>
          </div>

          {/* EMI Block */}
          <div className={styles.emiBlock}>
            <div className={styles.emiTopRow}>
              <CreditCard size={15} color="#1a237e" />
              <span className={styles.emiHighlight}>
                EMI from {formatPrice(Math.ceil(product.price / 24))}/month
              </span>
              <span className={styles.emiSub}>No Cost EMI available</span>
            </div>
            <button className={styles.emiToggle} onClick={() => setShowAllEmi(s => !s)}>
              All EMI Plans {showAllEmi ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showAllEmi && (
              <div className={styles.emiTable}>
                {EMI_PLANS.map(plan => {
                  const monthly = Math.ceil(product.price * (1 + plan.rate / 100) / plan.months)
                  return (
                    <div key={plan.months} className={styles.emiRow}>
                      <span>{plan.label}</span>
                      <span className={styles.emiAmt}>{formatPrice(monthly)}/mo</span>
                      <span className={styles.emiType}>{plan.rate === 0 ? <span className={styles.noCost}>No Cost</span> : `${plan.rate}% interest`}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className={styles.separator} />

          {/* Colour variants */}
          {product.colorVariants && product.colorVariants.length > 0 && (
            <div className={styles.variantSection}>
              <div className={styles.variantTitle}>
                Colour: <strong>{activeVariant?.name}</strong>
              </div>
              <div className={styles.colorSwatches}>
                {product.colorVariants.map((v, i) => (
                  <button
                    key={i}
                    className={styles.swatch + (i === selectedColor ? ' ' + styles.swatchActive : '')}
                    onClick={() => setSelectedColor(i)}
                    title={v.name}
                  >
                    <span className={styles.swatchDot} style={{ background: v.hex }} />
                    <span className={styles.swatchName}>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key specs */}
          {product.specs && product.specs.length > 0 && (
            <div className={styles.specsRow}>
              {product.specs.map(s => (
                <span key={s} className={styles.specChip}>{s}</span>
              ))}
            </div>
          )}

          <div className={styles.separator} />

          {/* In-stock */}
          <div className={styles.stockRow}>
            {product.inStock
              ? <><CheckCircle size={15} color="#00897b" /><span className={styles.inStock}>In Stock at <strong>{product.location}</strong></span></>
              : <span className={styles.outStock}>Out of Stock</span>
            }
          </div>

          {/* Order type */}
          <div className={styles.orderTypeSection}>
            <div className={styles.sectionLabel}>Delivery Option</div>
            <div className={styles.orderOptions}>
              <div
                className={styles.orderOption + (orderType === 'pickup' ? ' ' + styles.orderSelected : '')}
                onClick={() => setOrderType('pickup')}
              >
                <Store size={18} />
                <div>
                  <div className={styles.optTitle}>Pick Up In-Store</div>
                  <div className={styles.optSub}>Ready same day</div>
                </div>
                <span className={styles.giftBadge}><Gift size={10} /> Free Gift!</span>
              </div>
              <div
                className={styles.orderOption + (orderType === 'delivery' ? ' ' + styles.orderSelected : '')}
                onClick={() => setOrderType('delivery')}
              >
                <Truck size={18} />
                <div>
                  <div className={styles.optTitle}>Home Delivery</div>
                  <div className={styles.optSub}>Kamrup / Boko area</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment mode */}
          <div className={styles.paymentSection}>
            <div className={styles.sectionLabel}>Payment at Store / Delivery</div>
            <div className={styles.paymentOptions}>
              <div
                className={styles.payOption + (paymentMode === 'cash' ? ' ' + styles.paySelected : '')}
                onClick={() => setPaymentMode('cash')}
              >
                <Banknote size={18} />
                <div>
                  <div className={styles.optTitle}>Pay Full Amount</div>
                  <div className={styles.optSub}>Cash / UPI / Card</div>
                </div>
                <span className={styles.payAmt}>{formatPrice(product.price)}</span>
              </div>
              <div
                className={styles.payOption + (paymentMode === 'emi' ? ' ' + styles.paySelected : '')}
                onClick={() => setPaymentMode('emi')}
              >
                <CreditCard size={18} />
                <div>
                  <div className={styles.optTitle}>Pay via EMI</div>
                  <div className={styles.optSub}>Select plan below</div>
                </div>
              </div>
            </div>

            {paymentMode === 'emi' && (
              <div className={styles.emiSelect}>
                <div className={styles.emiSelectLabel}>Select EMI Duration:</div>
                <div className={styles.emiPlanGrid}>
                  {EMI_PLANS.map(plan => {
                    const monthly = Math.ceil(product.price * (1 + plan.rate / 100) / plan.months)
                    const isSelected = selectedEmi.months === plan.months
                    return (
                      <div
                        key={plan.months}
                        className={styles.emiPlanCard + (isSelected ? ' ' + styles.emiPlanSelected : '')}
                        onClick={() => setSelectedEmi(plan)}
                      >
                        <div className={styles.emiMonths}>{plan.months} mo.</div>
                        <div className={styles.emiMonthly}>{formatPrice(monthly)}<span>/mo</span></div>
                        {plan.rate === 0 && <div className={styles.noCostTag}>No Cost</div>}
                      </div>
                    )
                  })}
                </div>
                <div className={styles.emiNote}>
                  Total: {formatPrice(Math.ceil(product.price * (1 + selectedEmi.rate / 100)))}
                  {selectedEmi.rate === 0 && <span className={styles.ncNote}> · No extra charge</span>}
                </div>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className={styles.ctaRow}>
            <button
              className={styles.addToCartBtn + (added ? ' ' + styles.addedAnim : '')}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart size={18} />
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              className={styles.buyNowBtn}
              onClick={() => { handleAddToCart(); navigate('/cart') }}
              disabled={!product.inStock}
            >
              Buy Now
            </button>
          </div>

          {/* Trust row */}
          <div className={styles.trustRow}>
            <span className={styles.trustItem}><Shield size={12} /> Genuine Product</span>
            <span className={styles.trustItem}><CheckCircle size={12} /> 1-Year Warranty</span>
            <span className={styles.trustItem}><MapPin size={12} /> {product.location}</span>
          </div>
        </div>
      </div>

      {/* ── ABOUT THIS ITEM ── */}
      {product.description && (
        <div className={styles.aboutSection}>
          <div className={styles.aboutInner}>
            <h2 className={styles.aboutTitle}>About this item</h2>
            <div className={styles.aboutContent}>
              {showLines.map((line, i) => {
                const isBullet = line.startsWith('•')
                return isBullet
                  ? <div key={i} className={styles.aboutBullet}><span className={styles.bulletDot}>•</span><span>{line.slice(1).trim()}</span></div>
                  : <p key={i} className={styles.aboutPara}>{line}</p>
              })}
            </div>
            {descLines.length > 4 && (
              <button className={styles.readMoreBtn} onClick={() => setDescExpanded(e => !e)}>
                {descExpanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Read more</>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
