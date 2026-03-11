import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'

// Routes
import authRoutes    from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes   from './routes/orders.js'
import repairRoutes  from './routes/repairs.js'

// Connect to MongoDB
await connectDB()

const app = express()

// ── MIDDLEWARE ──
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Rate limiting — protect against spam
app.use('/api/orders',  rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many requests' }))
app.use('/api/repairs', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many requests' }))

// ── ROUTES ──
app.use('/api/auth',     authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/repairs',  repairRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jitu Mobile API is running 🚀', time: new Date() })
})

// One-time seed route — creates admin + sample products
app.get('/api/seed', async (req, res) => {
  try {
    const Admin = (await import('./models/Admin.js')).default
    const Product = (await import('./models/Product.js')).default

    // Create admin
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL })
    if (!existingAdmin) {
      await Admin.create({
        name:     process.env.ADMIN_NAME,
        email:    process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
    }

    // Seed products if empty
    const count = await Product.countDocuments()
    if (count === 0) {
      await Product.insertMany([
        { name: 'Samsung Galaxy A55 5G', brand: 'Samsung', category: 'mobiles', price: 38999, originalPrice: 42999, badge: 'Best Deal', location: 'Boko', img: '📱', rating: 4.8, reviews: 124, inStock: true, color: '#1565c0', colorVariants: [{ name: 'Awesome Navy', hex: '#1565c0' }, { name: 'Awesome Iceblue', hex: '#80cbc4' }], specs: ['6.6" AMOLED', '50MP Camera', '5000mAh', '5G Ready'], description: '• 6.6-inch Super AMOLED display with 120Hz\n• 50MP triple camera with OIS\n• 5000mAh battery with 25W fast charging\n• IP67 dust and water resistance' },
        { name: 'iPhone 15 128GB', brand: 'Apple', category: 'mobiles', price: 69999, originalPrice: 74999, badge: 'In-Stock', location: 'Kamrup', img: '📱', rating: 4.9, reviews: 87, inStock: true, color: '#37474f', colorVariants: [{ name: 'Black', hex: '#1c1c1e' }, { name: 'Pink', hex: '#f4a9b5' }], specs: ['6.1" Super Retina', '48MP Main', 'A16 Bionic', 'USB-C'], description: '• 48MP Main camera with 2x Telephoto\n• A16 Bionic chip\n• USB-C connector\n• Dynamic Island' },
        { name: 'HP Victus Gaming Laptop', brand: 'HP', category: 'laptops', price: 62499, originalPrice: 72000, badge: 'Best Deal', location: 'Boko', img: '💻', rating: 4.7, reviews: 53, inStock: true, color: '#0d47a1', colorVariants: [{ name: 'Mica Silver', hex: '#b0bec5' }], specs: ['Intel i5 12th Gen', 'RTX 3050', '8GB RAM', '512GB SSD'], description: '• Intel Core i5-12th Gen\n• RTX 3050 GPU\n• 144Hz FHD display\n• 512GB NVMe SSD' },
      ])
    }

    res.json({ success: true, message: '✅ Database seeded!', adminEmail: process.env.ADMIN_EMAIL, productsSeeded: count === 0 ? 3 : 0 })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`)
})
