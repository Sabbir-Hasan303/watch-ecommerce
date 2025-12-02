import { Link } from "@inertiajs/react"
import ProductCardCompact from "@/Components/ProductCardCompact"

export default function Trending({ trendingProducts = [] }) {
    return (
        <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-16">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
                <h2 className="text-3xl font-bold">Trending watches</h2>
                <Link
                    href={route('watches-list')}
                    className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                    More
                </Link>
            </div>

            {/* Watches Grid */}
            {trendingProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Trending Products Found</h3>
                        <p className="text-gray-500">Check back soon for trending watches!</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {trendingProducts.map((product) => (
                        <ProductCardCompact key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    )
}
