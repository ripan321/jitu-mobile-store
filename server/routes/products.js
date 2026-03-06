import express from 'express'
import multer from 'multer'
import { protect } from '../middleware/auth.js'
import Product from '../models/Product.js'
import cloudinary from '../config/cloudinary.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

// ── UPLOAD IMAGE TO CLOUDINARY ──
const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ width: 800, quality: 'auto', fetch_format: 'auto' }] },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    )
    stream.end(buffer)
  })

// ════════════════════════════════
// PUBLIC ROUTES
// ════════════════════════════════

// GET /api/products  — all active products (with optional category filter)
router.get('/', async (req, res) => {
  const { category, brand, inStock } = req.query
  const filter = { isActive: true }
  if (category) filter.category = category
  if (brand)    filter.brand    = new RegExp(brand, 'i')
  if (inStock)  filter.inStock  = inStock === 'true'

  const products = await Product.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, count: products.length, products })
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product || !product.isActive)
    return res.status(404).json({ success: false, message: 'Product not found' })
  res.json({ success: true, product })
})

// ════════════════════════════════
// ADMIN ROUTES (protected)
// ════════════════════════════════

// POST /api/products — add product
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}')

    // Upload images to Cloudinary
    let imageUrls = data.images || []
    if (req.files?.length) {
      const uploads = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer, 'jitu-mobile/products')))
      imageUrls = [...uploads, ...imageUrls]
    }

    const product = await Product.create({ ...data, images: imageUrls, img: imageUrls[0] || data.img || '📦' })
    res.status(201).json({ success: true, product })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// PUT /api/products/:id — update product
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}')
    let imageUrls = data.images || []
    if (req.files?.length) {
      const uploads = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer, 'jitu-mobile/products')))
      imageUrls = [...uploads, ...imageUrls]
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...data, images: imageUrls, img: imageUrls[0] || data.img },
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, product })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// DELETE /api/products/:id — soft delete
router.delete('/:id', protect, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
  res.json({ success: true, message: 'Product removed' })
})

// PATCH /api/products/:id/stock — toggle stock
router.patch('/:id/stock', protect, async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ success: false, message: 'Not found' })
  product.inStock = !product.inStock
  await product.save()
  res.json({ success: true, inStock: product.inStock })
})

export default router
