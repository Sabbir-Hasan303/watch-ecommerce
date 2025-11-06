import { Link } from "@inertiajs/react"
import { Package, ChevronRight } from "lucide-react"

export default function OrderCard({ order }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const formatDate = (dateString) => {
    if (!dateString) return "--"
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
      new Date(dateString)
    )
  }

  return (
    <Link
      href={route("customer.orders.show", { orderNumber: order.orderNumber })}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-gray-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{formatDate(order.createdAt)}</p>
            <p className="text-sm text-gray-700">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} • ${order.total.toFixed(2)}
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </Link>
  )
}
