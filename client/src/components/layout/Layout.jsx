import { Outlet } from 'react-router-dom'
import PromoStrip from './PromoStrip'
import Header from './Header'
import NavBar from './NavBar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="jitu-app">
      <PromoStrip />
      <Header />
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
