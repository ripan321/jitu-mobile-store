import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = await Admin.findById(decoded.id).select('-password')
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' })
  }
}
