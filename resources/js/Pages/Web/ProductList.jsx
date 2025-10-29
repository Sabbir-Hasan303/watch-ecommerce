import { Search, X } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useState } from "react"
import { Head } from "@inertiajs/react"
import GuestLayout from "@/Layouts/GuestLayout"

const categories = ["Economy Watches", "Exotic Watches", "Sport Watches", "Luxury Watches", "SUVs"]

const watches = [
    {
        id: 1,
        name: "Gran Coupe",
        brand: "BMW",
        brandLogo: "https://framerusercontent.com/images/1Foft6i4VQZRXfUB7Q9wB1LPsGE.png",
        image: "https://static.vecteezy.com/system/resources/thumbnails/050/177/034/small_2x/smart-watch-isolated-on-transparent-background-png.png",
        transmission: "Automatic",
        drivetrain: "AWD",
        seats: 2,
        price: 38.0,
    },
    {
        id: 2,
        name: "Fiat 500",
        brand: "Fiat",
        brandLogo: "/placeholder.svg?height=40&width=40",
        image: "/placeholder.svg?height=400&width=600",
        transmission: "Automatic",
        drivetrain: "FWD",
        seats: 2,
        price: 19.0,
    },
    {
        id: 3,
        name: "Fiat 500X",
        brand: "Fiat",
        brandLogo: "/placeholder.svg?height=40&width=40",
        image: "/placeholder.svg?height=400&width=600",
        transmission: "Automatic",
        drivetrain: "FWD",
        seats: 5,
        price: 35.0,
    },
    {
        id: 4,
        name: "BMW 228 Gran Coupe",
        brand: "BMW",
        brandLogo: "/placeholder.svg?height=40&width=40",
        image: "/placeholder.svg?height=400&width=600",
        transmission: "Automatic",
        drivetrain: "AWD",
        seats: 2,
        price: 38.0,
    },
    {
        id: 5,
        name: "Fiat 500",
        brand: "Fiat",
        brandLogo: "/placeholder.svg?height=40&width=40",
        image: "/placeholder.svg?height=400&width=600",
        transmission: "Automatic",
        drivetrain: "FWD",
        seats: 2,
        price: 19.0,
    },
    {
        id: 6,
        name: "Fiat 500X",
        brand: "Fiat",
        brandLogo: "/placeholder.svg?height=40&width=40",
        image: "/placeholder.svg?height=400&width=600",
        transmission: "Automatic",
        drivetrain: "FWD",
        seats: 5,
        price: 35.0,
    },
]

const mockSearchResults = [
    { name: "Lexus LS 500 F-Sport", path: "/watches/2023-lexus-ls-500-f-sport" },
    { name: "Jaguar XF P250SE", path: "/watches/2023-jaguar-xf-p250se" },
    { name: "Audi RS 6 Performance", path: "/watches/2023-audi-rs-6-performance" },
    { name: "Audi S4 Premium", path: "/watches/2023-audi-s4-premium" },
    { name: "Acura Integra Type S", path: "/watches/2022-acura-integra-type-s" },
    { name: "Toyota Corolla Hybrid", path: "/watches/2023-toyota-corolla-hybrid" },
]

export default function ProductList() {
    const [activeCategory, setActiveCategory] = useState("Economy Watches")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredResults = searchQuery
        ? mockSearchResults.filter((result) => result.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : []

    return (
        <GuestLayout>
            <Head title="Product List" />
            <div>
                {/* Header Section with Gradient Background */}
                <div className="relative overflow-hidden h-[267px] pt-[30px] mb-8">
                    <div className="container mx-auto px-4 relative z-10 pt-[64px]">
                        <h1 className="text-[60px] leading-[72px] font-extrabold text-center mb-8 text-black">All Watches</h1>
                        <div className="max-w-xl mx-auto">
                            <div onClick={() => setIsSearchOpen(true)} className="relative flex items-center cursor-pointer">
                                <div className="w-full pl-6 pr-16 py-4 rounded-xl border border-gray-200 bg-white text-base font-medium text-black">
                                    Watch brand, model, and etc.
                                </div>
                                <div className="absolute right-2 bg-black text-white p-3 rounded-lg">
                                    <Search className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-[96%] overflow-hidden absolute right-[24px] -top-[77px] w-[767px] z-3">
                        <div className="absolute inset-0">
                            <img
                                src="/images/design-mode/ZKRqk9FUxPKZdlHAKUUW4lLFIPo(1).png"
                                alt=""
                                className="w-full h-full object-cover object-right-top"
                            />
                        </div>
                    </div>
                    <div
                        className="h-[86%] overflow-hidden absolute left-0 top-0 w-full z-1"
                        style={{
                            background: "linear-gradient(rgb(255, 255, 255) 0%, rgb(242, 242, 242) 100%)",
                        }}
                    ></div>
                </div>

                {isSearchOpen && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/60"
                            onClick={() => {
                                setIsSearchOpen(false)
                                setSearchQuery("")
                            }}
                        />

                        {/* Search Modal */}
                        <div className="relative w-full max-w-xl">
                            {/* Search Input */}
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                                <div className="flex items-center px-6 py-4 border-b border-gray-100">
                                    <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Type watch brand or model"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="flex-1 text-base text-black placeholder:text-gray-400 focus:outline-none"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="ml-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-600" />
                                        </button>
                                    )}
                                </div>

                                {/* Search Results */}
                                {searchQuery && filteredResults.length > 0 && (
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {filteredResults.map((result, index) => (
                                            <Link
                                                key={index}
                                                href={result.path}
                                                className="block px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                onClick={() => {
                                                    setIsSearchOpen(false)
                                                    setSearchQuery("")
                                                }}
                                            >
                                                <div className="font-semibold text-black mb-1">{result.name}</div>
                                                <div className="text-sm text-gray-500">{result.path}</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* No Results */}
                                {searchQuery && filteredResults.length === 0 && (
                                    <div className="px-6 py-8 text-center text-gray-500">No results found</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Filter Tabs */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-3 text-xs rounded-full font-medium transition-colors ${activeCategory === category
                                    ? "bg-black text-white"
                                    : "bg-white shadow-sm text-black hover:text-gray-500"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Watch Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {watches.map((watch) => (
                            <Link
                                key={watch.id}
                                href={route('single-product', { id: watch.id })}
                                className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Watch Image */}
                                <div className="relative aspect-[4/3] overflow-hidden p-4">
                                    <img
                                        src={watch.image || "/placeholder.svg"}
                                        alt={watch.name}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </div>

                                {/* Watch Details */}
                                <div className="px-6 pb-6">
                                    {/* Brand Logo and Name */}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img src={watch.brandLogo || "/placeholder.svg"} alt={watch.brand} className="w-7 h-7 object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-black mb-1">{watch.name}</h3>
                                            <p className="text-sm text-[#6B7AB8]">
                                                {watch.transmission} • {watch.drivetrain}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Seats and Price */}
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-2 bg-gray-100 text-sm font-medium text-black rounded-lg">
                                            {watch.seats} Seats
                                        </span>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-black">${watch.price.toFixed(2)}</span>
                                            <span className="text-sm text-gray-500 ml-1">/ day</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}
