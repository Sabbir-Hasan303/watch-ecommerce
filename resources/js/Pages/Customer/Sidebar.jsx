import React from 'react'
import { User } from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'

export default function Sidebar( { sidebarOpen, setSidebarOpen, navItems } ) {
    const page = usePage()
    const currentPathname = page.url
    return (
        <aside
            className={`${sidebarOpen ? "block" : "hidden"
                } lg:block bg-white border border-gray-200 rounded-lg p-6 h-fit`}
        >
            {/* User Profile Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Hello,</p>
                        <p className="font-semibold text-gray-900">
                            {page.props.auth.user?.firstName || "Guest"} {page.props.auth.user?.lastName || ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentPathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
