import { Head, usePage } from "@inertiajs/react"
import { useMemo, useState } from "react"
import CustomerLayout from "@/Layouts/CustomerLayout"
import OrderCard from "@/Pages/Customer/OrderCard"

const tabs = [
  { key: "all", label: "All Orders" },
  { key: "new", label: "New Orders" },
  { key: "history", label: "Order History" },
  { key: "cancelled", label: "Cancelled" },
]

export default function Orders({ orders = [], statusGroups = {} }) {
  const { auth } = usePage().props
  const [filter, setFilter] = useState("all")

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders

    const allowedStatuses =
      filter === "cancelled"
        ? ["cancelled"]
        : statusGroups[filter] ?? []

    return orders.filter((order) => allowedStatuses.includes(order.status))
  }, [orders, filter, statusGroups])

  return (
    <CustomerLayout>
      <Head title="My Orders" />
      <div>
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 whitespace-nowrap font-medium transition-colors ${
                filter === tab.key ? "border-b-2 border-black text-black" : "text-gray-600 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <div className="border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600">No orders found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
