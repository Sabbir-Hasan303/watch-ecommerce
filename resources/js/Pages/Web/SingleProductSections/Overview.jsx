import { useEffect, useMemo, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { router } from "@inertiajs/react"
import TechnicalSpecs from "@/Pages/Web/SingleProductSections/TechnicalSpecs"
import { useCart } from "@/contexts/CartContext"
import { LucideIcon } from "@/Components/LucideIcon"

const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return null
    }

    return `$${Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

export default function Overview({ product }) {
    const { addItem, isInCart } = useCart()

    const gallery = useMemo(() => (product?.gallery ?? []).filter((image) => image?.url), [product])
    const variants = useMemo(() => product?.variants ?? [], [product])

    const initialVariant = useMemo(() => {
        if (!variants.length) return null
        return variants.find((variant) => variant.status === "active") ?? variants[0]
    }, [variants])

    const [selectedVariantId, setSelectedVariantId] = useState(initialVariant?.id ?? null)
    const [selectedImageUrl, setSelectedImageUrl] = useState(() => {
        if (product?.primaryImage) return product.primaryImage
        const primaryFromGallery = gallery.find((image) => image.is_primary)
        return primaryFromGallery?.url ?? gallery[0]?.url ?? null
    })
    const [showZoom, setShowZoom] = useState(false)
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const [isBuying, setIsBuying] = useState(false)

    useEffect(() => {
        setSelectedVariantId(initialVariant?.id ?? null)
        const primaryUrl = product?.primaryImage || gallery.find((image) => image.is_primary)?.url || gallery[0]?.url || null
        setSelectedImageUrl(primaryUrl)
        setQuantity(1)
    }, [product?.id, product?.primaryImage, gallery, initialVariant])

    const selectedVariant = useMemo(() => {
        if (!selectedVariantId) return initialVariant ?? null
        return variants.find((variant) => variant.id === selectedVariantId) ?? initialVariant ?? null
    }, [selectedVariantId, variants, initialVariant])

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomPosition({ x, y })
    }

    const handleSelectImage = (url) => {
        setSelectedImageUrl(url)
    }

    const handleVariantSelect = (variantId) => {
        if (variantId === selectedVariantId) return
        const variant = variants.find((item) => item.id === variantId)
        setSelectedVariantId(variantId)
        if (variant?.image) {
            setSelectedImageUrl(variant.image)
        } else if (product?.primaryImage) {
            setSelectedImageUrl(product.primaryImage)
        }
    }

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const increaseQuantity = () => {
        setQuantity(quantity + 1)
    }

    const handleAddToCart = async () => {
        if (!product) return

        try {
            setIsAdding(true)
            await addItem({
                productId: product.id,
                productVariantId: selectedVariant?.id ?? null,
                quantity,
            })
        } catch (error) {
            // Error is handled in the cart context toast
        } finally {
            setIsAdding(false)
        }
    }

    const itemInCart = product?.id ? isInCart(product.id, selectedVariant?.id ?? null) : false

    const handleBuyNow = async () => {
        if (!product) return

        try {
            setIsBuying(true)

            if (!itemInCart) {
                await addItem({
                    productId: product.id,
                    productVariantId: selectedVariant?.id ?? null,
                    quantity,
                })
            }

            router.visit(route("checkout"))
        } catch (error) {
            setIsBuying(false)
        }
    }

    const comparePrice = formatCurrency(selectedVariant?.compare_at_price)
    const currentPrice = formatCurrency(selectedVariant?.price)

    const featureList = product?.features ?? []
    const technicalSpecs = product?.technicalSpecs ?? []
    const modelFeatures = product?.modelFeatures ?? []

    const primaryImageUrl = product?.primaryImage || gallery.find((image) => image.is_primary)?.url || gallery[0]?.url || null

    return (
        <section className="w-full max-w-[1440px] mx-auto px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:[grid-template-columns:1fr_400px] gap-8 lg:gap-12">
                {/* Left Column - Overview Content */}
                <div className="md:space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Overview</h2>
                        {product?.description ? (
                            <div className="space-y-4 text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                        ) : product?.short_description ? (
                            <p className="text-gray-600 leading-relaxed">{product.short_description}</p>
                        ) : (
                            <p className="text-gray-500">Detailed description will be available soon.</p>
                        )}
                    </div>

                    {/* Image Gallery */}
                    <div className="flex flex-col md:flex-row gap-6 max-w-[800px] mx-auto">
                        {/* Main Image with Zoom */}
                        <div
                            className="relative w-full md:flex-1 overflow-hidden rounded-lg bg-gray-50 cursor-zoom-in"
                            onMouseEnter={() => setShowZoom(true)}
                            onMouseLeave={() => setShowZoom(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <div className="relative w-full aspect-[4/5] md:aspect-[1/1]">
                                <img
                                    src={selectedImageUrl || primaryImageUrl || "/placeholder.svg"}
                                    alt={product?.name ?? "Product image"}
                                    className="absolute inset-0 w-full h-full object-contain"
                                />

                                {/* Zoom Window */}
                                {showZoom && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div
                                            className="absolute w-full h-full bg-no-repeat"
                                            style={{
                                                backgroundImage: `url(${selectedImageUrl || primaryImageUrl || ""})`,
                                                backgroundSize: "200%",
                                                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="order-last md:order-none">
                            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto lg:max-h-[410px] xl:max-h-[610px] pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {gallery.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectImage(image.url)}
                                        aria-label={`Select image ${index + 1}`}
                                        className={`relative flex-shrink-0 w-28 h-28 lg:w-28 lg:h-28 xl:w-40 xl:h-40 rounded-lg overflow-hidden border-2 transition-colors ${
                                            selectedImageUrl === image.url ? "border-black" : "border-gray-200 hover:border-gray-400"
                                        }`}
                                    >
                                        <img src={image.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <TechnicalSpecs specs={technicalSpecs} modelFeatures={modelFeatures} />
                </div>

                {/* Right Column - Product Details */}
                <div className="space-y-6 lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
                    {/* Price */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-3xl font-bold text-gray-900">
                            {currentPrice ?? "Pricing unavailable"}
                            {comparePrice && (
                                <span className="text-lg font-semibold text-gray-400 line-through">{comparePrice}</span>
                            )}
                        </div>
                        {/* <div className="text-sm text-gray-500">Retail price</div> */}
                    </div>

                    {/* Color Selection */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="font-semibold">Select a Variant:</span>
                            <span className="text-gray-600">{selectedVariant?.title ?? "Default"}</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => handleVariantSelect(variant.id)}
                                    className={`px-6 py-2 rounded font-semibold transition-all ${
                                        selectedVariantId === variant.id
                                            ? "bg-[#1e3a8a] text-white"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                                >
                                    {variant.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SKU */}
                    {/* <div className="flex items-center gap-2">
                        <span className="font-semibold">SKU:</span>
                        <span className="text-gray-600">{selectedVariant?.sku ?? product?.sku ?? "N/A"}</span>
                    </div> */}

                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                        {selectedVariant?.sku && (
                            <div>
                                <span className="font-semibold text-gray-900">SKU:</span> {selectedVariant.sku}
                            </div>
                        )}
                        {selectedVariant?.size && (
                            <div>
                                <span className="font-semibold text-gray-900">Size:</span> {selectedVariant.size}
                            </div>
                        )}
                        {selectedVariant?.color && (
                            <div>
                                <span className="font-semibold text-gray-900">Color:</span> {selectedVariant.color}
                            </div>
                        )}
                        {selectedVariant?.material && (
                            <div>
                                <span className="font-semibold text-gray-900">Material:</span> {selectedVariant.material}
                            </div>
                        )}
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Features</h3>
                        <div className="grid gap-4">
                            {featureList.length > 0 ? (
                                featureList.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded text-sm font-semibold text-gray-600">
                                            {feature.icon ? (
                                                <LucideIcon name={feature.icon} className="w-5 h-5 text-gray-700" />
                                            ) : (
                                                <span>{feature.type?.[0] || feature.name?.[0] || "•"}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{feature.name}</div>
                                            {feature.type && <div className="text-sm text-gray-500">{feature.type}</div>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Feature details coming soon.</p>
                            )}
                        </div>
                    </div>

                    {/* Delivery */}
                    <div className="flex item-center gap-3 mb-2">
                        <div className="flex item-center gap-3">
                            <div className="text-sm font-base">Delivery Time:</div>
                            <div className="text-sm font-bold">3-5 Days</div>
                        </div>

                        <div className="h-full flex flex-row item-center">|</div>

                        <div className="flex item-center gap-3">
                            <div className="text-sm font-base">Ship From:</div>
                            <div className="text-sm font-bold">Overseas</div>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <div className="font-semibold mb-2">QUANTITY</div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={decreaseQuantity}
                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">{quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {!itemInCart ? (
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`flex-1 bg-black text-white py-3 px-6 rounded font-semibold transition-colors ${
                                    isAdding ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-800"
                                }`}
                            >
                                {isAdding ? "Adding..." : "Add to Cart"}
                            </button>
                        ) : (
                            <button
                                disabled
                                className="flex-1 bg-gray-300 text-gray-600 py-3 px-6 rounded font-semibold cursor-not-allowed"
                            >
                                In Cart
                            </button>
                        )}
                        <button
                            onClick={handleBuyNow}
                            disabled={isBuying}
                            className={`flex-1 bg-red-600 text-white py-3 px-6 rounded font-semibold transition-colors ${
                                isBuying ? "opacity-75 cursor-not-allowed" : "hover:bg-red-700"
                            }`}
                        >
                            {isBuying ? "Redirecting..." : "Buy Now"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
