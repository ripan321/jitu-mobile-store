import { Store, Truck, Gift } from 'lucide-react'
import styles from './DeliveryOptions.module.css'

export default function DeliveryOptions() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* Option A: Pick Up */}
        <div className={`${styles.card} ${styles.pickup}`}>
          <div className={`${styles.iconWrap} ${styles.iconPickup}`}>
            <Store size={26} />
          </div>
          <div>
            <div className={styles.recommended}>⭐ Recommended</div>
            <div className={styles.label}>Book Online, Pick Up In-Store</div>
            <div className={styles.desc}>
              Reserve your product online and collect it from our nearest store at your
              convenience. No delivery wait — it's ready when you are.
            </div>
            <span className={styles.giftTag}>
              <Gift size={12} />
              Free Gift at Store — Screen Guard, Cable &amp; More!
            </span>
          </div>
        </div>

        {/* Option B: Home Delivery */}
        <div className={`${styles.card} ${styles.delivery}`}>
          <div className={`${styles.iconWrap} ${styles.iconDelivery}`}>
            <Truck size={26} />
          </div>
          <div>
            <div className={styles.label}>Book Online, Home Delivery</div>
            <div className={styles.desc}>
              We deliver to Kamrup &amp; Boko areas. Standard delivery within 1–3 business
              days. Available on select products.
            </div>
            <div className={styles.area}>📍 Delivery area: Kamrup / Boko region</div>
          </div>
        </div>
      </div>
    </section>
  )
}
