import { X } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import CartItem from "@/Components/CartItem"
import { useEffect } from "react"
import { Link } from "@inertiajs/react"
import Taka from "@/Components/Taka"

export default function CartSidebar() {
    const { items, isOpen, closeCart, itemCount, subtotal } = useCart()

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Shopping Cart ({itemCount})</h2>
                    <button
                        onClick={closeCart}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-semibold">Your cart is empty</p>
                            <p className="text-sm text-gray-400 mt-1">Add items to get started</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {items.map((item) => (
                                <CartItem key={item.id} {...item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 p-6 space-y-4">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-semibold">Subtotal:</span>
                            <div className="flex items-baseline gap-1 font-bold">
                                <Taka color="text-black dark:text-white" size="text-lg" />
                                <span>
                                    {subtotal.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Link href="/checkout">
                            <button className="w-full bg-black text-white py-3 px-6 rounded font-semibold hover:bg-gray-800 transition-colors">
                                Proceed to Checkout
                            </button>
                        </Link>

                        {/* Continue Shopping */}
                        <button
                            onClick={closeCart}
                            className="w-full bg-gray-100 text-black py-3 px-6 rounded font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
