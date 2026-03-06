import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocationProvider } from './context/LocationContext'
import { CartProvider } from './context/CartContext'
import { RepairBookingsProvider } from './context/RepairBookingsContext'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import BookingPage from './pages/BookingPage'
import RepairServicesPage from './pages/RepairServicesPage'
import StoreLocatorPage from './pages/StoreLocatorPage'
import Admin from './admin/Admin'

export default function App() {
  return (
    <RepairBookingsProvider>
      <LocationProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
            {/* ── ADMIN (separate from main layout) ── */}
            <Route path="/admin" element={<Admin />} />

            {/* ── STORE FRONT ── */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:category" element={<ProductsPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="booking" element={<BookingPage />} />
              <Route path="repair" element={<RepairServicesPage />} />
              <Route path="stores" element={<StoreLocatorPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </LocationProvider>
    </RepairBookingsProvider>
  )
}
