import { useEffect, useMemo, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { router } from "@inertiajs/react"
import TechnicalSpecs from "@/Pages/Web/SingleProductSections/TechnicalSpecs"
import { useCart } from "@/contexts/CartContext"
import { LucideIcon } from "@/Components/LucideIcon"
import Taka from "@/Components/Taka"

const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return null
    }

    return `${Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

export default function Overview({ product }) {
    const { addItem, isInCart, updateQuantity, items } = useCart()

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

    // * Find the cart item for this product and variant
    const cartItem = useMemo(() => {
        return items.find(
            (item) => item.productId === product?.id && (item.productVariantId ?? null) === (selectedVariantId ?? null)
        )
    }, [items, product?.id, selectedVariantId])

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

    const decreaseQuantity = async () => {
        if (!cartItem) return
        if (cartItem.quantity > 1) {
            try {
                await updateQuantity(cartItem.id, cartItem.quantity - 1)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const increaseQuantity = async () => {
        if (!cartItem) return
        try {
            await updateQuantity(cartItem.id, cartItem.quantity + 1)
        } catch (error) {
            console.error(error)
        }
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
            console.error(error)
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
        <>
            <section className="w-full max-w-[1440px] mx-auto px-4 py-4 md:py-8 pb-24 lg:pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Overview Content */}
                    <div className="md:space-y-8">
                        {/* Image Gallery */}
                        <div className="flex flex-col gap-6 max-w-[800px] mx-auto">
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
                                <div className="flex gap-3 overflow-x-auto lg:max-h-[410px] xl:max-h-[610px] pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {gallery.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectImage(image.url)}
                                            aria-label={`Select image ${index + 1}`}
                                            className={`relative flex-shrink-0 w-28 h-28 lg:w-28 lg:h-28 xl:w-40 xl:h-40 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageUrl === image.url ? "border-black" : "border-gray-200 hover:border-gray-400"
                                                }`}
                                        >
                                            <img src={image.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="py-4">
                            {/* <h2 className="text-2xl font-bold mb-4">Overview</h2> */}
                            {product?.short_description ? (
                                <p className="text-gray-600 leading-relaxed">{product.short_description}</p>
                            ) : (
                                <p className="text-gray-500">Detailed description will be available soon.</p>
                            )}
                        </div>

                        <TechnicalSpecs specs={technicalSpecs} modelFeatures={modelFeatures} />

                        <div>
                            <h2 className="text-2xl font-bold mb-4">Overview</h2>
                            {product?.description ? (
                                <div className="space-y-4 text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                            ) : (
                                <p className="text-gray-500">Detailed description will be available soon.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="space-y-6 lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>
                        </div>

                        {/* Price Section */}
                        <div className="">
                            <div className="flex items-end gap-3">
                                <div className="flex items-center gap-1">
                                    <Taka color="text-gray-900" className="font-bold text-2xl" />
                                    <span className="text-3xl font-bold text-gray-900">{currentPrice}</span>
                                </div>
                                {comparePrice && (
                                    <div className="flex items-center gap-1 text-gray-400 line-through">
                                        <Taka color="text-gray-400" className="text-sm" />
                                        <span className="text-sm">{comparePrice}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Variant Selection */}
                        {variants.length > 0 && (
                            <div className="">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                                    <span className="font-semibold">Select a Variant:</span>
                                    <span className="text-gray-600">{selectedVariant?.title ?? "Default"}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => handleVariantSelect(variant.id)}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-2 ${selectedVariantId === variant.id
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
                                                }`}
                                        >
                                            {variant.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variant Specs */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {selectedVariant?.sku && (
                                    <div>
                                        <p className="text-gray-600">SKU</p>
                                        <p className="font-semibold text-gray-900">{selectedVariant.sku}</p>
                                    </div>
                                )}
                                {selectedVariant?.size && (
                                    <div>
                                        <p className="text-gray-600">Size</p>
                                        <p className="font-semibold text-gray-900">{selectedVariant.size}</p>
                                    </div>
                                )}
                                {selectedVariant?.color && (
                                    <div>
                                        <p className="text-gray-600">Color</p>
                                        <p className="font-semibold text-gray-900">{selectedVariant.color}</p>
                                    </div>
                                )}
                                {selectedVariant?.material && (
                                    <div>
                                        <p className="text-gray-600">Material</p>
                                        <p className="font-semibold text-gray-900">{selectedVariant.material}</p>
                                    </div>
                                )}
                            </div>
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



                    {/* Desktop: Quantity and Buttons Side by Side (Hidden on mobile) */}
                    <div className="hidden lg:flex gap-3 items-end">
                        {/* Quantity Controls - Only shown when item is in cart */}
                        {itemInCart && cartItem && (
                            <div>
                                <div className="font-semibold mb-2 text-sm">QUANTITY</div>
                                <div className="flex items-center gap-2 border border-gray-300 rounded">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-sm">{cartItem.quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add to Cart - Only when item is NOT in cart */}
                        {!itemInCart && (
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`flex-1 bg-black text-white py-3 px-6 rounded font-semibold transition-colors ${isAdding ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-800"
                                    }`}
                            >
                                {isAdding ? "Adding..." : "Add to Cart"}
                            </button>
                        )}

                        {/* Buy Now - Always visible */}
                        <button
                            onClick={handleBuyNow}
                            disabled={isBuying}
                            className={`flex-1 bg-red-600 text-white py-3 px-6 rounded font-semibold transition-colors ${isBuying ? "opacity-75 cursor-not-allowed" : "hover:bg-red-700"
                                }`}
                        >
                            {isBuying ? "Redirecting..." : "Buy Now"}
                        </button>
                    </div>
                    </div>
                </div>
            </section>

            {/* Mobile Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 px-5 py-5 z-40 shadow-lg">
                <div className="flex gap-3 items-center">
                    {/* Quantity Controls (when item is in cart) */}
                    {itemInCart && cartItem && (
                        <div className="flex items-center gap-2 bg-gray-50 rounded border border-gray-300 p-1">
                            <button
                                onClick={decreaseQuantity}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors rounded"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{cartItem.quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors rounded"
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {/* Add to Cart Button (when item is not in cart) */}
                    {!itemInCart && (
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`flex-1 bg-black text-white py-2 px-4 rounded font-semibold text-sm transition-colors ${isAdding ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-800"
                                }`}
                        >
                            {isAdding ? "Adding..." : "Add to Cart"}
                        </button>
                    )}

                    {/* Buy Now Button - Always visible */}
                    <button
                        onClick={handleBuyNow}
                        disabled={isBuying}
                        className={`flex-1 bg-red-600 text-white py-2 px-4 rounded font-semibold text-sm transition-colors ${isBuying ? "opacity-75 cursor-not-allowed" : "hover:bg-red-700"
                            }`}
                    >
                        {isBuying ? "Redirecting..." : "Buy Now"}
                    </button>
                </div>
            </div>
        </>
    )
}
