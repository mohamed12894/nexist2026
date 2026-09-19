export type Product = {
  id: string; name: string; slug: string; description: string; price: number; active: boolean
  image_url: string | null; category: string; created_at: string; updated_at: string
}
export type Variant = { id: string; product_id: string; size: string; stock: number }
export type CartItem = { product: Product; variant: Variant; quantity: number }
export type Order = {
  id: string; order_number: string; customer_name: string; phone: string; governorate: string
  delegation: string; address: string; notes: string; subtotal: number; delivery_fee: number
  total: number; status: string; tracking_token: string; estimated_delivery: string | null
  created_at: string; updated_at: string
}
export type OrderItem = {
  id: string; order_id: string; product_id: string; product_name: string; size: string
  quantity: number; unit_price: number; subtotal: number
}
export type TrackingEvent = { id: string; order_id: string; status: string; note: string; created_at: string }
export type PublicTracking = {
  order_number: string; status: string; estimated_delivery: string | null; created_at: string; total: number
  tracking_events: { status: string; note: string; created_at: string }[]
}
export type StoreSetting = { key: string; value: string; updated_at: string }
export type CheckoutResult = { order_number: string; tracking_token: string; total: number; estimated_delivery: string | null }
