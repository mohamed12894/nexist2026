import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product, Variant } from '../types'

type CartContextValue = {
  items: CartItem[]; count: number; subtotal: number
  add: (product: Product, variant: Variant, quantity?: number) => void
  update: (variantId: string, quantity: number) => void
  remove: (variantId: string) => void; clear: () => void
}
const CartContext = createContext<CartContextValue | null>(null)
const storageKey = 'nexist-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') as CartItem[] } catch { return [] }
  })
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)) }, [items])
  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    add(product, variant, quantity = 1) {
      setItems(current => {
        const found = current.find(item => item.variant.id === variant.id)
        if (found) return current.map(item => item.variant.id === variant.id ? { ...item, quantity: Math.min(item.quantity + quantity, variant.stock) } : item)
        return [...current, { product, variant, quantity: Math.min(quantity, variant.stock) }]
      })
    },
    update(variantId, quantity) { setItems(current => current.flatMap(item => item.variant.id === variantId ? (quantity > 0 ? [{ ...item, quantity: Math.min(quantity, item.variant.stock) }] : []) : [item])) },
    remove(variantId) { setItems(current => current.filter(item => item.variant.id !== variantId)) },
    clear() { setItems([]) },
  }), [items])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be within CartProvider'); return context }
