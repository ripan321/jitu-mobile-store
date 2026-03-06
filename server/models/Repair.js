import mongoose from 'mongoose'

const repairSchema = new mongoose.Schema({
  repairId:   { type: String, unique: true },   // e.g. REP-2026-001

  customer: {
    name:  { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
  },

  device:   { type: String, required: true },   // 'Mobile Phone'
  deviceId: { type: String, required: true },   // 'mobile'
  brand:    { type: String, required: true },
  modelNo:  { type: String, default: '' },
  problem:  { type: String, required: true },

  dropDate: { type: String, required: true },
  dropTime: { type: String, required: true },

  estCost: { type: String, default: 'TBD' },
  estTime: { type: String, default: '1–2 Days' },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'inprogress', 'completed', 'cancelled'],
    default: 'pending',
  },

  adminNotes: { type: String, default: '' },
  emailSent:  { type: Boolean, default: false },

}, { timestamps: true })

repairSchema.pre('save', async function (next) {
  if (!this.repairId) {
    const count = await mongoose.model('Repair').countDocuments()
    const year = new Date().getFullYear()
    this.repairId = `REP-${year}-${String(count + 1).padStart(3, '0')}`
  }
  next()
})

export default mongoose.model('Repair', repairSchema)
