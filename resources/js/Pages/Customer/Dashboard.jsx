import CustomerLayout from "@/Layouts/CustomerLayout"
import { Package, MapPin, User, ChevronRight } from "lucide-react"
import { Link } from "@inertiajs/react"

const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
}

const formatCurrency = (value) => {
    if (typeof value !== "number") return "$0.00"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

const formatDate = (value) => {
    if (!value) return "--"
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value))
}

export default function Dashboard({ auth, stats, account, recentOrders }) {
    const user = auth?.user

    return (
        <CustomerLayout>
            <div>
                <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                <p className="text-gray-600 mb-8">Overview of your account and recent activity</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Total Orders</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.totalOrders ?? 0}</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Saved Addresses</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats?.savedAddresses ?? 0}</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Account Status</h3>
                        </div>
                        <p className="text-xl font-semibold text-green-600">{stats?.accountStatus ?? "Active"}</p>
                    </div>
                </div>

                {/* Account Info */}
                <div className="border border-gray-200 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Account Information</h2>
                        <Link
                            href="/customer/profile"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            Edit Profile
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Name</p>
                            <p className="font-medium">{account?.name || user?.name || "Not available"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Email</p>
                            <p className="font-medium">{account?.email || "Not available"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Phone</p>
                            <p className="font-medium">{account?.phone || "Not provided"}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-600 mb-1">Default Address</p>
                            <p className="font-medium">{account?.defaultAddress || "No address on file"}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Recent Orders</h2>
                        <Link
                            href="/customer/orders"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            View All
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {recentOrders?.length ? (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/customer/orders/${order.id}`}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div>
                                        <p className="font-semibold">Order #{order.orderNumber}</p>
                                        <p className="text-sm text-gray-600">{formatDate(order.placedAt)}</p>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div>
                                            <p className="font-semibold">{formatCurrency(order.total)}</p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[order.status] || "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
                            <p className="text-lg font-semibold text-gray-700">No recent orders yet</p>
                            <p className="text-sm text-gray-500 mt-1">When you place an order, it will appear here for quick access.</p>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    )
}


