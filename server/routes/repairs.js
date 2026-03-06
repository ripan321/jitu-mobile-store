import express from 'express'
import { protect } from '../middleware/auth.js'
import Repair from '../models/Repair.js'
import { sendRepairEmailToAdmin, sendRepairConfirmationToCustomer } from '../utils/email.js'

const router = express.Router()

// POST /api/repairs — customer books repair
router.post('/', async (req, res) => {
  try {
    const repair = await Repair.create(req.body)

    try {
      await sendRepairEmailToAdmin(repair)
      await sendRepairConfirmationToCustomer(repair)
      repair.emailSent = true
      await repair.save()
    } catch (emailErr) {
      console.error('Email error (repair still saved):', emailErr.message)
    }

    res.status(201).json({ success: true, repairId: repair.repairId, repair })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// GET /api/repairs — admin: get all repair bookings
router.get('/', protect, async (req, res) => {
  const { status, search } = req.query
  const filter = {}
  if (status && status !== 'all') filter.status = status
  if (search) {
    filter.$or = [
      { repairId: new RegExp(search, 'i') },
      { 'customer.name': new RegExp(search, 'i') },
      { 'customer.phone': new RegExp(search, 'i') },
      { problem: new RegExp(search, 'i') },
    ]
  }
  const repairs = await Repair.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, repairs })
})

// PATCH /api/repairs/:id/status — admin: update status
router.patch('/:id/status', protect, async (req, res) => {
  const { status } = req.body
  const allowed = ['pending', 'confirmed', 'inprogress', 'completed', 'cancelled']
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' })

  const repair = await Repair.findOneAndUpdate(
    { repairId: req.params.id },
    { status },
    { new: true }
  )
  if (!repair) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, repair })
})

export default router
