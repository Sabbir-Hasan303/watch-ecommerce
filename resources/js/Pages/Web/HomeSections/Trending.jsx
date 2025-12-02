import { Link } from "@inertiajs/react"
import { ArrowRight } from "lucide-react"
import PriceDisplay from "@/Components/PriceDisplay"

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
                    Explore More Watches
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
                    {trendingProducts.map((watch) => (
                    <Link
                        key={watch.id}
                        href={route('single-product', { slug: watch.slug })}
                        className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                    >
                        {/* Watch Header */}
                        <div className="mb-4">
                            <h3 className="mb-1 text-2xl font-bold">{watch.name}</h3>
                            <p className="text-sm text-gray-500">{watch.brand}</p>
                        </div>

                        {/* Watch Image with Hover Arrow */}
                        <div className="relative mb-6 h-[288px] rounded-xl overflow-hidden flex items-center justify-center bg-gray-100">
                            <img
                                src={watch.image ? `/storage/${watch.image}` : '/images/watches/watch-2.png'}
                                alt={watch.name}
                                className="w-full object-contain rounded-xl"
                            />

                            {/* Hover Arrow Button */}
                            <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-100">
                                <ArrowRight className="h-6 w-6 text-white" />
                            </div>
                        </div>

                        {/* Specs Badges */}
                        <div className="mb-6 flex items-center justify-between py-4">
                            <div className="flex-1 text-center">
                                <div className="mb-1 text-lg font-bold">{watch.caseDiameter || 'N/A'}</div>
                                <div className="text-xs text-gray-500">Case Size</div>
                            </div>
                            <div className="h-12 w-px bg-gray-200" />
                            <div className="flex-1 text-center">
                                <div className="mb-1 text-lg font-bold">{watch.caseMaterial || 'N/A'}</div>
                                <div className="text-xs text-gray-500">Material</div>
                            </div>
                        </div>

                        {/* Detailed Specs */}
                        <div className="mb-6 space-y-3 text-sm">
                            <div className="flex gap-4">
                                <span className="text-gray-600">Case material</span>
                                <span className="font-bold">{watch.caseMaterial || 'N/A'}</span>
                            </div>
                            {watch.color && (
                                <div className="flex gap-4 items-center">
                                    <span className="text-gray-600">Color</span>
                                    <div className="h-5 w-5 rounded-full" style={{ backgroundColor: watch.color }} />
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="pt-4">
                            <PriceDisplay
                                minPrice={watch.minPrice}
                                maxPrice={watch.maxPrice}
                                className="text-2xl font-bold"
                            />
                            <div className="text-xs text-gray-500">Retail price</div>
                        </div>
                    </Link>
                    ))}
                </div>
            )}
        </section>
    )
}
