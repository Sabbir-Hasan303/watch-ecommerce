import { Link } from "@inertiajs/react"
import { ArrowRight } from "lucide-react"
import { useState, useMemo } from "react"
import { formatMoney, formatRange } from "@/utils/productFormatters"
import PriceDisplay from "./PriceDisplay"
import Taka from "./Taka"

const placeholderImage = "/placeholder.svg?height=400&width=600"

export default function ProductCardCompact({ product, showCategory = true, showColors = true }) {
    const [hoveredColor, setHoveredColor] = useState(null)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const priceDisplay = formatRange(product.priceRange)
    const compareDisplay = formatRange(product.compareAtRange)
    const discountPercentage = typeof product.discount?.percentage === "number" ? product.discount.percentage : null
    const discountAmount = typeof product.discount?.amount === "number" ? product.discount.amount : null
    const discountPercentLabel = discountPercentage !== null ? `${Math.round(discountPercentage)}%` : null
    const discountAmountLabel = discountAmount !== null ? formatMoney(discountAmount) : null
    const colors = product.colors ?? []
    const categoryLabel = product.category ?? "Uncategorized"

    // * Map variants by color for quick lookup with image
    const variantsByColor = useMemo(() => {
        const map = {}
        if (Array.isArray(product.variants)) {
            product.variants.forEach(variant => {
                if (variant.color) {
                    map[variant.color] = variant
                }
            })
        }
        return map
    }, [product.variants])

    // * Get display image - use hovered variant image if available, otherwise primary image
    const displayImage = useMemo(() => {
        if (hoveredColor && variantsByColor[hoveredColor]?.image) {
            const imagePath = variantsByColor[hoveredColor].image
            // * Format storage paths
            if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
                return `/storage/${imagePath}`
            }
            return imagePath
        }
        return product.primaryImage || placeholderImage
    }, [hoveredColor, variantsByColor, product.primaryImage])

    // * Handle smooth transition when color changes
    const handleColorHover = (color) => {
        setIsTransitioning(true)
        setHoveredColor(color)
        setTimeout(() => setIsTransitioning(false), 150)
    }

    const handleColorLeave = () => {
        setIsTransitioning(true)
        setHoveredColor(null)
        setTimeout(() => setIsTransitioning(false), 150)
    }

    return (
        <Link
            href={route("single-product", { slug: product.slug })}
            className="group block rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg"
        >
            <div className="relative h-[240px] lg:h-[240px] xl:h-[280px] rounded-xl overflow-hidden bg-gray-100">
                <img
                    src={displayImage}
                    alt={product.name}
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-105 ${
                        isTransitioning ? 'opacity-0' : 'opacity-100'
                    } transition-opacity duration-150`}
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

            {/* Specs Badges */}
            <div className="mb-6 flex items-center justify-between py-4">
                <div className="flex-1 text-center">
                    <div className="mb-1 text-lg font-bold">{product.sizes?.[0] || 'N/A'}</div>
                    <div className="text-xs text-gray-500">Case Size</div>
                </div>
                <div className="h-12 w-px bg-gray-200" />
                <div className="flex-1 text-center">
                    <div className="mb-1 text-lg font-bold">{product.materials?.[0] || 'N/A'}</div>
                    <div className="text-xs text-gray-500">Material</div>
                </div>
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
                        <span className="min-w-[120px] text-gray-600">Colors</span>
                        {colors.length ? (
                            <div className="flex flex-wrap items-center gap-2.5">
                                {colors.map((color, index) => {
                                    const hasVariantImage = variantsByColor[color]?.image
                                    const isHovered = hoveredColor === color

                                    return (
                                        <button
                                            key={`${product.id}-color-${index}`}
                                            onMouseEnter={() => handleColorHover(color)}
                                            onMouseLeave={() => handleColorLeave()}
                                            onClick={(e) => e.preventDefault()}
                                            className={`relative h-6 w-6 rounded-full transition-all duration-200 ${
                                                isHovered
                                                    ? 'ring-2 ring-offset-2 ring-black scale-110 shadow-lg'
                                                    : 'ring-1 ring-gray-300 hover:ring-gray-500 hover:scale-105'
                                            } ${hasVariantImage ? 'cursor-pointer' : 'cursor-default'}`}
                                            style={{ backgroundColor: color }}
                                            title={hasVariantImage ? `View ${color} variant` : color}
                                        >
                                            {/* * Indicator dot for variants with images */}
                                            {hasVariantImage && (
                                                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white shadow-md" />
                                            )}
                                        </button>
                                    )
                                })}
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

