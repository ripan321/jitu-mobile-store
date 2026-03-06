import { createContext, useContext, useState } from 'react'

const RepairBookingsContext = createContext(null)

// ── Phase 2: replace with MongoDB + API ──
const MOCK_REPAIR_BOOKINGS = [
  {
    id: 'REP-001',
    name: 'Bikash Sharma',
    phone: '9876001234',
    email: 'bikash@gmail.com',
    device: 'Mobile Phone',
    deviceId: 'mobile',
    brand: 'Samsung',
    modelNo: 'Galaxy A55',
    problem: 'Screen Cracked / Broken',
    date: '06 Mar 2026',
    time: '11:00 AM',
    estCost: '₹799–₹1,499',
    estTime: 'Same Day',
    status: 'pending',
    bookedOn: '05 Mar 2026',
  },
  {
    id: 'REP-002',
    name: 'Anjali Das',
    phone: '8765900123',
    email: '',
    device: 'Laptop',
    deviceId: 'laptop',
    brand: 'HP',
    modelNo: 'Victus 15',
    problem: 'Battery Not Charging',
    date: '07 Mar 2026',
    time: '2:00 PM',
    estCost: '₹799+',
    estTime: 'Same Day',
    status: 'confirmed',
    bookedOn: '05 Mar 2026',
  },
]

export const REPAIR_STATUS_COLORS = {
  pending:    { bg: '#fff8e1', color: '#e65100', label: 'Pending' },
  confirmed:  { bg: '#e3f2fd', color: '#1565c0', label: 'Confirmed' },
  inprogress: { bg: '#f3e5f5', color: '#7b1fa2', label: 'In Progress' },
  completed:  { bg: '#e8f5e9', color: '#2e7d32', label: 'Completed' },
  cancelled:  { bg: '#ffebee', color: '#c62828', label: 'Cancelled' },
}

export function RepairBookingsProvider({ children }) {
  const [repairBookings, setRepairBookings] = useState(MOCK_REPAIR_BOOKINGS)

  const addRepairBooking = (booking) => {
    const id = 'REP-' + String(repairBookings.length + 1).padStart(3, '0')
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    setRepairBookings(prev => [{ ...booking, id, status: 'pending', bookedOn: today }, ...prev])
    return id
  }

  const updateRepairStatus = (id, status) => {
    setRepairBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  return (
    <RepairBookingsContext.Provider value={{ repairBookings, addRepairBooking, updateRepairStatus }}>
      {children}
    </RepairBookingsContext.Provider>
  )
}

export function useRepairBookings() {
  return useContext(RepairBookingsContext)
}
