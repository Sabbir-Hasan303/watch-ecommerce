import React from "react"

const similarWatches = [
    {
        id: 1,
        brand: "Premium",
        model: "Diamond Elegance",
        year: 2024,
        caseDiameter: "38mm",
        condition: "Brand New",
        image: "/images/watches/watch-8.png",
        logo: "/placeholder.svg?height=30&width=30",
        caseMaterial: "Stainless Steel",
        strapMaterial: "Leather",
        waterResistance: "30M",
        price: "$12,500",
        movement: "Quartz",
        colors: ["#DC2626", "#000000"],
        warranty: "3 Years",
    },
    {
        id: 2,
        brand: "Luxury",
        model: "Classic Tourbillon",
        year: 2024,
        caseDiameter: "42mm",
        condition: "Brand New",
        image: "/images/watches/watch-9.png",
        logo: "/placeholder.svg?height=30&width=30",
        caseMaterial: "Rose Gold",
        strapMaterial: "Leather",
        waterResistance: "50M",
        price: "$8,500",
        movement: "Automatic",
        colors: ["#1E40AF", "#000000"],
        warranty: "5 Years",
    },
]

export default function SimilarProduct() {
    return (
        <section className="max-w-[1440px] w-full mx-auto px-4 py-12">
            <div className="w-full">
                <h2 className="text-2xl font-bold mb-8 w-full">Explore similar watches</h2>
                <div className="space-y-6">
                    {similarWatches.map((watch) => (
                        <div
                            key={watch.id}
                            className="border border-gray-200 rounded-lg p-4 md:p-6 bg-white hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                {/* Left: Image and Brand Info */}
                                <div className="flex flex-col sm:flex-row gap-4 md:flex-1">
                                    <div className="relative w-full sm:w-[170px] h-[200px] sm:h-[120px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        {/* <Image
                      src={watch.image || "/placeholder.svg"}
                      alt={`${watch.brand} ${watch.model}`}
                      fill
                      className="object-cover"
                    /> */}
                                        <img src={watch.image} alt={`${watch.brand} ${watch.model}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1 min-w-0">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="relative w-8 h-8 flex-shrink-0">
                                                    {/* <Image
                            src={watch.logo || "/placeholder.svg"}
                            alt={`${watch.brand} logo`}
                            fill
                            className="object-contain"
                          /> */}
                                                    <img src={watch.logo} alt={`${watch.brand} logo`} className="w-full h-full object-contain" />
                                                </div>
                                                <h3 className="font-bold text-base md:text-lg truncate">
                                                    {watch.brand} {watch.model}
                                                </h3>
                                            </div>
                                            <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                                                Model Year {watch.year} • {watch.caseDiameter} • {watch.condition}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                                            <div className="flex gap-2">
                                                <span className="text-gray-600 min-w-[90px]">Case Material</span>
                                                <span className="font-semibold">{watch.caseMaterial}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-gray-600 min-w-[90px]">Strap Material</span>
                                                <span className="font-semibold">{watch.strapMaterial}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-gray-600 min-w-[90px]">Water Resistance</span>
                                                <span className="font-semibold">{watch.waterResistance}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Price and Details */}
                                <div className="md:flex-1 flex flex-col justify-between md:items-end border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="md:text-right mb-4 md:mb-0">
                                        <p className="text-xl md:text-2xl font-bold mb-1">{watch.price}</p>
                                        <p className="text-xs md:text-sm text-gray-500">Retail price</p>
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                                        <div className="flex justify-between md:justify-end gap-4 md:gap-8">
                                            <span className="text-gray-600">Movement</span>
                                            <span className="font-semibold">{watch.movement}</span>
                                        </div>
                                        <div className="flex justify-between md:justify-end gap-4 md:gap-8">
                                            <span className="text-gray-600">Available colors</span>
                                            <div className="flex gap-2">
                                                {watch.colors.map((color, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between md:justify-end gap-4 md:gap-8">
                                            <span className="text-gray-600">Warranty</span>
                                            <span className="font-semibold">{watch.warranty}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
