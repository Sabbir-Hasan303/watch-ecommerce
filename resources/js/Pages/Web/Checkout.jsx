import React, { useEffect, useMemo, useState } from "react"
import { Link, Head } from "@inertiajs/react"
import { ChevronLeft } from "lucide-react"
import GuestLayout from "@/Layouts/GuestLayout"
import { useCart } from "@/contexts/CartContext"

function CheckoutContent({ shippingOptions = {}, taxSettings = { enabled: false, rate: 0 } }) {
    const { items, subtotal } = useCart()

    const areaOptions = useMemo(() => {
        return Object.keys(shippingOptions).map((key) => {
            const label = key
                .split("_")
                .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
                .join(" ")

            return {
                value: key,
                label,
            }
        })
    }, [shippingOptions])

    const defaultArea = areaOptions[0]?.value ?? ""

    const [formData, setFormData] = useState(() => ({
        fullName: "",
        phone: "",
        email: "",
        area: defaultArea,
        fullAddress: "",
    }))

    useEffect(() => {
        if (!areaOptions.length) {
            return
        }

        const hasCurrentArea = areaOptions.some((option) => option.value === formData.area)

        if (!hasCurrentArea) {
            setFormData((prev) => ({
                ...prev,
                area: defaultArea,
            }))
        }
    }, [areaOptions, defaultArea, formData.area])

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

    const numericSubtotal = Number(subtotal) || 0

    const shippingCost = useMemo(() => {
        if (!formData.area) {
            return 0
        }

        const areaSetting = shippingOptions?.[formData.area]

        if (!areaSetting) {
            return 0
        }

        const standard = typeof areaSetting === "number" ? areaSetting : areaSetting?.standard

        const value = Number.parseFloat(standard ?? 0)

        if (!Number.isFinite(value)) {
            return 0
        }

        return Number(Number(value).toFixed(2))
    }, [formData.area, shippingOptions])

    const taxRate = Number.parseFloat(taxSettings?.rate ?? 0)
    const taxEnabled = Boolean(taxSettings?.enabled)

    const tax = useMemo(() => {
        if (!taxEnabled) {
            return 0
        }

        return Number(((numericSubtotal * taxRate) / 100).toFixed(2))
    }, [numericSubtotal, taxEnabled, taxRate])

    const formatCurrency = (value) => {
        const numericValue = Number(value) || 0
        return `$${numericValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`
    }

    const total = useMemo(() => Number((numericSubtotal + shippingCost + tax).toFixed(2)), [numericSubtotal, shippingCost, tax])

    const shippingDisplay = shippingCost <= 0 ? "Free" : formatCurrency(shippingCost)
    const taxLabel = taxEnabled ? `Tax (${taxRate}% )` : "Tax"
    const taxDisplay = formatCurrency(tax)

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
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold leading-tight">Shipping Address</h2>
                                    <p className="text-sm text-gray-500 mt-1">Enter delivery address</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="example@gmail.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Area
                                        </label>
                                        <select
                                            id="area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                            disabled={!areaOptions.length}
                                        >
                                            {areaOptions.length ? (
                                                areaOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No shipping areas configured</option>
                                            )}
                                        </select>
                                        <span className="text-xs text-gray-500">
                                            Shipping fees may differ by area
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="fullAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Address
                                    </label>
                                    <textarea
                                        id="fullAddress"
                                        name="fullAddress"
                                        value={formData.fullAddress}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                                        placeholder="123 Main Street, City, Country"
                                    />
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
                            Place Order - {formatCurrency(total)}
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
                                <span className="font-semibold">{formatCurrency(numericSubtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className={`font-semibold ${shippingCost <= 0 ? "text-green-600" : "text-gray-800"}`}>
                                    {shippingDisplay}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{taxLabel}</span>
                                <span className="font-semibold">{taxDisplay}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Checkout({ shippingOptions, taxSettings }) {
    return (
        <GuestLayout>
            <Head title="Checkout" />
            <CheckoutContent shippingOptions={shippingOptions} taxSettings={taxSettings} />
        </GuestLayout>
    )
}
