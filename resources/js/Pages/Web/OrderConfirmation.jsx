import React from "react"
import { Link, Head } from "@inertiajs/react"
import { CheckCircle, Package, MapPin, Phone, Mail, ArrowRight, Home } from "lucide-react"
import GuestLayout from "@/Layouts/GuestLayout"

export default function OrderConfirmation({ order }) {
    // Use order data from backend, fallback to empty structure if not provided
    const orderData = order || {
        id: "",
        status: "pending",
        createdAt: new Date().toLocaleDateString(),
        items: [],
        shipping: {
            fullName: "",
            phone: "",
            email: "",
            area: "",
            fullAddress: "",
        },
        payment: {
            method: "Cash on Delivery (COD)",
        },
        totals: {
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0,
        },
        specialInstructions: null,
    }

    const formatCurrency = (value) => {
        const numericValue = Number(value) || 0
        return `$${numericValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`
    }

    const areaLabel = orderData.shipping?.area
        ?.split("_")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ") || "N/A"

    return (
        <GuestLayout>
            <Head title="Order Confirmation" />
            <div className="max-w-[1440px] mx-auto px-4 py-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 text-lg">
                        Thank you for your purchase. We've received your order and will begin processing it right away.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                        <Package className="w-5 h-5 text-gray-700" />
                        <span className="font-semibold text-gray-900">Order Number: {orderData.id}</span>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
                        <Link
                            href="/"
                            className=" bg-black text-white py-3 px-4 rounded font-semibold hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                        {/* <Link
                            href="/orders"
                            className=" bg-white text-black py-3 px-4 rounded font-semibold border-2 border-black hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            View Order Status
                            <ArrowRight className="w-5 h-5" />
                        </Link> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                    {/* Left Column - Order Details */}
                    <div className="space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {orderData.items?.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                                        <div className="w-24 h-24 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Color: {item.color}</p>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            <p className="font-semibold text-base mt-2">{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-gray-700" />
                                <h2 className="text-xl font-bold">Shipping Address</h2>
                            </div>
                            <div className="space-y-2 text-gray-700">
                                <p className="font-semibold text-base">{orderData.shipping?.fullName}</p>
                                <p className="text-sm">{orderData.shipping?.fullAddress}</p>
                                <p className="text-sm">{areaLabel}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <Phone className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm">{orderData.shipping?.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm">{orderData.shipping?.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <div className="flex items-center gap-3 p-4 border-2 border-black rounded bg-gray-50">
                                <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-black"></div>
                                </div>
                                <div>
                                    <p className="font-semibold">{orderData.payment?.method || "Cash on Delivery (COD)"}</p>
                                    <p className="text-sm text-gray-600">Payment will be collected upon delivery</p>
                                </div>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        {orderData.specialInstructions && (
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4">Special Instructions</h2>
                                <p className="text-gray-700">{orderData.specialInstructions}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-16">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">
                                        {formatCurrency(orderData.totals?.subtotal || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span
                                        className={`font-semibold ${(orderData.totals?.shipping || 0) <= 0 ? "text-green-600" : "text-gray-800"
                                            }`}
                                    >
                                        {(orderData.totals?.shipping || 0) <= 0
                                            ? "Free"
                                            : formatCurrency(orderData.totals?.shipping)}
                                    </span>
                                </div>
                                {orderData.totals?.tax > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-semibold">{formatCurrency(orderData.totals?.tax)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-4">
                                    <span>Total</span>
                                    <span>{formatCurrency(orderData.totals?.total || 0)}</span>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Order Status</span>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold uppercase">
                                        {orderData.status || "Pending"}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Order placed on {orderData.createdAt || new Date().toLocaleDateString()}
                                </p>
                            </div>

                            {/* Next Steps */}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <h3 className="font-semibold text-sm mb-3">What's Next?</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                                        <p>You will receive an email confirmation shortly</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                                        <p>We'll notify you when your order ships</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                                        <p>Expected delivery: 3-5 business days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}

