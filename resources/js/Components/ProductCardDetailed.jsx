import { Link } from "@inertiajs/react"
import { ArrowRight } from "lucide-react"
import { formatMoney, formatRange } from "@/utils/productFormatters"

const placeholderImage = "/placeholder.svg?height=400&width=600"

export default function ProductCardDetailed({ product }) {
    const priceDisplay = formatRange(product.priceRange)
    const compareDisplay = formatRange(product.compareAtRange)
    const discountPercentage =
        typeof product.discount?.percentage === "number" ? product.discount.percentage : null
    const discountAmount =
        typeof product.discount?.amount === "number" ? product.discount.amount : null
    const discountPercentLabel =
        discountPercentage !== null ? `${Math.round(discountPercentage)}%` : null
    const discountAmountLabel = discountAmount !== null ? formatMoney(discountAmount) : null
    const sizeLabel = product.sizes?.length ? product.sizes.join(", ") : "—"
    const materialLabel = product.materials?.length ? product.materials.join(", ") : "—"
    const colors = product.colors ?? []
    const categoryLabel = product.category ?? "Uncategorized"

    return (
        <Link
            href={route("single-product", { slug: product.slug })}
            className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
        >
            <div className="mb-4 min-h-[72px]">
                <h3 className="mb-1 text-xl font-bold text-black line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-500">{categoryLabel}</p>
            </div>

            <div className="relative mb-6 h-[288px] rounded-xl overflow-hidden bg-gray-100">
                <img
                    src={product.primaryImage || placeholderImage}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {discountPercentLabel && (
                    <div className="absolute top-4 right-4 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
                        -{discountPercentLabel}
                        {discountAmountLabel ? ` • ${discountAmountLabel}` : ""}
                    </div>
                )}

                <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight className="h-6 w-6 text-white" />
                </div>
            </div>

            <div className="mb-6 flex items-center justify-between border-y border-gray-200 py-4">
                <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                        {compareDisplay && (
                            <span className="text-base text-gray-400 line-through">{compareDisplay}</span>
                        )}
                        {priceDisplay && <span className="text-2xl font-bold text-black">{priceDisplay}</span>}
                    </div>
                </div>
            </div>

            <div className="mb-6 space-y-3 text-sm">
                <div className="flex gap-4">
                    <span className="min-w-[120px] text-gray-600">Sizes</span>
                    {sizeLabel ? (
                        <span className="text-gray-500">{sizeLabel}</span>
                    ) : (
                        <span className="font-bold">—</span>
                    )}
                </div>
                <div className="flex gap-4">
                    <span className="min-w-[120px] text-gray-600">Material</span>
                    {materialLabel ? (
                        <span className="text-gray-500">{materialLabel}</span>
                    ) : (
                        <span className="font-bold">—</span>
                    )}
                </div>
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
        </Link>
    )
}

