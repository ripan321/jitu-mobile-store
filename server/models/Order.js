import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:          String,
  brand:         String,
  price:         Number,
  originalPrice: Number,
  qty:           { type: Number, default: 1 },
  image:         String,
  selectedColor: { name: String, hex: String },
})

const orderSchema = new mongoose.Schema({
  orderId:     { type: String, unique: true },    // e.g. ORD-2026-001
  customer: {
    name:  { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
  },
  items:       [orderItemSchema],
  orderType:   { type: String, enum: ['pickup', 'delivery'], required: true },

  // Pickup fields
  store:       String,
  pickupDate:  String,
  pickupTime:  String,

  // Delivery fields
  address:     String,
  pincode:     String,
  landmark:    String,

  // Payment
  paymentMode: { type: String, enum: ['cash', 'emi'], default: 'cash' },
  emiPlan: {
    months:  Number,
    rate:    Number,
    monthly: Number,
  },

  // Totals
  totalMRP:      Number,
  totalDiscount: Number,
  totalPrice:    { type: Number, required: true },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },

  adminNotes: { type: String, default: '' },
  emailSent:  { type: Boolean, default: false },

}, { timestamps: true })

// Auto-generate orderId before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments()
    const year = new Date().getFullYear()
    this.orderId = `ORD-${year}-${String(count + 1).padStart(3, '0')}`
  }
  next()
})

export default mongoose.model('Order', orderSchema)
