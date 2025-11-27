import { useEffect, useMemo, useState } from "react"
import { Head, Link } from "@inertiajs/react"
import { Search, X } from "lucide-react"
import GuestLayout from "@/Layouts/GuestLayout"
import ProductCardDetailed from "@/Components/ProductCardDetailed"
import ProductCardCompact from "@/Components/ProductCardCompact"

export default function ProductList({ products = [], availableCategories = [] }) {
    const [activeCategory, setActiveCategory] = useState("All")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Use passed categories from backend, or extract from products as fallback
    const categoryOptions = useMemo(() => {
        if (availableCategories.length > 0) {
            return ["All", ...availableCategories]
        }
        // Fallback: extract unique categories from products
        const unique = Array.from(new Set(products.map((product) => product.category ?? "Uncategorized")))
        return ["All", ...unique]
    }, [availableCategories, products])

    // Read query parameter and set active category on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const categoryParam = params.get("category")

        if (categoryParam && categoryOptions.includes(categoryParam)) {
            setActiveCategory(categoryParam)
        } else if (!categoryOptions.includes(activeCategory)) {
            setActiveCategory(categoryOptions[0] ?? "All")
        }
    }, [categoryOptions])

    const filteredProducts = useMemo(() => {
        if (activeCategory === "All") {
            return products
        }

        return products.filter((product) => (product.category ?? "Uncategorized") === activeCategory)
    }, [products, activeCategory])

    const filteredResults = useMemo(() => {
        if (!searchQuery) {
            return []
        }

        const query = searchQuery.toLowerCase()

        return products
            .filter((product) => product.name.toLowerCase().includes(query))
            .slice(0, 10)
            .map((product) => ({
                id: product.id,
                name: product.name,
                category: product.category ?? "Uncategorized",
                href: route("single-product", { slug: product.slug }),
            }))
    }, [products, searchQuery])

    const handleCloseSearch = () => {
        setIsSearchOpen(false)
        setSearchQuery("")
    }

    return (
        <GuestLayout>
            <Head title="Product List" />
            <div>
                {/* Header Section with Gradient Background */}
                <div className="relative h-[267px] overflow-hidden pt-[30px] mb-8">
                    <div className="container mx-auto px-4 relative z-10 pt-[64px]">
                        <h1 className="text-[60px] leading-[72px] font-extrabold text-center mb-8 text-black">All Watches</h1>
                        <div className="max-w-xl mx-auto">
                            <div onClick={() => setIsSearchOpen(true)} className="relative flex items-center cursor-pointer">
                                <div className="w-full pl-6 pr-16 py-4 rounded-xl border border-gray-200 bg-white text-base font-medium text-black">
                                    Search product name or category
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
                        <div className="absolute inset-0 bg-black/60" onClick={handleCloseSearch} />

                        <div className="relative w-full max-w-xl">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                                <div className="flex items-center px-6 py-4 border-b border-gray-100">
                                    <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Type product name or category"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="flex-1 text-base text-black placeholder:text-gray-400 focus:outline-none"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="ml-3 p-1 hover:bg-gray-100 rounded-full transition-colors">
                                            <X className="w-5 h-5 text-gray-600" />
                                        </button>
                                    )}
                                </div>

                                {searchQuery && filteredResults.length > 0 && (
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {filteredResults.map((result) => (
                                            <Link
                                                key={result.id}
                                                href={result.href}
                                                className="block px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                onClick={handleCloseSearch}
                                            >
                                                <div className="font-semibold text-black mb-1">{result.name}</div>
                                                <div className="text-sm text-gray-500">{result.category}</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {searchQuery && filteredResults.length === 0 && (
                                    <div className="px-6 py-8 text-center text-gray-500">No results found</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categoryOptions.map((category) => (
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

                    {/* Example usage of ProductCardDetailed - Uncomment to use */}
                    {/* {filteredProducts.length === 0 ? (
                        <div className="py-16 text-center text-gray-500">No products available in this category right now.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {filteredProducts.map((product) => (
                                <ProductCardDetailed key={product.id} product={product} />
                            ))}
                        </div>
                    )} */}

                    {/* Currently using ProductCardCompact */}
                    {filteredProducts.length === 0 ? (
                        <div className="mt-4 py-16 text-center text-gray-500">No products available in this category right now.</div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {filteredProducts.map((product) => (
                                <ProductCardCompact key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    )
}
