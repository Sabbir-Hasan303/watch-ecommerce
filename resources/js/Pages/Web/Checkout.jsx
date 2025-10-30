import React from "react"
import { useState } from "react"
import { Link, Head } from "@inertiajs/react"
import { ChevronLeft } from "lucide-react"
import GuestLayout from "@/Layouts/GuestLayout"
import { useCart } from "@/contexts/CartContext"

function CheckoutContent() {
    const { items, subtotal } = useCart()

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log("Order submitted:", { formData, items, paymentMethod: "COD" })
        alert("Order placed successfully! You will receive a confirmation email shortly.")
    }

    const shippingCost = 0 // Free shipping
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + shippingCost + tax

    return (
        <div className="max-w-[1440px] mx-auto px-4 py-8">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6">
                <ChevronLeft className="w-5 h-5" />
                <span className="font-semibold">Continue Shopping</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                {/* Left Column - Checkout Form */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Checkout</h1>
                        <p className="text-gray-600 mt-2">Fill in your details to complete your order as a guest.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-semibold mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="123 Main Street"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-semibold mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-semibold mb-2">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="NY"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-semibold mb-2">
                                            ZIP Code
                                        </label>
                                        <input
                                            type="text"
                                            id="zipCode"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="10001"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-semibold mb-2">
                                            Country
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        >
                                            <option value="">Select Country</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <div className="flex items-center gap-3 p-4 border-2 border-black rounded bg-gray-50">
                                <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-black"></div>
                                </div>
                                <div>
                                    <p className="font-semibold">Cash on Delivery (COD)</p>
                                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">More payment options will be available soon.</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 px-6 rounded font-semibold hover:bg-gray-800 transition-colors text-lg"
                        >
                            Place Order - ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </button>
                    </form>
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                        {/* <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              /> */}
                                        <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                                        <p className="text-sm text-gray-600">Color: {item.color}</p>
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        <p className="font-semibold text-sm mt-1">{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax (8%)</span>
                                <span className="font-semibold">
                                    ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                                <span>Total</span>
                                <span>
                                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Checkout() {
    return (
        <GuestLayout>
            <Head title="Checkout" />
            <CheckoutContent />
        </GuestLayout>
    )
}
