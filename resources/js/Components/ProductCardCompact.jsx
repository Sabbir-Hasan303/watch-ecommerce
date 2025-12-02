import { Link } from "@inertiajs/react"
import { ArrowRight } from "lucide-react"
import { formatMoney, formatRange } from "@/utils/productFormatters"
import PriceDisplay from "./PriceDisplay"
import Taka from "./Taka"

const placeholderImage = "/placeholder.svg?height=400&width=600"

export default function ProductCardCompact({ product, showCategory = true, showColors = true }) {
    const priceDisplay = formatRange(product.priceRange)
    const compareDisplay = formatRange(product.compareAtRange)
    const discountPercentage = typeof product.discount?.percentage === "number" ? product.discount.percentage : null
    const discountAmount = typeof product.discount?.amount === "number" ? product.discount.amount : null
    const discountPercentLabel = discountPercentage !== null ? `${Math.round(discountPercentage)}%` : null
    const discountAmountLabel = discountAmount !== null ? formatMoney(discountAmount) : null
    const colors = product.colors ?? []
    const categoryLabel = product.category ?? "Uncategorized"

    return (
        <Link
            href={route("single-product", { slug: product.slug })}
            className="group block rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg"
        >
            <div className="relative h-[240px] rounded-xl overflow-hidden bg-gray-100">
                <img
                    src={product.primaryImage || placeholderImage}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {discountPercentLabel && (
                    <div className="absolute top-4 right-4 rounded-full bg-red-500/80 px-3 py-1 text-xs font-semibold text-white">
                        -{discountPercentLabel} OFF
                    </div>
                )}
                {/* {discountPercentLabel && (
                    <div className="absolute top-4 right-4 rounded-full bg-blue-500/80 px-3 py-1 text-xs font-semibold text-white">
                        {discountAmountLabel ? `- ${discountAmountLabel}` : ""} OFF
                    </div>
                )} */}

                <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight className="h-6 w-6 text-white" />
                </div>
            </div>

            <div className="mt-4 mb-2 min-h-[60px]">
                <h3 className="text-xl font-bold text-black line-clamp-2">{product.name}</h3>
            </div>
            {showCategory && categoryLabel && (
                <p className="inline-block text-xs bg-blue-100 px-4 py-1 rounded-full mb-2">{categoryLabel}</p>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <div className="flex flex-col flex-wrap items-baseline gap-2">
                        {compareDisplay && (
                            <div className="text-base text-gray-400 line-through flex items-center gap-1">
                                <Taka color='text-gray-400' className='text-base' />
                                <span className="text-base">{compareDisplay}</span>
                            </div>
                        )}
                        {priceDisplay &&
                        <div className="text-xl font-bold text-black flex items-center gap-1">
                            <Taka color='text-black' className='font-bold text-xl' />
                            <span className="text-xl">{priceDisplay}</span>
                        </div>}
                    </div>
                </div>
            </div>

            {showColors && (
                <div className="mb-6 space-y-3 text-sm">
                    <div className="flex gap-4">
                        <span className="min-w-[120px] text-gray-600">Available colors</span>
                        {colors.length ? (
                            <div className="flex flex-wrap items-center gap-3">
                                {colors.map((color, index) => (
                                    <div key={`${product.id}-color-${index}`} className="flex items-center gap-2">
                                        <span
                                            className="h-5 w-5 rounded-full border border-gray-200"
                                            style={{ backgroundColor: color }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="font-bold">—</span>
                        )}
                    </div>
                </div>
            )}
        </Link>
    )
}

