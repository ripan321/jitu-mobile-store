/**
 * SEED SCRIPT — Run once to set up database
 * Usage: node seed.js
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Admin from './models/Admin.js'
import Product from './models/Product.js'

await connectDB()

// ── CREATE ADMIN ──
const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL })
if (!existingAdmin) {
  await Admin.create({
    name:     process.env.ADMIN_NAME     || 'Jitu Mobile Admin',
    email:    process.env.ADMIN_EMAIL    || 'admin@jitumobile.com',
    password: process.env.ADMIN_PASSWORD || 'JituAdmin@2024',
  })
  console.log('✅ Admin created:', process.env.ADMIN_EMAIL)
} else {
  console.log('ℹ️  Admin already exists:', existingAdmin.email)
}

// ── SEED SAMPLE PRODUCTS ──
const count = await Product.countDocuments()
if (count === 0) {
  await Product.insertMany([
    {
      name: 'Samsung Galaxy A55 5G',
      brand: 'Samsung',
      category: 'mobiles',
      price: 38999,
      originalPrice: 42999,
      badge: 'Best Deal',
      location: 'Boko',
      img: '📱',
      images: [],
      rating: 4.8,
      reviews: 124,
      inStock: true,
      color: '#1565c0',
      colorVariants: [
        { name: 'Awesome Navy', hex: '#1565c0' },
        { name: 'Awesome Iceblue', hex: '#80cbc4' },
        { name: 'Awesome Lilac', hex: '#9575cd' },
      ],
      specs: ['6.6" AMOLED', '50MP Camera', '5000mAh', '5G Ready'],
      description: '• 6.6-inch Super AMOLED display with 120Hz refresh rate\n• 50MP triple camera system with OIS\n• 5000mAh battery with 25W fast charging\n• 5G connectivity across all major Indian networks\n• IP67 dust and water resistance',
    },
    {
      name: 'iPhone 15 128GB',
      brand: 'Apple',
      category: 'mobiles',
      price: 69999,
      originalPrice: 74999,
      badge: 'In-Stock',
      location: 'Kamrup',
      img: '📱',
      images: [],
      rating: 4.9,
      reviews: 87,
      inStock: true,
      color: '#37474f',
      colorVariants: [
        { name: 'Black', hex: '#1c1c1e' },
        { name: 'Pink', hex: '#f4a9b5' },
        { name: 'Yellow', hex: '#f5e642' },
      ],
      specs: ['6.1" Super Retina', '48MP Main', 'A16 Bionic', 'USB-C'],
      description: '• 48MP Main camera with 2x Telephoto\n• A16 Bionic chip — the most powerful chip in any smartphone\n• USB-C connector for universal compatibility\n• Dynamic Island for real-time interactions\n• All-day battery life',
    },
    {
      name: 'HP Victus Gaming Laptop',
      brand: 'HP',
      category: 'laptops',
      price: 62499,
      originalPrice: 72000,
      badge: 'Best Deal',
      location: 'Boko',
      img: '💻',
      images: [],
      rating: 4.7,
      reviews: 53,
      inStock: true,
      color: '#0d47a1',
      colorVariants: [
        { name: 'Mica Silver', hex: '#b0bec5' },
        { name: 'Performance Blue', hex: '#0d47a1' },
      ],
      specs: ['Intel i5 12th Gen', 'RTX 3050', '8GB RAM', '512GB SSD'],
      description: '• Intel Core i5-12th Gen processor\n• NVIDIA GeForce RTX 3050 GPU with ray tracing\n• 15.6-inch FHD 144Hz display\n• 512GB NVMe SSD for fast load times\n• Dual-fan thermal design',
    },
  ])
  console.log('✅ Sample products seeded (3 products)')
} else {
  console.log(`ℹ️  Products already exist (${count} found) — skipping seed`)
}

console.log('\n🎉 Database setup complete!')
console.log('📝 Now run: npm run dev\n')
await mongoose.connection.close()
