import React from "react"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import TechnicalSpecs from "@/Pages/Web/SingleProductSections/TechnicalSpecs"
import { useCart } from "@/contexts/CartContext"

const watchImages = [
    "/https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6.png-BjH9bZa4L8hL6aPetLTJeXiTSnwt8m.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6.png-BjH9bZa4L8hL6aPetLTJeXiTSnwt8m.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6.png-BjH9bZa4L8hL6aPetLTJeXiTSnwt8m.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6.png-BjH9bZa4L8hL6aPetLTJeXiTSnwt8m.webp",
]

const colors = ["Black", "Rose Gold", "Silver"]

export default function Overview() {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState("Black")
    const [quantity, setQuantity] = useState(1)
    const [showZoom, setShowZoom] = useState(false)
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
    const { addItem, isInCart } = useCart()

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomPosition({ x, y })
    }

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const increaseQuantity = () => {
        setQuantity(quantity + 1)
    }

    const handleAddToCart = () => {
        addItem({
            name: "RUIMAS Digital Sport 2024",
            price: "$299-$399",
            color: selectedColor,
            quantity: quantity,
            image: watchImages[selectedImage],
            sku: "SKU-00789",
        })
    }

    const itemInCart = isInCart("RUIMAS Digital Sport 2024", selectedColor)

    return (
        <section className="w-full max-w-[1440px] mx-auto px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:[grid-template-columns:1fr_400px] gap-8 lg:gap-12">
                {/* Left Column - Overview Content */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Overview</h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                RUIMAS pushes the boundaries of sports watch design with this latest digital timepiece. Redesigned for
                                2024, the new RUIMAS Digital Sport adopts a bold aesthetic with industrial-grade materials to protect
                                against impacts and scratches while upgrading functionality with a larger digital display and enhanced
                                water resistance. The watch also features the latest in digital timekeeping technology, including
                                chronograph functions and dual time zones.
                            </p>
                            <p>
                                After establishing itself as a leader in affordable sports watches, RUIMAS continues to innovate with
                                the 2024 model featuring improved battery life and enhanced visibility in all lighting conditions. This
                                high-performance timepiece continues to rival other sport watches in its category, bringing exceptional
                                value and durability to active lifestyles.
                            </p>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="flex gap-4">
                        {/* Main Image with Zoom */}
                        <div
                            className="flex-1 relative overflow-hidden rounded-lg cursor-zoom-in"
                            onMouseEnter={() => setShowZoom(true)}
                            onMouseLeave={() => setShowZoom(false)}
                            onMouseMove={handleMouseMove}
                        >
                            {/* <Image
                src={watchImages[selectedImage] || "/placeholder.svg"}
                alt="RUIMAS Digital Sport"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              /> */}
                            <img src={watchImages[selectedImage]} alt="RUIMAS Digital Sport" className="w-full h-auto object-cover" />

                            {/* Zoom Window */}
                            {showZoom && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div
                                        className="absolute w-full h-full bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(${watchImages[selectedImage]})`,
                                            backgroundSize: "200%",
                                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex flex-col gap-4">
                            {watchImages.slice(1).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index + 1)}
                                    className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index + 1 ? "border-black" : "border-gray-200 hover:border-gray-400"
                                        }`}
                                >
                                    {/* <Image
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  /> */}
                                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <TechnicalSpecs />
                </div>

                {/* Right Column - Product Details */}
                <div className="space-y-6">
                    {/* Price */}
                    <div className="text-3xl font-bold">$299-$399</div>

                    {/* Color Selection */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="font-semibold">Select Your Color:</span>
                            <span className="text-gray-600">{selectedColor}</span>
                        </div>
                        <div className="flex gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-6 py-2 rounded font-semibold transition-all ${selectedColor === color ? "bg-[#1e3a8a] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    {/* <div className="flex items-center gap-2">
            <span className="font-semibold">STATUS:</span>
            <span className="text-green-600 font-bold">IN STOCK</span>
          </div>*/}

                    {/* SKU */}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">SKU:</span>
                        <span className="text-gray-600">SKU-00789</span>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Features</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="9" strokeWidth={2} />
                                        <path d="M12 6v6l4 2" strokeWidth={2} strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold">Digital Display</div>
                                    <div className="text-sm text-gray-500">Display type</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold">Chronograph</div>
                                    <div className="text-sm text-gray-500">Functions</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold">30M Water Resistant</div>
                                    <div className="text-sm text-gray-500">Durability</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold">Quartz Movement</div>
                                    <div className="text-sm text-gray-500">Mechanism</div>
                                </div>
                            </div>
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
                                className="flex-1 bg-black text-white py-3 px-6 rounded font-semibold hover:bg-gray-800 transition-colors"
                            >
                                Add to Cart
                            </button>
                        ) : (
                            <button
                                disabled
                                className="flex-1 bg-gray-300 text-gray-600 py-3 px-6 rounded font-semibold cursor-not-allowed"
                            >
                                In Cart
                            </button>
                        )}
                        <button className="flex-1 bg-red-600 text-white py-3 px-6 rounded font-semibold hover:bg-red-700 transition-colors">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
