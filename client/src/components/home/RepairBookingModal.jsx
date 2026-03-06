import { useState } from 'react'
import { X, ChevronRight, Calendar, Clock,
         CheckCircle, Phone, Mail, User, ArrowLeft, Wrench } from 'lucide-react'
import { useRepairBookings } from '../../context/RepairBookingsContext'
import styles from './RepairBookingModal.module.css'

const DEVICES = [
  { id: 'mobile',  label: 'Mobile Phone',  icon: '📱', brands: ['Samsung', 'Apple iPhone', 'Redmi / Xiaomi', 'Realme', 'OnePlus', 'Vivo', 'Oppo', 'Motorola', 'Other'] },
  { id: 'laptop',  label: 'Laptop',        icon: '💻', brands: ['HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Apple MacBook', 'Other'] },
  { id: 'printer', label: 'Printer',       icon: '🖨️', brands: ['Canon', 'Epson', 'HP', 'Brother', 'Other'] },
  { id: 'tablet',  label: 'Tablet',        icon: '📟', brands: ['Samsung', 'Apple iPad', 'Lenovo', 'Other'] },
]

const PROBLEMS = {
  mobile:  ['Screen Cracked / Broken', 'Battery Draining Fast', 'Water Damage', 'Charging Port Not Working', 'Camera Issue', 'Speaker / Mic Problem', 'Software / Hanging', 'Back Glass Broken', 'Other Issue'],
  laptop:  ['Screen Damage', 'Battery Not Charging', 'Keyboard Not Working', 'Overheating / Fan Noise', 'Slow Performance', 'Wi-Fi / Bluetooth Issue', 'Hinge Broken', 'Liquid Damage', 'Other Issue'],
  printer: ['Not Printing', 'Paper Jam', 'Ink Issue', 'Wi-Fi Not Connecting', 'Print Quality Poor', 'Making Noise', 'Other Issue'],
  tablet:  ['Screen Cracked', 'Battery Issue', 'Charging Problem', 'Software Issue', 'Speaker Issue', 'Other Issue'],
}

const SERVICE_CHARGES = {
  mobile:  { label: 'Mobile Diagnosis', charge: 99,  note: 'Waived if repaired' },
  laptop:  { label: 'Laptop Diagnosis', charge: 199, note: 'Waived if repaired' },
  printer: { label: 'Printer Check',    charge: 149, note: 'Waived if repaired' },
  tablet:  { label: 'Tablet Diagnosis', charge: 99,  note: 'Waived if repaired' },
}

const REPAIR_ESTIMATES = {
  'Screen Cracked / Broken':    { label: 'Screen Replacement', from: 799,  time: 'Same Day' },
  'Battery Draining Fast':      { label: 'Battery Replacement', from: 499,  time: '2–3 Hours' },
  'Water Damage':               { label: 'Water Damage Recovery', from: 0,   time: '24–48 Hours', free: true },
  'Charging Port Not Working':  { label: 'Charging Port Fix', from: 349,  time: 'Same Day' },
  'Screen Damage':              { label: 'Screen Replacement', from: 1499, time: '1–2 Days' },
  'Battery Not Charging':       { label: 'Battery Service', from: 799,  time: 'Same Day' },
  'Not Printing':               { label: 'Printer Service', from: 399,  time: '1 Day' },
  'Paper Jam':                  { label: 'Printer Cleaning', from: 299,  time: 'Same Day' },
  'Overheating / Fan Noise':    { label: 'Cooling Service', from: 599,  time: '1 Day' },
  'Slow Performance':           { label: 'Software Tune-up', from: 499,  time: 'Same Day' },
}

const TIME_SLOTS = ['10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']

const getNextDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 6; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push({ date: d, label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) })
  }
  return dates
}

export default function RepairBookingModal({ onClose }) {
  const { addRepairBooking } = useRepairBookings()
  const [step, setStep] = useState(1)
  const [device, setDevice]     = useState(null)
  const [brand, setBrand]       = useState('')
  const [modelNo, setModelNo]   = useState('')
  const [problem, setProblem]   = useState('')
  const [date, setDate]         = useState('')
  const [time, setTime]         = useState('')
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [email, setEmail]       = useState('')
  const [errors, setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [repairId, setRepairId] = useState('')

  const dates = getNextDates()
  const problems = device ? PROBLEMS[device.id] : []
  const svcCharge = device ? SERVICE_CHARGES[device.id] : null
  const estimate = REPAIR_ESTIMATES[problem] || null

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Name required'
    if (!phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit number required'
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Invalid email'
    return e
  }

  // ── Phase 2: replace with real email API (Nodemailer / EmailJS) ──
  const sendAdminEmail = (bookingData) => {
    // In Phase 2 this calls POST /api/repair-bookings which sends email via Nodemailer
    // For now we log the payload that would be sent
    console.log('📧 [Phase 2] Admin email would be sent to: admin@jitumobile.com')
    console.log('Booking payload:', bookingData)
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))

    const estCostStr = estimate
      ? (estimate.free ? 'Free Diagnosis' : `₹${(svcCharge?.charge || 0) + estimate.from}+`)
      : `₹${svcCharge?.charge || 99} (diagnosis only)`

    const bookingData = {
      name, phone, email,
      device: device.label, deviceId: device.id,
      brand, modelNo, problem, date, time,
      estCost: estCostStr,
      estTime: estimate?.time || '1–2 Days',
    }

    const id = addRepairBooking(bookingData)
    setRepairId(id)
    sendAdminEmail({ ...bookingData, id })

    setSubmitting(false)
    setStep(5)
  }

  const stepTitles = ['', 'Select Device', 'Describe Problem', 'Choose Schedule', 'Your Details', 'Confirmed!']

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {step > 1 && step < 5 && (
              <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <div className={styles.headerTitle}>
                <Wrench size={15} /> Book a Diagnosis
              </div>
              <div className={styles.headerSub}>{stepTitles[step]}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Progress bar */}
        {step < 5 && (
          <div className={styles.progress}>
            {[1,2,3,4].map(s => (
              <div key={s} className={styles.progressStep + (s <= step ? ' ' + styles.progressActive : '')}>
                <div className={styles.progressDot}>{s < step ? '✓' : s}</div>
                <div className={styles.progressLabel}>{['Device','Problem','Schedule','Details'][s-1]}</div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.body}>

          {/* ── STEP 1: DEVICE ── */}
          {step === 1 && (
            <div>
              <p className={styles.stepDesc}>What device needs repair?</p>
              <div className={styles.deviceGrid}>
                {DEVICES.map(d => (
                  <button
                    key={d.id}
                    className={styles.deviceCard + (device?.id === d.id ? ' ' + styles.deviceSelected : '')}
                    onClick={() => { setDevice(d); setBrand(''); setModelNo(''); setProblem('') }}
                  >
                    <span className={styles.deviceEmoji}>{d.icon}</span>
                    <span className={styles.deviceLabel}>{d.label}</span>
                  </button>
                ))}
              </div>

              {device && (
                <div className={styles.brandSection}>
                  <div className={styles.fieldLabel}>Brand</div>
                  <div className={styles.brandGrid}>
                    {device.brands.map(b => (
                      <button
                        key={b}
                        className={styles.brandChip + (brand === b ? ' ' + styles.brandSelected : '')}
                        onClick={() => setBrand(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <div className={styles.fieldLabel} style={{ marginTop: 14 }}>Model Number <span style={{color:'#90a4ae',fontWeight:400}}>(optional)</span></div>
                  <input
                    className={styles.input}
                    placeholder="e.g. Galaxy A55, iPhone 15, Victus 15..."
                    value={modelNo}
                    onChange={e => setModelNo(e.target.value)}
                  />
                </div>
              )}

              <button
                className={styles.nextBtn}
                disabled={!device || !brand}
                onClick={() => setStep(2)}
              >
                Next — Describe Problem <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 2: PROBLEM ── */}
          {step === 2 && (
            <div>
              <p className={styles.stepDesc}>
                What's the issue with your <strong>{brand} {device?.label}</strong>?
              </p>
              <div className={styles.problemList}>
                {problems.map(p => (
                  <button
                    key={p}
                    className={styles.problemItem + (problem === p ? ' ' + styles.problemSelected : '')}
                    onClick={() => setProblem(p)}
                  >
                    <span>{p}</span>
                    {problem === p && <CheckCircle size={16} color="#1a237e" />}
                  </button>
                ))}
              </div>

              {/* Cost preview */}
              {problem && (
                <div className={styles.costPreview}>
                  <div className={styles.costTitle}>Approximate Cost Estimate</div>
                  <div className={styles.costGrid}>
                    <div className={styles.costRow}>
                      <span>🔍 Diagnosis / Inspection</span>
                      <span className={styles.costAmt}>
                        {svcCharge ? <>₹{svcCharge.charge} <span className={styles.waivedNote}>({svcCharge.note})</span></> : 'Free'}
                      </span>
                    </div>
                    {estimate && (
                      <div className={styles.costRow}>
                        <span>🔧 {estimate.label}</span>
                        <span className={styles.costAmt}>
                          {estimate.free ? <span className={styles.freeBadge}>Free Diagnosis</span> : <>From ₹{estimate.from}</>}
                        </span>
                      </div>
                    )}
                    {estimate && (
                      <div className={styles.costRow}>
                        <span>⏱️ Estimated Time</span>
                        <span className={styles.costTime}>{estimate.time}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.costNote}>
                    * Final cost confirmed after diagnosis. Parts availability may vary.
                  </div>
                </div>
              )}

              <button
                className={styles.nextBtn}
                disabled={!problem}
                onClick={() => setStep(3)}
              >
                Next — Choose Schedule <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 3: SCHEDULE ── */}
          {step === 3 && (
            <div>
              <p className={styles.stepDesc}>When would you like to bring it in?</p>

              <div className={styles.fieldLabel}><Calendar size={13} /> Drop-off Date</div>
              <div className={styles.dateGrid}>
                {dates.map(d => (
                  <button
                    key={d.label}
                    className={styles.dateChip + (date === d.label ? ' ' + styles.dateSelected : '')}
                    onClick={() => setDate(d.label)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className={styles.fieldLabel} style={{marginTop:16}}><Clock size={13} /> Drop-off Time</div>
              <div className={styles.timeGrid}>
                {TIME_SLOTS.map(t => (
                  <button
                    key={t}
                    className={styles.timeChip + (time === t ? ' ' + styles.timeSelected : '')}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                className={styles.nextBtn}
                disabled={!date || !time}
                onClick={() => setStep(4)}
              >
                Next — Contact Details <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 4: CONTACT ── */}
          {step === 4 && (
            <div>
              <p className={styles.stepDesc}>Last step — who should we contact?</p>

              {/* Booking summary */}
              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}><span>📱 Device</span><strong>{brand} {device?.label} {modelNo && '— ' + modelNo}</strong></div>
                <div className={styles.summaryRow}><span>🔧 Issue</span><strong>{problem}</strong></div>
                <div className={styles.summaryRow}><span>📅 Date</span><strong>{date} at {time}</strong></div>
                {estimate && !estimate.free && (
                  <div className={styles.summaryRow}><span>💰 Est. Cost</span><strong>From ₹{svcCharge?.charge + estimate.from}</strong></div>
                )}
              </div>

              <div className={styles.contactFields}>
                <div className={styles.fField}>
                  <label><User size={12} /> Full Name *</label>
                  <input className={styles.input + (errors.name ? ' ' + styles.inputErr : '')} placeholder="Your name" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({...p, name:''})) }} />
                  {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                </div>
                <div className={styles.fField}>
                  <label><Phone size={12} /> Mobile Number *</label>
                  <input className={styles.input + (errors.phone ? ' ' + styles.inputErr : '')} placeholder="10-digit number" maxLength={10} value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/,'')); setErrors(p => ({...p, phone:''})) }} />
                  {errors.phone && <span className={styles.errMsg}>{errors.phone}</span>}
                </div>
                <div className={styles.fField}>
                  <label><Mail size={12} /> Email <span style={{color:'#90a4ae',fontWeight:400}}>(optional)</span></label>
                  <input className={styles.input + (errors.email ? ' ' + styles.inputErr : '')} type="email" placeholder="yourname@email.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email:''})) }} />
                  {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                </div>
              </div>

              <button
                className={styles.submitBtn + (submitting ? ' ' + styles.submitting : '')}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? '⏳ Confirming...' : '✅ Confirm Diagnosis Booking'}
              </button>
            </div>
          )}

          {step === 5 && (
            <div className={styles.confirmedWrap}>
              <div className={styles.confirmedIcon}><CheckCircle size={56} color="#00897b" /></div>
              <h2 className={styles.confirmedTitle}>Booking Confirmed! 🎉</h2>
              <p className={styles.confirmedSub}>Hi <strong>{name}</strong>, your repair booking has been received.</p>
              <div className={styles.repairIdBadge}>Booking ID: <strong>{repairId}</strong></div>
              <div className={styles.confirmedDetails}>
                <div className={styles.confRow}><span>📱 Device</span><span><strong>{brand} {device?.label}</strong>{modelNo && ` — ${modelNo}`}</span></div>
                <div className={styles.confRow}><span>🔧 Issue</span><span>{problem}</span></div>
                <div className={styles.confRow}><span>📅 Drop-off</span><span>{date} at {time}</span></div>
                {estimate && !estimate.free && (
                  <div className={styles.confRow}><span>💰 Est. Cost</span><span>From ₹{(svcCharge?.charge || 0) + estimate.from} <span className={styles.waivedNote}>(diagnosis waived if repaired)</span></span></div>
                )}
                <div className={styles.confRow}><span>📞 Contact</span><span>{phone}</span></div>
              </div>
              <div className={styles.confirmedNote}>
                📞 Our technician will call <strong>{phone}</strong> within 30 minutes to confirm your appointment.
              </div>
              <button className={styles.doneBtn} onClick={onClose}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
