import express from 'express'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' })

  const admin = await Admin.findOne({ email })
  if (!admin || !(await admin.matchPassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid email or password' })

  res.json({
    success: true,
    token: signToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email },
  })
})

// GET /api/auth/me — verify token + get admin info
router.get('/me', protect, (req, res) => {
  res.json({ success: true, admin: req.admin })
})

export default router
