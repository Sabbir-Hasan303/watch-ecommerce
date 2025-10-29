import React, { useEffect } from "react"
import Navbar from "@/Pages/Web/Navbar"
import Footer from "@/Pages/Web/Footer"
import { CartProvider } from "@/contexts/CartContext"
// import { AuthProvider } from "@/contexts/AuthContext"
import CartSidebar from "@/Components/CartSidebar"
import '../../css/app.css'

export default function GuestLayout({ children }) {
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

  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
      <CartSidebar />
    </CartProvider>
  )
}
