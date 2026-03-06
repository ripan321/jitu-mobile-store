import mongoose from 'mongoose'

const colorVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex:  { type: String, required: true },
})

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  brand:         { type: String, required: true, trim: true },
  category:      { type: String, required: true, enum: ['mobiles', 'laptops', 'headphones', 'printers', 'appliances'] },
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true, min: 0 },
  badge:         { type: String, default: 'In-Stock' },
  location:      { type: String, default: 'Boko' },
  inStock:       { type: Boolean, default: true },
  images:        [{ type: String }],           // Cloudinary URLs
  img:           { type: String, default: '📱' }, // fallback emoji
  rating:        { type: Number, default: 4.5, min: 0, max: 5 },
  reviews:       { type: Number, default: 0 },
  color:         { type: String, default: '#1a237e' },
  colorVariants: [colorVariantSchema],
  specs:         [{ type: String }],
  description:   { type: String, default: '' },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true })

// Virtual for discount %
productSchema.virtual('discountPct').get(function () {
  return Math.round((this.originalPrice - this.price) / this.originalPrice * 100)
})

productSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Product', productSchema)
