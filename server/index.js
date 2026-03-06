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
