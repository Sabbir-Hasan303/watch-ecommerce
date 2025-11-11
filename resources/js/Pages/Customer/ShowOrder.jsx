import { Head } from "@inertiajs/react"
import CustomerLayout from "@/Layouts/CustomerLayout"
import { Download, Package, MapPin, CreditCard } from "lucide-react"

const formatDate = (dateString) => {
    if (!dateString) return "--"
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
        new Date(dateString)
    )
}

const formatCurrency = (value) => {
    if (typeof value !== "number") return "$0.00"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

export default function ShowOrder({ order }) {
    if (!order) {
        return (
            <CustomerLayout>
                <Head title="Order Not Found" />
                <div className="text-center py-12">
                    <p className="text-gray-600">Order not found</p>
                </div>
            </CustomerLayout>
        )
    }

    //   const handleDownloadInvoice = () => {
    //     alert("Invoice download functionality will be implemented")
    //   }

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        processing: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    }

    return (
        <CustomerLayout>
            <Head title={`Order #${order.orderNumber}`} />
            <div>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Order #{order.orderNumber}</h1>
                        <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    {/* <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Invoice
          </button> */}
                </div>

                {/* Status */}
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-gray-600" />
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Order Status</p>
                            <span
                                className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-bold mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {order.items?.length > 0 ? (
                            order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                                    <img
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">{item.name}</h3>
                                        {item.variant && (
                                            <div className="text-sm text-gray-600 space-y-0.5">
                                                {item.variant.color && <p>Color: {item.variant.color}</p>}
                                                {item.variant.size && <p>Size: {item.variant.size}</p>}
                                                {item.variant.material && <p>Material: {item.variant.material}</p>}
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                                        {item.quantity > 1 && (
                                            <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)} each</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center py-4">No items in this order</p>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-2 max-w-xs ml-auto">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{order.shippingCost === 0 ? "Free" : formatCurrency(order.shippingCost)}</span>
                            </div>
                            {order.discountTotal > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(order.discountTotal)}</span>
                                </div>
                            )}
                            {order.taxTotal > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>{formatCurrency(order.taxTotal)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-lg font-bold mb-3">Shipping Address</h2>
                            {order.shippingAddress ? (
                                <>
                                    <p className="font-medium">{order.shippingAddress.full_name || order.shippingAddress.name}</p>
                                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                                    <p className="text-gray-600 mt-2">
                                        {order.shippingAddress.address_line || order.shippingAddress.address}
                                        {(order.shippingAddress.city || order.shippingAddress.state || order.shippingAddress.zip_code) && (
                                            <>
                                                <br />
                                                {[
                                                    order.shippingAddress.city,
                                                    order.shippingAddress.state,
                                                    order.shippingAddress.zip_code || order.shippingAddress.zipCode,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </>
                                        )}
                                        {order.shippingAddress.country && (
                                            <>
                                                <br />
                                                {order.shippingAddress.country}
                                            </>
                                        )}
                                        {order.shippingAddress.area && (
                                            <>
                                                <br />
                                                <span className="text-xs uppercase tracking-wide">
                                                    {order.shippingAddress.area === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-600">No shipping address provided</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <CreditCard className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-lg font-bold mb-3">Payment Method</h2>
                            <p className="text-gray-600 capitalize">
                                {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod || "Not specified"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Status:{" "}
                                <span
                                    className={`font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                                        }`}
                                >
                                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
