import { Link } from "@inertiajs/react"
import { ArrowRight } from "lucide-react"

export default function Category({ categories = [] }) {
    return (
        <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-16">
            <div className="">
                <h2 className="text-3xl md:text-4xl font-bold mb-12">Check out watch categories</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Category Cards */}
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/watches?category=${category.name}`}
                            className="group block bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* Watch Image */}
                                <div className="mb-6 w-full h-24 flex items-center justify-center">
                                    <img
                                        src={category.image_url || "/placeholder.svg"}
                                        alt={category.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>

                                {/* Category Name */}
                                <h3 className="text-xl font-bold mb-3">{category.name}</h3>

                                {/* Products Count Badge */}
                                {/* <span className="inline-block px-4 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                    {category.products_count || 0} Watches
                                </span> */}
                            </div>
                        </Link>
                    ))}

                    {/* Explore All Card */}
                    <Link
                        href="/product"
                        className="group relative bg-white border border-gray-200 rounded-2xl p-8 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="h-[240px] overflow-hidden absolute right-0 top-0 w-[299px]">
                            <div className="absolute inset-0">
                                <img
                                    src="https://framerusercontent.com/images/8dOekjy88hL0ciTUGlREadNfI.jpeg?scale-down-to=512&width=598&height=480"
                                    alt="design"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                        <div className="relative z-10 flex items-center justify-center h-full">
                            {/* Content */}
                            <div className="relative flex flex-col items-center gap-4">
                                {/* Arrow Button */}
                                <div className="flex-shrink-0 w-14 h-14 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowRight className="w-6 h-6 text-white" />
                                </div>

                                {/* Text */}
                                <h3 className="text-xl font-bold text-left">Explore entire watch collection</h3>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
