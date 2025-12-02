import React from "react"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Navbar from "@/Pages/Web/Navbar"
import Footer from "@/Pages/Web/Footer"
import { CartProvider } from "@/contexts/CartContext"
import CartSidebar from "@/Components/CartSidebar"
import Sidebar from "@/Pages/Customer/Sidebar"

export default function CustomerLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <CartProvider>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden mb-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    {/* Two Column Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                        {/* Main Content */}
                        <main className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8">{children}</main>
                    </div>
                </div>
            </div>
            <Footer />
            <CartSidebar />
        </CartProvider>
    )
}
