import { useState } from 'react'
import { Wrench, Zap, Phone, Shield, Clock, X, MapPin } from 'lucide-react'
import { REPAIR_SERVICES } from '../../data/categories'
import { LOCATIONS } from '../../data/locations'
import RepairBookingModal from './RepairBookingModal'
import styles from './RepairHighlight.module.css'

// ── CALL TECHNICIAN MODAL ──
function CallModal({ onClose }) {
  return (
    <div className={styles.callOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.callModal}>
        <div className={styles.callHeader}>
          <div className={styles.callTitle}><Phone size={16} /> Call Our Technician</div>
          <button className={styles.callClose} onClick={onClose}><X size={16} /></button>
        </div>
        <p className={styles.callSub}>Call any of our store locations directly — we're open 10AM–7PM, Mon–Sun.</p>
        <div className={styles.callList}>
          {LOCATIONS.map(loc => (
            <a
              key={loc.id}
              href={`tel:${loc.phone.replace(/[^+\d]/g, '')}`}
              className={styles.callCard}
            >
              <div className={styles.callCardLeft}>
                <MapPin size={14} color="#1a237e" />
                <div>
                  <div className={styles.callLocName}>{loc.label}{loc.isMain && <span className={styles.mainTag}>Main</span>}</div>
                  <div className={styles.callPhone}>{loc.phone}</div>
                </div>
              </div>
              <div className={styles.callBtn}><Phone size={13} /> Call Now</div>
            </a>
          ))}
        </div>
        <div className={styles.callNote}>📍 Walk-ins welcome · Repair estimates are free</div>
      </div>
    </div>
  )
}

export default function RepairHighlight() {
  const [showBooking, setShowBooking] = useState(false)
  const [showCall, setShowCall]       = useState(false)

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}><Wrench size={12} /> EXPERT SERVICE CENTRE</div>
            <h2 className={styles.title}>Device Repair You Can Trust</h2>
            <p className={styles.sub}>
              Screen cracked? Battery draining? We fix all brands — same day for most repairs.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {REPAIR_SERVICES.map((s) => (
            <div key={s.title} className={styles.card}>
              {s.tag && <div className={styles.tag}>{s.tag}</div>}
              <div className={styles.icon}>{s.icon}</div>
              <div className={styles.cardTitle}>{s.title}</div>
              <div className={styles.meta}><Clock size={11} /> {s.time}</div>
              <div className={styles.price}>{s.price}</div>
            </div>
          ))}
        </div>

        <div className={styles.ctas}>
          <button className={styles.btnPrimary} onClick={() => setShowBooking(true)}>
            <Zap size={16} /> Book a Diagnosis
          </button>
          <button className={styles.btnOutline} onClick={() => setShowCall(true)}>
            <Phone size={16} /> Call Our Technician
          </button>
        </div>

        <div className={styles.warranty}>
          <Shield size={14} />
          <span>All repairs come with a <strong>12-month warranty</strong> on parts &amp; labour. 200+ device models supported.</span>
        </div>
      </div>

      {showBooking && <RepairBookingModal onClose={() => setShowBooking(false)} />}
      {showCall    && <CallModal onClose={() => setShowCall(false)} />}
    </section>
  )
}
