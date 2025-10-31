import React, { useEffect } from "react"
import Navbar from "@/Pages/Web/Navbar"
import Footer from "@/Pages/Web/Footer"
import { CartProvider } from "@/contexts/CartContext"
import CartSidebar from "@/Components/CartSidebar"
import '../../css/app.css'
import { Toaster, toast } from "react-hot-toast"
import { usePage } from '@inertiajs/react'

export default function GuestLayout({ children }) {
    const { flash } = usePage().props

    useEffect(() => {
        // Force light mode for web pages by removing dark class
        document.documentElement.classList.remove('dark')

        // Set Inter font for web pages
        const previous = document.body.style.getPropertyValue("--font-primary")
        document.body.style.setProperty(
            "--font-primary",
            "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
        )

        return () => {
            document.body.style.setProperty("--font-primary", previous)
        }
    }, [])

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success)
        }
        if (flash?.error) {
            toast.error(flash.error)
        }
    }, [flash])

    return (
        <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <CartSidebar />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </CartProvider>
    )
}
