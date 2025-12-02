import React from "react"
import { Link } from "@inertiajs/react"
import { ArrowRight } from "lucide-react"

export default function CTA() {
    return (
        <section className="relative max-w-[1440px] mx-auto px-4 py-16 md:py-24 text-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-gray-200" />
                <div className="absolute w-[400px] h-[400px] md:w-[650px] md:h-[650px] rounded-full border border-gray-200" />
                <div className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full border border-gray-200" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Decorative line */}
                <div className="flex justify-center mb-6 md:mb-8">
                    <div className="w-20 md:w-24 h-1 bg-gray-800" />
                </div>

                {/* Heading */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 leading-tight px-4">
                    Ready to find your perfect
                    <br />
                    timepiece?
                </h2>

                {/* Button with hover animation */}
                <Link href={route("contact")}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border-2 border-gray-300 scale-0 group-hover:scale-[3] transition-transform duration-700 ease-out" />
                            </div>

                            {/* Button */}
                            <button className="relative w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">Contact us to get started</p>
                    </div>
                </Link>
            </div>
        </section>
    )
}
