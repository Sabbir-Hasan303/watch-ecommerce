/* global route */

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
    const [items, setItems] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const syncCart = useCallback((cart) => {
        if (!cart) {
            setItems([])
            return
        }

        setItems(Array.isArray(cart.items) ? cart.items : [])
    }, [])

    useEffect(() => {
        let isMounted = true

        const fetchCart = async () => {
            try {
                const { data } = await axios.get(route("cart.show"))
                if (!isMounted) return
                syncCart(data.cart)
            } catch (error) {
                if (import.meta.env?.DEV) {
                    console.error("Failed to load cart", error)
                }
                if (isMounted) {
                    setItems([])
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchCart()

        return () => {
            isMounted = false
        }
    }, [syncCart])

    const addItem = useCallback(
        async ({ productId, productVariantId = null, quantity = 1 }) => {
            try {
                const { data } = await axios.post(route("cart.items.store"), {
                    product_id: productId,
                    product_variant_id: productVariantId,
                    quantity,
                })

                syncCart(data.cart)
                setIsOpen(true)
                // toast.success("Added to cart")

                return data.cart
            } catch (error) {
                if (import.meta.env?.DEV) {
                    console.error("Unable to add item to cart", error)
                }
                const message = error?.response?.data?.message ?? "Unable to add item to cart."
                toast.error(message)
                throw error
            }
        },
        [syncCart],
    )

    const removeItem = useCallback(
        async (id) => {
            try {
                const { data } = await axios.delete(route("cart.items.destroy", id))
                syncCart(data.cart)
            } catch (error) {
                if (import.meta.env?.DEV) {
                    console.error("Unable to remove item from cart", error)
                }
                const message = error?.response?.data?.message ?? "Unable to remove item from cart."
                toast.error(message)
                throw error
            }
        },
        [syncCart],
    )

    const updateQuantity = useCallback(
        async (id, quantity) => {
            if (quantity < 1) {
                return
            }

            try {
                const { data } = await axios.patch(route("cart.items.update", id), {
                    quantity,
                })
                syncCart(data.cart)
            } catch (error) {
                if (import.meta.env?.DEV) {
                    console.error("Unable to update cart item quantity", error)
                }
                const message = error?.response?.data?.message ?? "Unable to update quantity."
                toast.error(message)
                throw error
            }
        },
        [syncCart],
    )

    const clearCart = useCallback(async () => {
        try {
            const { data } = await axios.delete(route("cart.clear"))
            syncCart(data.cart)
        } catch (error) {
            if (import.meta.env?.DEV) {
                console.error("Unable to clear cart", error)
            }
            const message = error?.response?.data?.message ?? "Unable to clear cart."
            toast.error(message)
            throw error
        }
    }, [syncCart])

    const openCart = useCallback(() => {
        setIsOpen(true)
    }, [])

    const closeCart = useCallback(() => {
        setIsOpen(false)
    }, [])

    const isInCart = useCallback(
        (productId, productVariantId) => {
            return items.some(
                (item) => item.productId === productId && (item.productVariantId ?? null) === (productVariantId ?? null),
            )
        },
        [items],
    )

    const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items])

    const subtotal = useMemo(() => {
        const total = items.reduce((sum, item) => {
            const lineTotal = (Number(item.unitPrice) || 0) * item.quantity
            return sum + lineTotal
        }, 0)

        return Math.round(total * 100) / 100
    }, [items])

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
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}
