import { router } from "@inertiajs/react"
import { useState } from "react"
import CustomerLayout from "@/Layouts/CustomerLayout"
import OrderCard from "@/Pages/Customer/OrderCard"

// Mock orders data
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "Jan 15, 2024",
    status: "delivered",
    items: [
      {
        id: "1",
        name: "2024 Tesla Model S",
        image: "/placeholder.svg?height=80&width=80",
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
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "Jan 20, 2024",
    status: "shipped",
    items: [
      {
        id: "2",
        name: "2024 Tesla Model S",
        image: "/placeholder.svg?height=80&width=80",
        color: "Pearl White",
        quantity: 1,
        price: 52999.99,
      },
    ],
    subtotal: 52999.99,
    shipping: 0,
    total: 52999.99,
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
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "Jan 25, 2024",
    status: "processing",
    items: [
      {
        id: "3",
        name: "2024 Tesla Model S",
        image: "/placeholder.svg?height=80&width=80",
        color: "Deep Blue",
        quantity: 1,
        price: 48999.99,
      },
    ],
    subtotal: 48999.99,
    shipping: 0,
    total: 48999.99,
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
  },
]

export default function Orders() {
  const [filter, setFilter] = useState("all")

  const filteredOrders = mockOrders.filter((order) => {
    if (filter === "new") {
      return order.status === "pending" || order.status === "processing" || order.status === "shipped"
    }
    if (filter === "history") {
      return order.status === "delivered" || order.status === "cancelled"
    }
    return true
  })

  return (
    <CustomerLayout>
      <div>
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === "all" ? "border-b-2 border-black text-black" : "text-gray-600 hover:text-black"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === "new" ? "border-b-2 border-black text-black" : "text-gray-600 hover:text-black"
            }`}
          >
            New Orders
          </button>
          <button
            onClick={() => setFilter("history")}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === "history" ? "border-b-2 border-black text-black" : "text-gray-600 hover:text-black"
            }`}
          >
            Order History
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <div className="border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
