import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Truck, ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, ChevronDown, Gift } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import styles from './BookingPage.module.css'

const STORE_LOCATIONS = [
  'Boko (Main Branch)', 'Kamrup', 'Mirza', 'Rangia', 'Nalbari'
]

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM',  '2:00 PM',  '3:00 PM',
  '4:00 PM',  '5:00 PM',  '6:00 PM',
]

// Get next 7 dates
const getNextDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d)
  }
  return dates
}

const fmtDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

export default function BookingPage() {
  const navigate = useNavigate()
  const { items, totalPrice, totalDiscount } = useCart()

  const [orderType, setOrderType] = useState('pickup')
  const [step, setStep] = useState(1) // 1 = form, 2 = confirmed

  // Pickup fields
  const [storeLocation, setStoreLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')

  // Delivery fields
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [landmark, setLandmark] = useState('')

  // Common fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const dates = getNextDates()

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!phone.match(/^[6-9]\d{9}$/)) e.phone = 'Enter valid 10-digit mobile number'
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter valid email'
    if (orderType === 'pickup') {
      if (!storeLocation) e.storeLocation = 'Select a store'
      if (!pickupDate) e.pickupDate = 'Select a date'
      if (!pickupTime) e.pickupTime = 'Select a time slot'
    } else {
      if (!address.trim()) e.address = 'Address is required'
      if (!pincode.match(/^\d{6}$/)) e.pincode = 'Enter valid 6-digit pincode'
    }
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setSubmitting(true)

    // ── Phase 2: replace this with real API call ──
    // const payload = { orderType, items, name, phone, email, ...(pickup fields or delivery fields) }
    // await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(payload) })
    // For now simulate network delay:
    await new Promise(r => setTimeout(r, 1200))

    setSubmitting(false)
    setStep(2)
  }

  if (items.length === 0 && step === 1) {
    return (
      <div className={styles.empty}>
        <p>No items in cart. <span onClick={() => navigate('/products')} style={{color:'#1a237e',cursor:'pointer',fontWeight:700}}>Shop now →</span></p>
      </div>
    )
  }

  // ── CONFIRMED SCREEN ──
  if (step === 2) {
    return (
      <div className={styles.confirmed}>
        <div className={styles.confirmedCard}>
          <div className={styles.confirmedIcon}><CheckCircle size={56} color="#00897b" /></div>
          <h1 className={styles.confirmedTitle}>Booking Confirmed! 🎉</h1>
          <p className={styles.confirmedSub}>
            Hi <strong>{name}</strong>, your order has been received.
          </p>
          <div className={styles.confirmedDetails}>
            {orderType === 'pickup' ? (
              <>
                <div className={styles.cdetRow}><Store size={15} /><span>Pick Up at <strong>{storeLocation}</strong></span></div>
                <div className={styles.cdetRow}><Calendar size={15} /><span>{pickupDate}</span></div>
                <div className={styles.cdetRow}><Clock size={15} /><span>{pickupTime}</span></div>
                <div className={styles.giftNote}><Gift size={15} />Don't forget — <strong>Free Gift</strong> waiting at the store!</div>
              </>
            ) : (
              <>
                <div className={styles.cdetRow}><Truck size={15} /><span>Home Delivery to <strong>{address}</strong></span></div>
              </>
            )}
            <div className={styles.cdetRow}><Phone size={15} /><span>{phone}</span></div>
            {email && <div className={styles.cdetRow}><Mail size={15} /><span>{email}</span></div>}
          </div>
          <div className={styles.confirmedTotal}>
            Total Paid: <strong>{formatPrice(totalPrice)}</strong>
            {totalDiscount > 0 && <span className={styles.savedBadge}>Saved {formatPrice(totalDiscount)}</span>}
          </div>
          <p className={styles.confirmedNote}>
            📞 Our team will call you on <strong>{phone}</strong> within 30 minutes to confirm your booking.
            {email && <> A confirmation will also be sent to <strong>{email}</strong>.</>}
          </p>
          <button className={styles.homeBtn} onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    )
  }

  // ── BOOKING FORM ──
  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button onClick={() => navigate('/cart')} className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Cart
        </button>
        <h1 className={styles.pageTitle}>Complete Your Booking</h1>
      </div>

      <div className={styles.layout}>
        {/* LEFT: FORM */}
        <div className={styles.formSide}>

          {/* Step 1: Order type */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.stepNum}>1</span> How would you like your order?
            </div>
            <div className={styles.typeGrid}>
              <div
                className={styles.typeCard + ' ' + (orderType === 'pickup' ? styles.typeSelected : '')}
                onClick={() => setOrderType('pickup')}
              >
                <div className={styles.typeIcon + ' ' + styles.typeIconBlue}><Store size={24} /></div>
                <div className={styles.typeLabel}>Pick Up In-Store</div>
                <div className={styles.typeSub}>Ready same day · Collect at your convenience</div>
                <div className={styles.freeGiftBadge}><Gift size={11} /> Free Gift at store!</div>
              </div>
              <div
                className={styles.typeCard + ' ' + (orderType === 'delivery' ? styles.typeSelected : '')}
                onClick={() => setOrderType('delivery')}
              >
                <div className={styles.typeIcon + ' ' + styles.typeIconOrange}><Truck size={24} /></div>
                <div className={styles.typeLabel}>Home Delivery</div>
                <div className={styles.typeSub}>Delivery in Kamrup / Boko area · 1–3 days</div>
                <div className={styles.freeDel}>🚚 Free Delivery</div>
              </div>
            </div>
          </div>

          {/* Step 2: Pickup OR Delivery fields */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.stepNum}>2</span>
              {orderType === 'pickup' ? 'Select Store, Date & Time' : 'Delivery Address'}
            </div>

            {orderType === 'pickup' ? (
              <div className={styles.fieldGroup}>
                {/* Store */}
                <div className={styles.field}>
                  <label className={styles.label}><MapPin size={13} /> Store Location *</label>
                  <div className={styles.selectWrap}>
                    <select
                      className={styles.select + (errors.storeLocation ? ' ' + styles.inputErr : '')}
                      value={storeLocation}
                      onChange={e => { setStoreLocation(e.target.value); setErrors(p => ({...p, storeLocation: ''})) }}
                    >
                      <option value="">Select a store...</option>
                      {STORE_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <ChevronDown size={15} className={styles.selectIcon} />
                  </div>
                  {errors.storeLocation && <span className={styles.errMsg}>{errors.storeLocation}</span>}
                </div>

                {/* Date */}
                <div className={styles.field}>
                  <label className={styles.label}><Calendar size={13} /> Pickup Date *</label>
                  <div className={styles.dateGrid}>
                    {dates.map(d => {
                      const ds = fmtDate(d)
                      return (
                        <button
                          key={ds}
                          className={styles.dateChip + ' ' + (pickupDate === ds ? styles.dateSelected : '')}
                          onClick={() => { setPickupDate(ds); setErrors(p => ({...p, pickupDate: ''})) }}
                        >
                          {ds}
                        </button>
                      )
                    })}
                  </div>
                  {errors.pickupDate && <span className={styles.errMsg}>{errors.pickupDate}</span>}
                </div>

                {/* Time */}
                <div className={styles.field}>
                  <label className={styles.label}><Clock size={13} /> Pickup Time *</label>
                  <div className={styles.timeGrid}>
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        className={styles.timeChip + ' ' + (pickupTime === t ? styles.timeSelected : '')}
                        onClick={() => { setPickupTime(t); setErrors(p => ({...p, pickupTime: ''})) }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.pickupTime && <span className={styles.errMsg}>{errors.pickupTime}</span>}
                </div>
              </div>
            ) : (
              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Address *</label>
                  <textarea
                    className={styles.textarea + (errors.address ? ' ' + styles.inputErr : '')}
                    placeholder="House/Flat No., Street, Area, Village..."
                    value={address}
                    rows={3}
                    onChange={e => { setAddress(e.target.value); setErrors(p => ({...p, address: ''})) }}
                  />
                  {errors.address && <span className={styles.errMsg}>{errors.address}</span>}
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.field}>
                    <label className={styles.label}>Pincode *</label>
                    <input
                      className={styles.input + (errors.pincode ? ' ' + styles.inputErr : '')}
                      placeholder="e.g. 781123"
                      maxLength={6}
                      value={pincode}
                      onChange={e => { setPincode(e.target.value.replace(/\D/,'')); setErrors(p => ({...p, pincode: ''})) }}
                    />
                    {errors.pincode && <span className={styles.errMsg}>{errors.pincode}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Landmark (optional)</label>
                    <input
                      className={styles.input}
                      placeholder="Near school, temple..."
                      value={landmark}
                      onChange={e => setLandmark(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Contact details */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.stepNum}>3</span> Your Contact Details
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.label}><User size={13} /> Full Name *</label>
                <input
                  className={styles.input + (errors.name ? ' ' + styles.inputErr : '')}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ''})) }}
                />
                {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
              </div>
              <div className={styles.twoCol}>
                <div className={styles.field}>
                  <label className={styles.label}><Phone size={13} /> Mobile Number *</label>
                  <input
                    className={styles.input + (errors.phone ? ' ' + styles.inputErr : '')}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/,'')); setErrors(p => ({...p, phone: ''})) }}
                  />
                  {errors.phone && <span className={styles.errMsg}>{errors.phone}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}><Mail size={13} /> Email (optional)</label>
                  <input
                    className={styles.input + (errors.email ? ' ' + styles.inputErr : '')}
                    placeholder="yourname@email.com"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})) }}
                  />
                  {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className={styles.summarySide}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            {items.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <span className={styles.summaryEmoji}>{item.images?.[0] ? <img src={item.images[0]} style={{width:42,height:42,objectFit:'cover',borderRadius:8}} alt={item.name} /> : item.img}</span>
                <div className={styles.summaryInfo}>
                  <div className={styles.summaryName}>{item.name}</div>
                  <div className={styles.summaryQty}>Qty: {item.qty}</div>
                  {item.selectedColor && (
                    <div style={{display:'flex',alignItems:'center',gap:5,marginTop:3}}>
                      <span style={{width:12,height:12,borderRadius:'50%',background:item.selectedColor.hex,border:'1px solid #e3e8f0',display:'inline-block'}}></span>
                      <span style={{fontSize:11,color:'#62727b'}}>{item.selectedColor.name}</span>
                    </div>
                  )}
                  {item.paymentMode === 'emi' && item.emiPlan && (
                    <div style={{fontSize:11,color:'#1a237e',fontWeight:600,marginTop:2}}>EMI: {item.emiPlan.months} months · ₹{Math.ceil(item.price * (1 + item.emiPlan.rate/100) / item.emiPlan.months)}/mo</div>
                  )}
                </div>
                <div className={styles.summaryPrice}>{formatPrice(item.price * item.qty)}</div>
              </div>
            ))}

            <div className={styles.sDivider} />

            <div className={styles.sRow}><span>Total MRP</span><span>{formatPrice(items.reduce((s,i) => s + i.originalPrice * i.qty, 0))}</span></div>
            <div className={styles.sRow + ' ' + styles.sDisc}><span>Discount</span><span>− {formatPrice(totalDiscount)}</span></div>
            <div className={styles.sRow}><span>Delivery</span><span className={styles.sFree}>FREE</span></div>

            <div className={styles.sDivider} />

            <div className={styles.sTotal}>
              <span>Total Amount</span>
              <span className={styles.sTotalPrice}>{formatPrice(totalPrice)}</span>
            </div>

            {orderType === 'pickup' && (
              <div className={styles.sGift}><Gift size={13} /> Free Gift included at pickup!</div>
            )}

            <button
              className={styles.submitBtn + ' ' + (submitting ? styles.submitting : '')}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? '⏳ Confirming...' : 'Confirm Booking →'}
            </button>

            <p className={styles.submitNote}>
              By confirming, you agree to be contacted by our team for order verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
