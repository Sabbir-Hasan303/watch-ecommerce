import { useState } from "react"
import { Zap, Award, Users, Heart } from "lucide-react"
import { Head } from "@inertiajs/react"
import GuestLayout from "@/Layouts/GuestLayout"

export default function AboutPage() {
    const [hoveredCard, setHoveredCard] = useState(null)

    const values = [
        {
            icon: Zap,
            title: "Innovation",
            description:
                "We blend cutting-edge technology with timeless craftsmanship to create watches that transcend time.",
        },
        {
            icon: Award,
            title: "Excellence",
            description:
                "Every timepiece is meticulously crafted with attention to detail and the finest materials available.",
        },
        {
            icon: Users,
            title: "Community",
            description: "We build lasting relationships with our customers, treating each as part of the RavenHour family.",
        },
        {
            icon: Heart,
            title: "Passion",
            description: "Our founders dedicated their lives to the art of horology and continue that legacy today.",
        },
    ]

    const milestones = [
        { year: "1985", title: "Founded", description: "RavenHour was established in the heart of Switzerland." },
        { year: "1992", title: "First Collection", description: "Launched our signature Diamond Collection." },
        { year: "2005", title: "Global Expansion", description: "Expanded to 45 countries across the world." },
        {
            year: "2020",
            title: "Digital Innovation",
            description: "Introduced sustainable practices and digital platforms.",
        },
    ]

    return (
        <GuestLayout>
            <Head title="Contact" />
            <div className="bg-white">
                {/* Hero Section */}
                <section className="relative w-full overflow-hidden pt-12 pb-8 lg:pt-20 lg:pb-16">
                    <div className="absolute inset-0 bg-[#f0f1f3] h-full" />
                    <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-6 lg:mb-8 text-balance">
                            About Us
                        </h1>
                        <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                            RavenHour has been crafting luxury timepieces that blend Swiss precision with
                            innovative design.
                        </p>
                        <div className="flex justify-center">
                            <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm lg:text-base">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Mission */}
                        <div className="group cursor-default">
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black p-8 lg:p-12 text-white transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 transition-transform duration-500 group-hover:scale-150" />
                                <h2 className="text-3xl lg:text-4xl font-bold mb-4 relative z-10">Our Mission</h2>
                                <p className="text-gray-200 text-lg leading-relaxed relative z-10">
                                    To create exceptional timepieces that celebrate the art of precision engineering while inspiring
                                    confidence and elegance in those who wear them. We believe that a great watch is more than an
                                    accessory—it's a lifelong companion.
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="group cursor-default">
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 p-8 lg:p-12 text-black transition-transform duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-black/5 rounded-full -mr-20 -mt-20 transition-transform duration-500 group-hover:scale-150" />
                                <h2 className="text-3xl lg:text-4xl font-bold mb-4 relative z-10">Our Vision</h2>
                                <p className="text-gray-700 text-lg leading-relaxed relative z-10">
                                    To be the world's most trusted luxury watch brand, known for innovation, sustainability, and timeless
                                    design. We envision a future where every RavenHour watch represents not just precision, but a symbol of
                                    success and refined taste.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values Section */}
                <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    <div className="text-center mb-12 lg:mb-16">
                        <p className="text-gray-500 text-sm mb-4">What We Stand For</p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-balance">Our Core Values</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <div
                                    key={index}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 lg:p-8 transition-all duration-300 hover:border-black hover:shadow-lg cursor-pointer"
                                >
                                    {/* Background animation */}
                                    <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-5" />

                                    {/* Icon */}
                                    <div className="relative z-10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 group-hover:bg-black group-hover:text-white">
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="relative z-10 text-xl font-bold mb-2 transition-colors duration-300">{value.title}</h3>
                                    <p className="relative z-10 text-gray-600 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                                        {value.description}
                                    </p>

                                    {/* Underline animation */}
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full" />
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section className="max-w-full mx-auto py-12">
                    <div className="bg-gray-50">
                        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 lg:py-24">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                                <div>
                                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light mb-6 text-black leading-tight">
                                        Our History
                                    </h2>
                                    <p className="text-gray-700 text-lg leading-relaxed mb-6 font-light">
                                        To create exceptional timepieces that celebrate the art of precision engineering while inspiring
                                        confidence and elegance in those who wear them.
                                    </p>
                                    <p className="text-gray-600 text-base leading-relaxed">
                                        We believe that a great watch is more than an accessory—it's a lifelong companion that marks the
                                        moments that matter most.
                                    </p>
                                </div>
                                <div className="relative h-80 lg:h-96 bg-gradient-to-br from-gray-300 to-gray-400 rounded-3xl overflow-hidden group">
                                    <img
                                        src="/placeholder.svg?height=400&width=400"
                                        alt="Watchmaking craftsmanship"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-full mx-auto py-12">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center mb-16 lg:mb-20">
                            <p className="text-gray-500 text-sm font-medium mb-4">Since 1985</p>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-black leading-tight">
                                Our Journey
                            </h2>
                        </div>

                        <div className="relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-black to-gray-300 transform -translate-x-1/2 hidden lg:block" />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className="relative group">
                                        <div className="absolute left-1/2 top-8 w-4 h-4 bg-black rounded-full transform -translate-x-1/2 ring-4 ring-white z-10 hidden lg:block transition-transform duration-300 group-hover:scale-150" />

                                        <div className="lg:pt-16 lg:pr-12 lg:even:pl-12 lg:even:pr-0">
                                            <div className="rounded-2xl bg-white p-8 border border-gray-200 transition-all duration-300 hover:bg-white hover:border-black hover:shadow-lg">
                                                <div className="mb-4">
                                                    <span className="text-4xl font-serif font-light text-black">{milestone.year}</span>
                                                </div>
                                                <h3 className="text-xl font-serif font-light mb-2 text-black">{milestone.title}</h3>
                                                <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </GuestLayout>
    )
}
