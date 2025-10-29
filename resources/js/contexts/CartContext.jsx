import React from "react"
import { createContext, useContext, useState, useCallback } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
    const [items, setItems] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    const addItem = useCallback((item) => {
        setItems((prevItems) => {
            // Check if item with same color already exists
            const existingItemIndex = prevItems.findIndex((i) => i.name === item.name && i.color === item.color)

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                const newItems = [...prevItems]
                newItems[existingItemIndex].quantity += item.quantity
                return newItems
            } else {
                // Add new item with unique id
                return [...prevItems, { ...item, id: `${Date.now()}-${Math.random()}` }]
            }
        })
        setIsOpen(true)
    }, [])

    const removeItem = useCallback((id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    }, [])

    const updateQuantity = useCallback((id, quantity) => {
        if (quantity < 1) return
        setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const openCart = useCallback(() => {
        setIsOpen(true)
    }, [])

    const closeCart = useCallback(() => {
        setIsOpen(false)
    }, [])

    const isInCart = useCallback(
        (name, color) => {
            return items.some((item) => item.name === name && item.color === color)
        },
        [items],
    )

    const itemCount = items.reduce((total, item) => total + item.quantity, 0)

    const subtotal = items.reduce((total, item) => {
        // Extract numeric value from price string (e.g., "$43.000-$48.500" -> 43000)
        const priceMatch = item.price.match(/\$?([\d,]+)/)
        const price = priceMatch ? Number.parseFloat(priceMatch[1].replace(/,/g, "")) : 0
        return total + price * item.quantity
    }, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                isInCart,
                isOpen,
                openCart,
                closeCart,
                itemCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}
