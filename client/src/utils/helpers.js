// Format price to Indian Rupee format
export const formatPrice = (price) =>
  '₹' + price.toLocaleString('en-IN')

// Calculate discount percentage
export const calcDiscount = (price, originalPrice) =>
  Math.round(((originalPrice - price) / originalPrice) * 100)

// Get badge CSS class
export const getBadgeClass = (badge) => {
  if (badge === 'Best Deal') return 'badge--deal'
  if (badge?.includes('Hot')) return 'badge--hot'
  return 'badge--stock'
}

// Truncate text
export const truncate = (str, n) =>
  str.length > n ? str.slice(0, n) + '...' : str
