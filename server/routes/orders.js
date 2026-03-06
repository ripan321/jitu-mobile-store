import express from 'express'
import { protect } from '../middleware/auth.js'
import Order from '../models/Order.js'
import { sendOrderEmailToAdmin, sendOrderConfirmationToCustomer } from '../utils/email.js'

const router = express.Router()

// POST /api/orders — customer places order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body)

    // Send emails (non-blocking — don't fail order if email fails)
    try {
      await sendOrderEmailToAdmin(order)
      await sendOrderConfirmationToCustomer(order)
      order.emailSent = true
      await order.save()
    } catch (emailErr) {
      console.error('Email error (order still saved):', emailErr.message)
    }

    res.status(201).json({ success: true, orderId: order.orderId, order })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// GET /api/orders — admin: get all orders
router.get('/', protect, async (req, res) => {
  const { status, search, page = 1, limit = 50 } = req.query
  const filter = {}
  if (status && status !== 'all') filter.status = status
  if (search) {
    filter.$or = [
      { orderId: new RegExp(search, 'i') },
      { 'customer.name': new RegExp(search, 'i') },
      { 'customer.phone': new RegExp(search, 'i') },
    ]
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Order.countDocuments(filter)
  res.json({ success: true, orders, total })
})

// GET /api/orders/:id — admin: get single order
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id })
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
  res.json({ success: true, order })
})

// PATCH /api/orders/:id/status — admin: update status
router.patch('/:id/status', protect, async (req, res) => {
  const { status } = req.body
  const allowed = ['pending', 'confirmed', 'ready', 'delivered', 'cancelled']
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' })

  const order = await Order.findOneAndUpdate(
    { orderId: req.params.id },
    { status },
    { new: true }
  )
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
  res.json({ success: true, order })
})

// GET /api/orders/stats/summary — admin dashboard stats
router.get('/stats/summary', protect, async (req, res) => {
  const [total, pending, confirmed, delivered, revenue] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'confirmed' }),
    Order.countDocuments({ status: 'delivered' }),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ])
  res.json({ success: true, stats: { total, pending, confirmed, delivered, revenue: revenue[0]?.total || 0 } })
})

export default router
