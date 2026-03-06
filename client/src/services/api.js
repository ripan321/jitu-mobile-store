// ── API BASE ──
const BASE = '/api'

const getToken = () => sessionStorage.getItem('jitu_admin_token')

const headers = (auth = false) => ({
  'Content-Type': 'application/json',
  ...(auth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
})

const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'API error')
  return data
}

// ════════════════════════════════
// AUTH
// ════════════════════════════════
export const apiLogin = (email, password) =>
  handle(fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  }))

export const apiGetMe = () =>
  handle(fetch(`${BASE}/auth/me`, { headers: headers(true) }))

// ════════════════════════════════
// PRODUCTS
// ════════════════════════════════
export const apiGetProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return handle(fetch(`${BASE}/products${qs ? '?' + qs : ''}`))
}

export const apiGetProduct = (id) =>
  handle(fetch(`${BASE}/products/${id}`))

export const apiCreateProduct = (formData) =>
  handle(fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }, // NO Content-Type for multipart
    body: formData,
  }))

export const apiUpdateProduct = (id, formData) =>
  handle(fetch(`${BASE}/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  }))

export const apiDeleteProduct = (id) =>
  handle(fetch(`${BASE}/products/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  }))

export const apiToggleStock = (id) =>
  handle(fetch(`${BASE}/products/${id}/stock`, {
    method: 'PATCH',
    headers: headers(true),
  }))

// ════════════════════════════════
// ORDERS
// ════════════════════════════════
export const apiPlaceOrder = (orderData) =>
  handle(fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(orderData),
  }))

export const apiGetOrders = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return handle(fetch(`${BASE}/orders${qs ? '?' + qs : ''}`, { headers: headers(true) }))
}

export const apiUpdateOrderStatus = (orderId, status) =>
  handle(fetch(`${BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: headers(true),
    body: JSON.stringify({ status }),
  }))

export const apiGetOrderStats = () =>
  handle(fetch(`${BASE}/orders/stats/summary`, { headers: headers(true) }))

// ════════════════════════════════
// REPAIRS
// ════════════════════════════════
export const apiBookRepair = (data) =>
  handle(fetch(`${BASE}/repairs`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }))

export const apiGetRepairs = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return handle(fetch(`${BASE}/repairs${qs ? '?' + qs : ''}`, { headers: headers(true) }))
}

export const apiUpdateRepairStatus = (repairId, status) =>
  handle(fetch(`${BASE}/repairs/${repairId}/status`, {
    method: 'PATCH',
    headers: headers(true),
    body: JSON.stringify({ status }),
  }))
