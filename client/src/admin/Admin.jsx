import { AdminProvider, useAdmin } from './context/AdminContext'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function AdminGate() {
  const { isLoggedIn } = useAdmin()
  return isLoggedIn ? <AdminDashboard /> : <AdminLogin />
}

export default function Admin() {
  return (
    <AdminProvider>
      <AdminGate />
    </AdminProvider>
  )
}
