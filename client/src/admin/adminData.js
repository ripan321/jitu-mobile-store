// Mock orders — Phase 2: fetch from MongoDB
export const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Rahul Das', phone: '9876543210', email: 'rahul@gmail.com', product: 'Samsung Galaxy A55 5G', qty: 1, total: 38999, orderType: 'pickup', store: 'Boko (Main Branch)', date: '05 Mar 2026', time: '11:00 AM', status: 'pending',
    paymentMode: 'emi', emiPlan: { months: 9, label: '9 months', rate: 1.5 }, emiMonthly: 4444, selectedColor: { name: 'Awesome Navy', hex: '#1565c0' } },
  { id: 'ORD-002', customer: 'Priya Sharma', phone: '9123456780', email: 'priya@gmail.com', product: 'iPhone 15 128GB', qty: 1, total: 69999, orderType: 'delivery', address: 'Kamrup, Assam', date: '05 Mar 2026', time: '', status: 'confirmed',
    paymentMode: 'cash', emiPlan: null, selectedColor: { name: 'Black', hex: '#1c1c1e' } },
  { id: 'ORD-003', customer: 'Amit Borah', phone: '8765432190', email: '', product: 'HP Victus Gaming Laptop', qty: 1, total: 62499, orderType: 'pickup', store: 'Kamrup', date: '06 Mar 2026', time: '2:00 PM', status: 'ready',
    paymentMode: 'emi', emiPlan: { months: 12, label: '12 months', rate: 1.5 }, emiMonthly: 5469, selectedColor: { name: 'Performance Blue', hex: '#0d47a1' } },
  { id: 'ORD-004', customer: 'Sunita Kalita', phone: '7890123456', email: 'sunita@mail.com', product: 'boAt Airdopes 141', qty: 2, total: 1998, orderType: 'delivery', address: 'Boko, Kamrup Rural', date: '04 Mar 2026', time: '', status: 'delivered',
    paymentMode: 'cash', emiPlan: null, selectedColor: { name: 'Bold Red', hex: '#c62828' } },
  { id: 'ORD-005', customer: 'Deepak Nath', phone: '9988776655', email: '', product: 'IFB 7kg Front Load', qty: 1, total: 34990, orderType: 'pickup', store: 'Boko (Main Branch)', date: '06 Mar 2026', time: '4:00 PM', status: 'pending',
    paymentMode: 'emi', emiPlan: { months: 6, label: '6 months', rate: 0 }, emiMonthly: 5832, selectedColor: { name: 'Silver', hex: '#9e9e9e' } },
  { id: 'ORD-006', customer: 'Rekha Devi', phone: '9001122334', email: 'rekha@gmail.com', product: 'Canon PIXMA G3010', qty: 1, total: 13499, orderType: 'delivery', address: 'Mirza, Assam', date: '03 Mar 2026', time: '', status: 'cancelled',
    paymentMode: 'cash', emiPlan: null, selectedColor: null },
]

export const STATUS_COLORS = {
  pending:   { bg: '#fff8e1', color: '#e65100', label: 'Pending' },
  confirmed: { bg: '#e3f2fd', color: '#1565c0', label: 'Confirmed' },
  ready:     { bg: '#e8f5e9', color: '#2e7d32', label: 'Ready for Pickup' },
  delivered: { bg: '#e0f2f1', color: '#00695c', label: 'Delivered' },
  cancelled: { bg: '#ffebee', color: '#c62828', label: 'Cancelled' },
}
