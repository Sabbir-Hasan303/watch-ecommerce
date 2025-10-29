import { Link } from "@inertiajs/react"
import { ArrowRight } from "lucide-react"

const trendingWatches = [
    {
        id: 1,
        name: "RUIMAS Digital Sport",
        brand: "RUIMAS",
        modelYear: "2024",
        condition: "Brand New",
        image: "/images/watches/watch-2.png",
        movement: "Quartz",
        waterResistance: "30M",
        caseDiameter: "45mm",
        caseShape: "Round",
        caseMaterial: "Stainless Steel",
        strapMaterial: "Rubber",
        colors: ["#1e3a8a", "#1f2937"],
        warranty: "2 Years",
        features: "Digital Display, Chronograph",
        price: "$299-$399",
        brandLogo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 2,
        name: "Classic Tourbillon",
        brand: "Luxury Brand",
        modelYear: "2024",
        condition: "Brand New",
        image: "/images/watches/watch-4.png",
        movement: "Automatic",
        waterResistance: "50M",
        caseDiameter: "42mm",
        caseShape: "Round",
        caseMaterial: "Rose Gold",
        strapMaterial: "Leather",
        colors: ["#fbbf24", "#1f2937"],
        warranty: "5 Years",
        features: "Tourbillon, Date Display",
        price: "$8,500",
        brandLogo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 3,
        name: "Diamond Elegance",
        brand: "Premium",
        modelYear: "2024",
        condition: "Brand New",
        image: "/images/watches/watch-1.png",
        movement: "Quartz",
        waterResistance: "30M",
        caseDiameter: "38mm",
        caseShape: "Square",
        caseMaterial: "Stainless Steel",
        strapMaterial: "Leather",
        colors: ["#6366f1", "#1f2937"],
        warranty: "3 Years",
        features: "Diamond Bezel, Mother of Pearl",
        price: "$12,500",
        brandLogo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 4,
        name: "SKMEI Tactical",
        brand: "SKMEI",
        modelYear: "2024",
        condition: "Brand New",
        image: "/images/watches/watch-5.png",
        movement: "Quartz",
        waterResistance: "30M",
        caseDiameter: "48mm",
        caseShape: "Round",
        caseMaterial: "Stainless Steel",
        strapMaterial: "Rubber",
        colors: ["#059669", "#1f2937"],
        warranty: "1 Year",
        features: "Unique Design, Luminous",
        price: "$189",
        brandLogo: "/placeholder.svg?height=40&width=40",
    },
]

export default function Trending() {
    return (
        <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-16">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Trending watches</h2>
                <Link
                    href={route('watches-list')}
                    className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                    Explore More Watches
                </Link>
            </div>

            {/* Watches Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trendingWatches.map((watch) => (
                    <Link
                        key={watch.id}
                        href={route('single-product', { id: watch.id })}
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
                                src={watch.image}
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
                                <div className="mb-1 text-lg font-bold">{watch.movement}</div>
                                <div className="text-xs text-gray-500">Movement</div>
                            </div>
                            <div className="h-12 w-px bg-gray-200" />
                            {/*<div className="flex-1 text-center">
                <div className="mb-1 text-lg font-bold">{watch.waterResistance}</div>
                <div className="text-xs text-gray-500">Water Resist</div>
              </div>*/}
                            <div className="h-12 w-px bg-gray-200" />
                            <div className="flex-1 text-center">
                                <div className="mb-1 text-lg font-bold">{watch.caseDiameter}</div>
                                <div className="text-xs text-gray-500">Case Size</div>
                            </div>
                        </div>

                        {/* Detailed Specs */}
                        <div className="mb-6 space-y-3 text-sm">
                            <div className="flex gap-4">
                                <span className="text-gray-600">Case material</span>
                                <span className="font-bold">{watch.caseMaterial}</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-gray-600">Strap material</span>
                                <span className="font-bold">{watch.strapMaterial}</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-gray-600">Available colors</span>
                                <div className="flex gap-2">
                                    {watch.colors.map((color, index) => (
                                        <div key={index} className="h-5 w-5 rounded-full" style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="pt-4">
                            <div className="text-2xl font-bold">{watch.price}</div>
                            <div className="text-xs text-gray-500">Retail price</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
