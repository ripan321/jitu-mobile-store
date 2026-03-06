import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Gift, ArrowRight } from 'lucide-react'
import { HERO_SLIDES } from '../../data/categories'
import RepairBookingModal from './RepairBookingModal'
import styles from './HeroCarousel.module.css'

const SLIDE_LINKS = [
  '/products/mobiles?brand=Samsung',
  '/products/appliances',
  null, // slide 3 = open booking modal
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [showBooking, setShowBooking] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  const next = () => setCurrent((c) => (c + 1) % HERO_SLIDES.length)

  const handleCta = (i) => {
    if (i === 2) { setShowBooking(true) }
    else { navigate(SLIDE_LINKS[i] || '/products') }
  }

  return (
    <div className={styles.carousel}>
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${i === current ? styles.active : ''}`}
          style={{ background: slide.bg }}
        >
          <div className={styles.content}>
            <div className={styles.badgePill}>{slide.badge}</div>
            <div className={styles.tag}>{slide.tag}</div>
            <h1 className={styles.title}>{slide.title}</h1>
            <p className={styles.sub}>{slide.subtitle}</p>
            <button
              className={styles.cta}
              onClick={() => handleCta(i)}
            >
              <Gift size={16} />
              {slide.cta}
              <ArrowRight size={14} />
            </button>
          </div>
          <div className={styles.emoji}>{slide.emoji}</div>
        </div>
      ))}

      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev}>
        <ChevronLeft size={20} />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next}>
        <ChevronRight size={20} />
      </button>

      <div className={styles.dots}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {showBooking && <RepairBookingModal onClose={() => setShowBooking(false)} />}
    </div>
  )
}
