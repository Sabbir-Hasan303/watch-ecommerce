import { router } from "@inertiajs/react"
import CustomerLayout from "@/Layouts/CustomerLayout"
import { Download, Package, MapPin, CreditCard } from "lucide-react"

// Mock order data - in production, fetch based on ID
const mockOrder = {
  id: "1",
  orderNumber: "ORD-2024-001",
  date: "Jan 15, 2024",
  status: "delivered",
  items: [
    {
      id: "1",
      name: "2024 Tesla Model S",
      image: "/placeholder.svg?height=100&width=100",
      color: "Midnight Silver",
      quantity: 1,
      price: 45999.99,
    },
  ],
  subtotal: 45999.99,
  shipping: 0,
  total: 45999.99,
  shippingAddress: {
    fullName: "John Doe",
    phone: "+1 234 567 8900",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "USA",
  },
  paymentMethod: "Cash on Delivery",
}

export default function ShowOrder() {

  const handleDownloadInvoice = () => {
    // In production, generate and download PDF invoice
    alert("Invoice download functionality will be implemented")
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <CustomerLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order #{mockOrder.orderNumber}</h1>
            <p className="text-gray-600">Placed on {mockOrder.date}</p>
          </div>
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
        </div>

        {/* Status */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Status</p>
              <span
                className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${statusColors[mockOrder.status]}`}
              >
                {mockOrder.status.charAt(0).toUpperCase() + mockOrder.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {mockOrder.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Color: {item.color}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${mockOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{mockOrder.shipping === 0 ? "Free" : `$${mockOrder.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${mockOrder.total.toFixed(2)}</span>
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
              <p className="font-medium">{mockOrder.shippingAddress.fullName}</p>
              <p className="text-gray-600">{mockOrder.shippingAddress.phone}</p>
              <p className="text-gray-600 mt-2">
                {mockOrder.shippingAddress.address}
                <br />
                {mockOrder.shippingAddress.city}, {mockOrder.shippingAddress.state} {mockOrder.shippingAddress.zipCode}
                <br />
                {mockOrder.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <CreditCard className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold mb-3">Payment Method</h2>
              <p className="text-gray-600">{mockOrder.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
