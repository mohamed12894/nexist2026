import { supabase } from './supabase'
import type { CheckoutResult, Order, OrderItem, Product, PublicTracking, StoreSetting, TrackingEvent, Variant } from '../types'

const fail = (error: { message: string } | null) => { if (error) throw new Error(error.message) }

export async function getProducts() {
  const { data, error } = await supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false })
  fail(error); return (data ?? []) as Product[]
}
export async function getProduct(slug: string) {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).eq('active', true).single()
  fail(error); return data as Product
}
export async function getVariants(productId: string) {
  const { data, error } = await supabase.from('product_variants').select('*').eq('product_id', productId).order('size')
  fail(error); return (data ?? []) as Variant[]
}
export async function checkout(input: { customer_name: string; phone: string; governorate: string; delegation: string; address: string; notes: string; items: { product_id: string; size: string; quantity: number }[] }) {
  const { data, error } = await supabase.rpc('create_checkout_order', {
    p_customer_name: input.customer_name, p_phone: input.phone, p_governorate: input.governorate,
    p_delegation: input.delegation, p_address: input.address, p_notes: input.notes, p_items: input.items,
  })
  fail(error); return data as CheckoutResult
}
export async function getPublicTracking(trackingToken: string) {
  const { data, error } = await supabase.rpc('get_public_order_tracking', { p_tracking_token: trackingToken.trim() })
  fail(error)
  if (!data) throw new Error('No order was found for this tracking token.')
  return data as PublicTracking
}
export async function isAdmin() { const { data, error } = await supabase.rpc('is_admin'); fail(error); return Boolean(data) }
export async function getAdminProducts() { const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }); fail(error); return (data ?? []) as Product[] }
export async function getAdminVariants() { const { data, error } = await supabase.from('product_variants').select('*').order('size'); fail(error); return (data ?? []) as Variant[] }
export async function getOrders() { const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }); fail(error); return (data ?? []) as Order[] }
export async function getOrderItems(orderId: string) { const { data, error } = await supabase.from('order_items').select('*').eq('order_id', orderId); fail(error); return (data ?? []) as OrderItem[] }
export async function getEvents(orderId: string) { const { data, error } = await supabase.from('tracking_events').select('*').eq('order_id', orderId).order('created_at'); fail(error); return (data ?? []) as TrackingEvent[] }
export async function getSettings() { const { data, error } = await supabase.from('store_settings').select('*').order('key'); fail(error); return (data ?? []) as StoreSetting[] }
