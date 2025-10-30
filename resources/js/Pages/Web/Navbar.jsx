import { Search, Menu, ShoppingCart, User } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import { Link } from "@inertiajs/react"


export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { itemCount, openCart } = useCart()

    const mainNavItems = [
        { label: "All Watches", href: route('watches-list') },
        { label: "Contact Us", href: route('contact') },
        { label: "Terms", href: route('terms') },
      ];

    const subNavItems = ["Overview", "Tech Specs", "Features", "Similar Watches"]

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Main Navigation */}
            <div className="">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-0">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold text-black">chronos</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-8 lg:flex">
                            {mainNavItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="relative text-sm font-bold text-black transition-colors hover:bg-gray-200 rounded-full px-2 py-1"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-[21px] left-0 h-0.5 w-0 bg-black transition-all duration-300 hover:w-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-4">
                            {/*<button className="text-black hover:text-gray-600" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>*/}
                            <Link href="customer/dashboard" className="text-black hover:text-gray-600" aria-label="User dashboard">
                                <User className="h-5 w-5" />
                            </Link>
                            <button onClick={openCart} className="relative text-black hover:text-gray-600" aria-label="Shopping cart">
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                            <button
                                className="text-black hover:text-gray-600 lg:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="border-t border-gray-200 lg:hidden">
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {mainNavItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="block py-2 text-sm font-bold text-black hover:text-gray-600"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
