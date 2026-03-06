import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    )
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalMRP = items.reduce((sum, i) => sum + i.originalPrice * i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const totalDiscount = totalMRP - totalPrice

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, totalItems, totalMRP, totalPrice, totalDiscount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
