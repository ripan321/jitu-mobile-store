import { useState, useRef } from 'react'
import { useAdmin } from '../context/AdminContext'
import { MOCK_ORDERS, STATUS_COLORS } from '../adminData'
import { PRODUCTS as INITIAL_PRODUCTS } from '../../data/products'
import { useRepairBookings, REPAIR_STATUS_COLORS } from '../../context/RepairBookingsContext'
import {
  LayoutDashboard, ShoppingBag, Package, LogOut,
  CheckCircle, Clock, Truck, Store, Wrench,
  Plus, Pencil, Trash2, Search, ChevronDown, X, Save,
  ToggleLeft, ToggleRight, Eye, Phone, Mail,
  IndianRupee, ArrowUp, ArrowDown,
  CreditCard, Banknote
} from 'lucide-react'
import { formatPrice } from '../../utils/helpers'
import styles from './AdminDashboard.module.css'

const NAV = [
  { id: 'overview', label: 'Overview',  icon: LayoutDashboard },
  { id: 'orders',   label: 'Orders',    icon: ShoppingBag },
  { id: 'repairs',  label: 'Repairs',   icon: Wrench },
  { id: 'products', label: 'Products',  icon: Package },
]

const statusNext = { pending: 'confirmed', confirmed: 'ready', ready: 'delivered' }

export default function AdminDashboard() {
  const { logout } = useAdmin()
  const { repairBookings, updateRepairStatus } = useRepairBookings()
  const [tab, setTab] = useState('overview')
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState('all')
  const [repairSearch, setRepairSearch] = useState('')
  const [repairFilter, setRepairFilter] = useState('all')
  const [prodSearch, setProdSearch] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [viewOrder, setViewOrder] = useState(null)
  const [viewRepair, setViewRepair] = useState(null)
  const [notification, setNotification] = useState('')

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(''), 3000) }

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length
  const totalOrders = orders.length
  const pendingRepairs = repairBookings.filter(r => r.status === 'pending').length

  // ── ORDER ACTIONS ──
  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    notify('Order status updated!')
  }

  const filteredOrders = orders.filter(o => {
    const matchSearch = !orderSearch || o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase()) || o.product.toLowerCase().includes(orderSearch.toLowerCase())
    const matchFilter = orderFilter === 'all' || o.status === orderFilter
    return matchSearch && matchFilter
  })

  // ── PRODUCT ACTIONS ──
  const toggleStock = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p))
    notify('Stock status updated!')
  }

  const deleteProduct = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
      notify('Product deleted.')
    }
  }

  const saveProduct = (product) => {
    if (product.id) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p))
      notify('Product updated!')
    } else {
      setProducts(prev => [...prev, { ...product, id: Date.now() }])
      notify('Product added!')
    }
    setEditingProduct(null)
    setIsAddingProduct(false)
  }

  const filteredProducts = products.filter(p =>
    !prodSearch || p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.brand.toLowerCase().includes(prodSearch.toLowerCase())
  )

  return (
    <div className={styles.shell}>
      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>
          <div className={styles.brandLogo}>
            <div className={styles.brandIcon}>🛒</div>
            <div>
              <div className={styles.brandName}>Jitu<span>Mobile</span></div>
              <div className={styles.brandRole}>Store Admin</div>
            </div>
          </div>
        </div>

        <nav className={styles.sideNav}>
          {NAV.map(n => {
            const Icon = n.icon
            return (
              <button
                key={n.id}
                className={styles.navItem + ' ' + (tab === n.id ? styles.navActive : '')}
                onClick={() => setTab(n.id)}
              >
                <Icon size={18} />
                <span>{n.label}</span>
                {n.id === 'orders' && pendingCount > 0 && (
                  <span className={styles.navBadge}>{pendingCount}</span>
                )}
                {n.id === 'repairs' && pendingRepairs > 0 && (
                  <span className={styles.navBadge} style={{background:'#00897b'}}>{pendingRepairs}</span>
                )}
              </button>
            )
          })}
        </nav>

        <button className={styles.logoutBtn} onClick={logout}>
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.main}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.pageHeading}>
              {tab === 'overview' && 'Dashboard Overview'}
              {tab === 'orders' && 'Orders Management'}
              {tab === 'repairs' && 'Repair Bookings'}
              {tab === 'products' && 'Product Catalogue'}
            </h1>
            <p className={styles.pageDate}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className={styles.topRight}>
            {notification && (
              <div className={styles.notifToast}><CheckCircle size={14} /> {notification}</div>
            )}
            <div className={styles.adminBadge}>👤 Admin</div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            TAB: OVERVIEW
        ══════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div className={styles.tabContent}>
            {/* Stats row */}
            <div className={styles.statsGrid}>
              <StatCard icon={<IndianRupee size={22} />} label="Total Revenue" value={formatPrice(totalRevenue)} sub="+12% this week" trend="up" color="#1a237e" />
              <StatCard icon={<ShoppingBag size={22} />} label="Total Orders" value={totalOrders} sub={`${pendingCount} pending`} trend="up" color="#00897b" />
              <StatCard icon={<Wrench size={22} />} label="Repair Bookings" value={repairBookings.length} sub={`${pendingRepairs} pending`} trend={pendingRepairs > 2 ? 'down' : 'up'} color="#7b1fa2" />
              <StatCard icon={<CheckCircle size={22} />} label="Delivered" value={deliveredCount} sub="Completed orders" trend="up" color="#1565c0" />
            </div>

            {/* Recent orders table */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Orders</h2>
                <button className={styles.seeAllBtn} onClick={() => setTab('orders')}>See All →</button>
              </div>
              <OrderTable
                orders={orders.slice(0, 5)}
                onStatusChange={updateOrderStatus}
                onView={setViewOrder}
                compact
              />
            </div>

            {/* Low stock / quick stats */}
            <div className={styles.twoColGrid}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Stock Alert</h2>
                </div>
                {products.filter(p => !p.inStock).length === 0 ? (
                  <div className={styles.allGood}><CheckCircle size={18} color="#00897b" /> All products in stock</div>
                ) : (
                  products.filter(p => !p.inStock).map(p => (
                    <div key={p.id} className={styles.stockAlert}>
                      <span>{p.img} {p.name}</span>
                      <span className={styles.outTag}>Out of Stock</span>
                    </div>
                  ))
                )}
              </div>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Orders by Type</h2>
                </div>
                <div className={styles.donutRow}>
                  <div className={styles.donutItem}>
                    <div className={styles.donutCircle} style={{ '--pct': '65%', '--clr': '#1a237e' }}>
                      <span>{orders.filter(o => o.orderType === 'pickup').length}</span>
                    </div>
                    <div className={styles.donutLabel}><Store size={12} /> Pickup</div>
                  </div>
                  <div className={styles.donutItem}>
                    <div className={styles.donutCircle} style={{ '--pct': '35%', '--clr': '#ff6f00' }}>
                      <span>{orders.filter(o => o.orderType === 'delivery').length}</span>
                    </div>
                    <div className={styles.donutLabel}><Truck size={12} /> Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: ORDERS
        ══════════════════════════════════════════ */}
        {tab === 'orders' && (
          <div className={styles.tabContent}>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={15} />
                <input placeholder="Search by customer, order ID, product..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className={styles.searchInput} />
                {orderSearch && <button onClick={() => setOrderSearch('')}><X size={13} /></button>}
              </div>
              <div className={styles.filterChips}>
                {['all', 'pending', 'confirmed', 'ready', 'delivered', 'cancelled'].map(f => (
                  <button key={f} className={styles.chip + ' ' + (orderFilter === f ? styles.chipActive : '')} onClick={() => setOrderFilter(f)}>
                    {f === 'all' ? 'All' : STATUS_COLORS[f]?.label || f}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.sectionCard}>
              <OrderTable orders={filteredOrders} onStatusChange={updateOrderStatus} onView={setViewOrder} />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: REPAIRS
        ══════════════════════════════════════════ */}
        {tab === 'repairs' && (
          <div className={styles.tabContent}>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={15} />
                <input placeholder="Search by name, phone, device, issue..." value={repairSearch} onChange={e => setRepairSearch(e.target.value)} className={styles.searchInput} />
                {repairSearch && <button onClick={() => setRepairSearch('')}><X size={13} /></button>}
              </div>
              <div className={styles.filterChips}>
                {['all','pending','confirmed','inprogress','completed','cancelled'].map(f => (
                  <button key={f} className={styles.chip + (repairFilter === f ? ' ' + styles.chipActive : '')} onClick={() => setRepairFilter(f)}>
                    {f === 'all' ? 'All' : REPAIR_STATUS_COLORS[f]?.label || f}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.sectionCard}>
              <RepairTable
                bookings={repairBookings.filter(r => {
                  const ms = !repairSearch || r.name.toLowerCase().includes(repairSearch.toLowerCase()) || r.phone.includes(repairSearch) || r.device.toLowerCase().includes(repairSearch.toLowerCase()) || r.problem.toLowerCase().includes(repairSearch.toLowerCase()) || r.id.toLowerCase().includes(repairSearch.toLowerCase())
                  const mf = repairFilter === 'all' || r.status === repairFilter
                  return ms && mf
                })}
                onStatusChange={(id, s) => { updateRepairStatus(id, s); notify('Repair status updated!') }}
                onView={setViewRepair}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: PRODUCTS
        ══════════════════════════════════════════ */}
        {tab === 'products' && (
          <div className={styles.tabContent}>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={15} />
                <input placeholder="Search products..." value={prodSearch} onChange={e => setProdSearch(e.target.value)} className={styles.searchInput} />
                {prodSearch && <button onClick={() => setProdSearch('')}><X size={13} /></button>}
              </div>
              <button className={styles.addBtn} onClick={() => { setIsAddingProduct(true); setEditingProduct({ id: null, name: '', brand: '', category: 'mobiles', price: '', originalPrice: '', img: '', images: [], location: 'Boko', inStock: true, color: '#1a237e', specs: [], rating: 4.5, reviews: 0, badge: 'In-Stock' }) }}>
                <Plus size={15} /> Add Product
              </button>
            </div>

            <div className={styles.productTable}>
              <div className={styles.ptHead}>
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>MRP</span>
                <span>Discount</span>
                <span>Location</span>
                <span>Stock</span>
                <span>Actions</span>
              </div>
              {filteredProducts.map(p => {
                const disc = Math.round((p.originalPrice - p.price) / p.originalPrice * 100)
                return (
                  <div key={p.id} className={styles.ptRow}>
                    <div className={styles.ptProduct}>
                      <div className={styles.ptEmoji}>
                        {p.images && p.images[0]
                          ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                          : <span>{p.img || '📦'}</span>
                        }
                      </div>
                      <div>
                        <div className={styles.ptName}>{p.name}</div>
                        <div className={styles.ptBrand}>{p.brand}</div>
                      </div>
                    </div>
                    <span className={styles.ptCat}>{p.category}</span>
                    <span className={styles.ptPrice}>{formatPrice(p.price)}</span>
                    <span className={styles.ptMrp}>{formatPrice(p.originalPrice)}</span>
                    <span className={styles.ptDisc}>{disc}%</span>
                    <span className={styles.ptLoc}>{p.location}</span>
                    <button className={styles.stockToggle + ' ' + (p.inStock ? styles.stockIn : styles.stockOut)} onClick={() => toggleStock(p.id)}>
                      {p.inStock ? <><ToggleRight size={16} /> In Stock</> : <><ToggleLeft size={16} /> Out</>}
                    </button>
                    <div className={styles.ptActions}>
                      <button className={styles.editBtn} onClick={() => setEditingProduct({ ...p })}><Pencil size={14} /></button>
                      <button className={styles.delBtn} onClick={() => deleteProduct(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── ORDER DETAIL MODAL ── */}
      {viewOrder && (
        <Modal onClose={() => setViewOrder(null)}>
          <OrderDetail order={viewOrder} onStatusChange={(id, s) => { updateOrderStatus(id, s); setViewOrder(prev => ({...prev, status: s})) }} />
        </Modal>
      )}

      {viewRepair && (
        <Modal onClose={() => setViewRepair(null)}>
          <RepairDetail repair={viewRepair} onStatusChange={(id, s) => { updateRepairStatus(id, s); setViewRepair(prev => ({...prev, status: s})); notify('Status updated!') }} />
        </Modal>
      )}

      {/* ── PRODUCT EDIT MODAL ── */}
      {(editingProduct || isAddingProduct) && editingProduct && (
        <Modal onClose={() => { setEditingProduct(null); setIsAddingProduct(false) }}>
          <ProductForm product={editingProduct} onSave={saveProduct} onCancel={() => { setEditingProduct(null); setIsAddingProduct(false) }} />
        </Modal>
      )}
    </div>
  )
}

// ── STAT CARD ──
function StatCard({ icon, label, value, sub, trend, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: color + '18', color }}>{icon}</div>
      <div className={styles.statInfo}>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statSub + ' ' + (trend === 'up' ? styles.statUp : styles.statDown)}>
          {trend === 'up' ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {sub}
        </div>
      </div>
    </div>
  )
}

// ── ORDER TABLE ──
function OrderTable({ orders, onStatusChange, onView, compact }) {
  if (orders.length === 0) return <div className={styles.emptyState}>No orders found.</div>
  return (
    <div className={styles.orderTable}>
      <div className={styles.otHead}>
        <span>Order</span>
        <span>Customer</span>
        <span>Product</span>
        <span>Type</span>
        <span>Total</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {orders.map(o => {
        const sc = STATUS_COLORS[o.status]
        const next = statusNext[o.status]
        return (
          <div key={o.id} className={styles.otRow}>
            <div>
              <div className={styles.orderId}>{o.id}</div>
              <div className={styles.orderDate}>{o.date}</div>
            </div>
            <div>
              <div className={styles.custName}>{o.customer}</div>
              <div className={styles.custPhone}>{o.phone}</div>
            </div>
            <div className={styles.prodCell}>{o.product}</div>
            <div>
              {o.orderType === 'pickup'
                ? <span className={styles.typePickup}><Store size={11} /> Pickup</span>
                : <span className={styles.typeDelivery}><Truck size={11} /> Delivery</span>
              }
            </div>
            <div className={styles.orderTotal}>{formatPrice(o.total)}</div>
            <div>
              <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
            </div>
            <div className={styles.orderActions}>
              <button className={styles.viewBtn} onClick={() => onView(o)} title="View Details"><Eye size={14} /></button>
              {next && (
                <button className={styles.advanceBtn} onClick={() => onStatusChange(o.id, next)} title={'Mark as ' + STATUS_COLORS[next]?.label}>
                  ✓
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── ORDER DETAIL MODAL CONTENT ──
function OrderDetail({ order, onStatusChange }) {
  const sc = STATUS_COLORS[order.status]
  const next = statusNext[order.status]
  return (
    <div className={styles.orderDetailModal}>
      <h2 className={styles.modalTitle}>Order Details — {order.id}</h2>
      <div className={styles.odGrid}>
        {/* Customer */}
        <div className={styles.odSection}>
          <div className={styles.odLabel}>Customer</div>
          <div className={styles.odValue}>{order.customer}</div>
          <div className={styles.odMeta}><Phone size={12} /> {order.phone}</div>
          {order.email && <div className={styles.odMeta}><Mail size={12} /> {order.email}</div>}
        </div>

        {/* Product */}
        <div className={styles.odSection}>
          <div className={styles.odLabel}>Product</div>
          <div className={styles.odValue}>{order.product}</div>
          <div className={styles.odMeta}>Qty: {order.qty} · {formatPrice(order.total)}</div>
          {order.selectedColor && (
            <div className={styles.odMeta} style={{ marginTop: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: order.selectedColor.hex, border: '1.5px solid #e3e8f0', display: 'inline-block', marginRight: 5, verticalAlign: 'middle' }} />
              {order.selectedColor.name}
            </div>
          )}
        </div>

        {/* Delivery */}
        <div className={styles.odSection}>
          <div className={styles.odLabel}>Delivery Type</div>
          {order.orderType === 'pickup' ? (
            <>
              <div className={styles.odValue}><Store size={13} /> Pick Up In-Store</div>
              <div className={styles.odMeta}>{order.store}</div>
              <div className={styles.odMeta}>{order.date} at {order.time}</div>
            </>
          ) : (
            <>
              <div className={styles.odValue}><Truck size={13} /> Home Delivery</div>
              <div className={styles.odMeta}>{order.address}</div>
              <div className={styles.odMeta}>{order.date}</div>
            </>
          )}
        </div>

        {/* Status */}
        <div className={styles.odSection}>
          <div className={styles.odLabel}>Status</div>
          <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color, fontSize: 13, padding: '5px 14px' }}>{sc.label}</span>
        </div>
      </div>

      {/* ── PAYMENT SECTION ── full width */}
      <div className={styles.odPaymentSection}>
        <div className={styles.odLabel}>Payment Details</div>
        {order.paymentMode === 'cash' || !order.paymentMode ? (
          <div className={styles.odPayCash}>
            <div className={styles.odPayMode}>
              <Banknote size={18} color="#00897b" />
              <span>Full Payment — Cash / UPI / Card</span>
            </div>
            <div className={styles.odPayTotal}>
              Total to collect: <strong>{formatPrice(order.total)}</strong>
            </div>
          </div>
        ) : (
          <div className={styles.odPayEmi}>
            <div className={styles.odPayMode}>
              <CreditCard size={18} color="#1a237e" />
              <span>EMI Payment Selected</span>
              {order.emiPlan?.rate === 0 && <span className={styles.noCostPill}>No Cost EMI</span>}
            </div>
            <div className={styles.emiDetailGrid}>
              <div className={styles.emiDetailCard}>
                <div className={styles.emiDetailLabel}>Duration</div>
                <div className={styles.emiDetailVal}>{order.emiPlan?.months} months</div>
              </div>
              <div className={styles.emiDetailCard}>
                <div className={styles.emiDetailLabel}>Monthly EMI</div>
                <div className={styles.emiDetailVal + ' ' + styles.emiHighlight}>
                  {formatPrice(order.emiMonthly)}<span style={{fontSize:12,fontWeight:500}}>/mo</span>
                </div>
              </div>
              <div className={styles.emiDetailCard}>
                <div className={styles.emiDetailLabel}>Total Amount</div>
                <div className={styles.emiDetailVal}>{formatPrice(order.total)}</div>
              </div>
              <div className={styles.emiDetailCard}>
                <div className={styles.emiDetailLabel}>Interest Rate</div>
                <div className={styles.emiDetailVal}>
                  {order.emiPlan?.rate === 0
                    ? <span style={{color:'#00897b',fontWeight:700}}>0% — Free!</span>
                    : <span>{order.emiPlan?.rate}% p.a.</span>
                  }
                </div>
              </div>
            </div>
            <div className={styles.emiAdminNote}>
              📋 Verify EMI eligibility with customer's bank card at time of {order.orderType === 'pickup' ? 'pickup' : 'delivery'}.
            </div>
          </div>
        )}
      </div>

      {next && (
        <button className={styles.advanceFullBtn} onClick={() => onStatusChange(order.id, next)}>
          <CheckCircle size={16} /> Mark as {STATUS_COLORS[next]?.label}
        </button>
      )}
      {order.status === 'confirmed' && (
        <button className={styles.cancelFullBtn} onClick={() => onStatusChange(order.id, 'cancelled')}>
          <X size={16} /> Cancel Order
        </button>
      )}
    </div>
  )
}

// ── IMAGE UPLOADER ──
function ImageUploader({ images, onChange }) {
  const MAX = 5
  const MIN = 2
  const inputRef = useRef()

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    const remaining = MAX - images.length
    const toAdd = files.slice(0, remaining)
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        onChange(prev => [...prev, { id: Date.now() + Math.random(), url: ev.target.result, file }])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    const fake = { target: { files, value: '' } }
    handleFiles(fake)
  }

  const removeImg = (id) => onChange(prev => prev.filter(i => i.id !== id))
  const setPrimary = (id) => onChange(prev => {
    const idx = prev.findIndex(i => i.id === id)
    if (idx === 0) return prev
    const arr = [...prev]
    const [item] = arr.splice(idx, 1)
    return [item, ...arr]
  })

  return (
    <div className={styles.imgUploaderWrap}>
      <div className={styles.imgUploaderHeader}>
        <div className={styles.imgUploaderLabel}>
          Product Images *
          <span className={styles.imgCount}>{images.length}/{MAX}</span>
        </div>
        <div className={styles.imgHint}>
          Min 2 · Max 5 images · First image = main display photo · Click any to set as primary
        </div>
      </div>

      <div className={styles.imgGrid}>
        {/* Uploaded previews */}
        {images.map((img, idx) => (
          <div key={img.id} className={styles.imgThumb + (idx === 0 ? ' ' + styles.imgPrimary : '')}>
            <img src={img.url} alt={`product-${idx}`} className={styles.thumbImg} />
            {idx === 0 && <div className={styles.primaryBadge}>⭐ Main</div>}
            <div className={styles.thumbActions}>
              {idx !== 0 && (
                <button
                  className={styles.thumbBtn + ' ' + styles.setPrimaryBtn}
                  onClick={() => setPrimary(img.id)}
                  title="Set as main photo"
                  type="button"
                >
                  ⭐
                </button>
              )}
              <button
                className={styles.thumbBtn + ' ' + styles.removeImgBtn}
                onClick={() => removeImg(img.id)}
                title="Remove"
                type="button"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}

        {/* Add more slot */}
        {images.length < MAX && (
          <div
            className={styles.imgDropzone}
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <div className={styles.dropzoneInner}>
              <div className={styles.dropzoneIcon}>📷</div>
              <div className={styles.dropzoneText}>Click or drag & drop</div>
              <div className={styles.dropzoneSub}>JPG, PNG, WEBP · Max 5MB each</div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFiles}
            />
          </div>
        )}
      </div>

      {images.length > 0 && images.length < MIN && (
        <div className={styles.imgWarning}>⚠️ Please add at least {MIN} images</div>
      )}
      {images.length === MAX && (
        <div className={styles.imgMaxNote}>✅ Maximum {MAX} images reached</div>
      )}
    </div>
  )
}

// ── COLOUR VARIANT MANAGER ──
function ColorVariantManager({ variants, onChange }) {
  const MAX_COLORS = 5

  const addVariant = () => {
    if (variants.length >= MAX_COLORS) return
    onChange([...variants, { name: '', hex: '#1a237e' }])
  }
  const removeVariant = (i) => onChange(variants.filter((_, idx) => idx !== i))
  const updateVariant = (i, key, val) => {
    onChange(variants.map((v, idx) => idx === i ? { ...v, [key]: val } : v))
  }

  return (
    <div className={styles.colorMgrWrap}>
      <div className={styles.colorMgrHeader}>
        <span className={styles.colorMgrTitle}>Colour Variants <span className={styles.imgCount}>{variants.length}/{MAX_COLORS}</span></span>
        <span className={styles.colorMgrHint}>Min 1 · Max {MAX_COLORS} colours</span>
      </div>
      <div className={styles.colorMgrList}>
        {variants.map((v, i) => (
          <div key={i} className={styles.colorMgrRow}>
            <div className={styles.colorMgrSwatch}>
              <input
                type="color"
                value={v.hex || '#1a237e'}
                onChange={e => updateVariant(i, 'hex', e.target.value)}
                className={styles.colorPicker}
                title="Pick colour"
              />
              <div className={styles.colorDotPreview} style={{ background: v.hex || '#1a237e' }} />
            </div>
            <input
              className={styles.colorNameInput}
              value={v.name}
              onChange={e => updateVariant(i, 'name', e.target.value)}
              placeholder={`Colour name, e.g. Midnight Black`}
            />
            <button
              className={styles.removeColorBtn}
              onClick={() => removeVariant(i)}
              type="button"
              title="Remove"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        {variants.length < MAX_COLORS && (
          <button className={styles.addColorBtn} onClick={addVariant} type="button">
            <Plus size={13} /> Add Colour
          </button>
        )}
      </div>
    </div>
  )
}

// ── PRODUCT FORM ──
function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({ ...product })
  const [images, setImages] = useState(
    product.images
      ? product.images.map((url, i) => ({ id: i, url }))
      : []
  )
  const [colorVariants, setColorVariants] = useState(product.colorVariants || [])
  const [imgError, setImgError] = useState('')
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (images.length < 2) {
      setImgError('Please add at least 2 product images')
      return
    }
    setImgError('')
    onSave({
      ...form,
      images: images.map(i => i.url),
      img: images[0]?.url || form.img,
      colorVariants,
    })
  }

  return (
    <div className={styles.productForm}>
      <h2 className={styles.modalTitle}>{form.id ? 'Edit Product' : 'Add New Product'}</h2>

      {/* Image uploader */}
      <ImageUploader images={images} onChange={setImages} />
      {imgError && <div className={styles.imgErrMsg}>{imgError}</div>}

      <div className={styles.formDivider} />

      {/* Product details grid */}
      <div className={styles.formGrid}>
        <div className={styles.fField}>
          <label>Product Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Samsung Galaxy S24" />
        </div>
        <div className={styles.fField}>
          <label>Brand *</label>
          <input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Samsung" />
        </div>
        <div className={styles.fField}>
          <label>Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {['mobiles','laptops','headphones','printers','appliances'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.fField}>
          <label>Selling Price (₹) *</label>
          <input type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} placeholder="38999" />
        </div>
        <div className={styles.fField}>
          <label>MRP / Original Price (₹) *</label>
          <input type="number" value={form.originalPrice} onChange={e => set('originalPrice', Number(e.target.value))} placeholder="42999" />
        </div>
        <div className={styles.fField}>
          <label>Available at Location</label>
          <select value={form.location} onChange={e => set('location', e.target.value)}>
            {['Boko','Kamrup','Mirza','Rangia','All Stores'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className={styles.fField}>
          <label>Badge Label</label>
          <select value={form.badge} onChange={e => set('badge', e.target.value)}>
            {['Best Deal','In-Stock','Hot 🔥','New Launch'].map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className={styles.fField + ' ' + styles.fFull}>
          <label>In Stock?</label>
          <button
            className={styles.stockToggle + ' ' + (form.inStock ? styles.stockIn : styles.stockOut)}
            onClick={() => set('inStock', !form.inStock)}
            type="button"
          >
            {form.inStock ? <><ToggleRight size={16} /> In Stock</> : <><ToggleLeft size={16} /> Out of Stock</>}
          </button>
        </div>
      </div>

      {form.price > 0 && form.originalPrice > 0 && (
        <div className={styles.discPreview}>
          Discount: <strong>{Math.round((form.originalPrice - form.price) / form.originalPrice * 100)}% off</strong>
          &nbsp;· Customer saves <strong>{formatPrice(form.originalPrice - form.price)}</strong>
        </div>
      )}

      <div className={styles.formDivider} />

      {/* Colour Variants */}
      <ColorVariantManager variants={colorVariants} onChange={setColorVariants} />

      <div className={styles.formDivider} />

      {/* Description */}
      <div className={styles.fField + ' ' + styles.fFull}>
        <label style={{ fontSize: 13, fontWeight: 700, color: '#1c2333', marginBottom: 6, display: 'block' }}>
          About This Item (Product Description)
        </label>
        <div className={styles.descHint}>
          Start bullet points with • symbol. Press Enter for new line. Example:<br />
          <code>• 6.6-inch AMOLED display with 120Hz refresh rate</code>
        </div>
        <textarea
          className={styles.descTextarea}
          value={form.description || ''}
          onChange={e => set('description', e.target.value)}
          placeholder={'Write product description here...\n\n• Feature one\n• Feature two\n• Feature three'}
          rows={8}
        />
        <div className={styles.descCount}>{(form.description || '').split('\n').filter(l => l.trim().startsWith('•')).length} bullet points</div>
      </div>

      <div className={styles.formActions}>
        <button className={styles.saveBtn} onClick={handleSave}><Save size={15} /> Save Product</button>
        <button className={styles.cancelBtnModal} onClick={onCancel}><X size={15} /> Cancel</button>
      </div>
    </div>
  )
}

// ── REPAIR TABLE ──
function RepairTable({ bookings, onStatusChange, onView }) {
  const repairNext = { pending: 'confirmed', confirmed: 'inprogress', inprogress: 'completed' }
  if (bookings.length === 0) return <div className={styles.emptyState}>No repair bookings found.</div>
  return (
    <div className={styles.orderTable}>
      <div className={styles.repHead}>
        <span>ID</span><span>Customer</span><span>Device</span><span>Issue</span><span>Drop-off</span><span>Est. Cost</span><span>Status</span><span>Actions</span>
      </div>
      {bookings.map(r => {
        const sc = REPAIR_STATUS_COLORS[r.status] || REPAIR_STATUS_COLORS.pending
        const next = repairNext[r.status]
        return (
          <div key={r.id} className={styles.repRow}>
            <div>
              <div className={styles.orderId}>{r.id}</div>
              <div className={styles.orderDate}>{r.bookedOn}</div>
            </div>
            <div>
              <div className={styles.custName}>{r.name}</div>
              <div className={styles.custPhone}>{r.phone}</div>
            </div>
            <div>
              <div className={styles.custName}>{r.brand} {r.device}</div>
              {r.modelNo && <div className={styles.custPhone}>{r.modelNo}</div>}
            </div>
            <div className={styles.prodCell}>{r.problem}</div>
            <div>
              <div className={styles.custName}>{r.date}</div>
              <div className={styles.custPhone}>{r.time}</div>
            </div>
            <div className={styles.orderTotal} style={{fontSize:13}}>{r.estCost}</div>
            <div><span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color }}>{sc.label}</span></div>
            <div className={styles.orderActions}>
              <button className={styles.viewBtn} onClick={() => onView(r)} title="View Details"><Eye size={14} /></button>
              {next && (
                <button className={styles.advanceBtn} onClick={() => onStatusChange(r.id, next)} title={'Mark as ' + REPAIR_STATUS_COLORS[next]?.label}>✓</button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── REPAIR DETAIL MODAL ──
function RepairDetail({ repair, onStatusChange }) {
  const sc = REPAIR_STATUS_COLORS[repair.status] || REPAIR_STATUS_COLORS.pending
  const repairNext = { pending: 'confirmed', confirmed: 'inprogress', inprogress: 'completed' }
  const next = repairNext[repair.status]
  return (
    <div className={styles.orderDetailModal}>
      <h2 className={styles.modalTitle}>Repair Booking — {repair.id}</h2>
      <div className={styles.odGrid}>
        <div className={styles.odSection}>
          <div className={styles.odLabel}>Customer</div>
          <div className={styles.odValue}>{repair.name}</div>
          <div className={styles.odMeta}><Phone size={12} /> {repair.phone}</div>
          {repair.email && <div className={styles.odMeta}><Mail size={12} /> {repair.email}</div>}
        </div>
        <div className={styles.odSection}>
          <div className={styles.odLabel}>Device</div>
          <div className={styles.odValue}>{repair.brand} {repair.device}</div>
          {repair.modelNo && <div className={styles.odMeta}>Model: {repair.modelNo}</div>}
          <div className={styles.odMeta} style={{marginTop:6}}>🔧 {repair.problem}</div>
        </div>
        <div className={styles.odSection}>
          <div className={styles.odLabel}>Drop-off Schedule</div>
          <div className={styles.odValue}>📅 {repair.date}</div>
          <div className={styles.odMeta}>🕐 {repair.time}</div>
          <div className={styles.odMeta}>⏱️ Est. Time: {repair.estTime}</div>
        </div>
        <div className={styles.odSection}>
          <div className={styles.odLabel}>Status &amp; Cost</div>
          <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color, fontSize:13, padding:'5px 14px' }}>{sc.label}</span>
          <div className={styles.odMeta} style={{marginTop:8}}>💰 Est. Cost: <strong>{repair.estCost}</strong></div>
        </div>
      </div>
      <div className={styles.odPaymentSection}>
        <div className={styles.odLabel}>📧 Admin Email Notification</div>
        <div className={styles.emiAdminNote}>
          When this booking was submitted, an email notification was queued to <strong>admin@jitumobile.com</strong> with full repair details.
          In Phase 2 (backend), this will be sent automatically via Nodemailer.
        </div>
      </div>
      {next && (
        <button className={styles.advanceFullBtn} onClick={() => onStatusChange(repair.id, next)}>
          <CheckCircle size={16} /> Mark as {REPAIR_STATUS_COLORS[next]?.label}
        </button>
      )}
      {repair.status !== 'cancelled' && repair.status !== 'completed' && (
        <button className={styles.cancelFullBtn} onClick={() => onStatusChange(repair.id, 'cancelled')}>
          <X size={16} /> Cancel Booking
        </button>
      )}
    </div>
  )
}

// ── MODAL WRAPPER ──
function Modal({ children, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modalBox}>
        <button className={styles.modalClose} onClick={onClose}><X size={18} /></button>
        {children}
      </div>
    </div>
  )
}
