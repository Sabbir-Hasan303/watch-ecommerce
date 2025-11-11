import { Link } from '@inertiajs/react';

export default function HeroSection({ banner }) {
    return (
        <section className="relative w-full overflow-hidden">
            <div className="absolute inset-0 bg-[#f0f1f3] h-1/2" />
            <div className="absolute inset-0 top-1/2 " />

            <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 lg:pt-20 lg:pb-16">
                {/* Label */}
                <p className="text-center text-gray-500 text-sm mb-4 lg:mb-6">Best Selling Watches</p>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-center mb-6 lg:mb-8 text-balance">
                    Diamond Luxury Timepiece
                </h1>

                {/* CTA Button */}
                <div className="flex justify-center mb-8 lg:mb-12">
                    <Link href="/watches" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm lg:text-base">
                        See All Specifications
                    </Link>
                </div>

                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[550px] mb-8 lg:mb-6">
                    {banner && banner.image_url ? (
                        // Show banner image with price badge if available
                        <>
                            <div className="absolute right-[5%] sm:right-[8%] lg:right-[12%] top-1/3 -translate-y-1/2 w-[140px] h-[140px] sm:w-[280px] sm:h-[280px] lg:w-[380px] lg:h-[380px] bg-[linear-gradient(180deg,_#9BA8AE_0%,_#FFFFFF_100%)] rounded-full z-0 pt-6 pr-3 sm:pt-16 sm:pr-16 lg:pt-20 lg:pr-20">
                                {/* Price Badge */}
                                <div className="text-right">
                                    <p className="text-base sm:text-3xl lg:text-5xl font-bold text-white">$12,500</p>
                                    <p className="text-[9px] sm:text-sm lg:text-base text-white/90 mt-1">Starting from</p>
                                </div>
                            </div>

                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[280px] sm:max-w-[500px] lg:max-w-[900px] z-10">
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-full h-auto object-contain drop-shadow-2xl"
                                />
                            </div>
                        </>
                    ) : (
                        // Show default content if no banner
                        <>
                            <div className="absolute right-[5%] sm:right-[8%] lg:right-[12%] top-1/3 -translate-y-1/2 w-[140px] h-[140px] sm:w-[280px] sm:h-[280px] lg:w-[380px] lg:h-[380px] bg-[linear-gradient(180deg,_#9BA8AE_0%,_#FFFFFF_100%)] rounded-full z-0 pt-6 pr-3 sm:pt-16 sm:pr-16 lg:pt-20 lg:pr-20">
                                {/* Price Badge */}
                                <div className="text-right">
                                    <p className="text-base sm:text-3xl lg:text-5xl font-bold text-white">$12,500</p>
                                    <p className="text-[9px] sm:text-sm lg:text-base text-white/90 mt-1">Starting from</p>
                                </div>
                            </div>

                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[280px] sm:max-w-[500px] lg:max-w-[900px] z-10">
                                <img
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/19-191849_watch-rolex-cosmograph-daytona-automatic-mens-watch-18k-NSmQRFeQQsRJhsc1HhwRTA1pVPhSSj.png"
                                    alt="Diamond Luxury Timepiece"
                                    className="w-full h-auto object-contain drop-shadow-2xl"
                                />
                            </div>

                            <div className="absolute top-[56%] md:top-[46%] lg:top-[53%] xl:top-[40%] bottom-0 w-full z-0">
                                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/c8SEHdSYQQuchID9SCDEHBiQOw-xjuUYhzkmF7cZui5O1OmGjGfyIz5sE.png" alt="" className="w-full h-auto " />
                            </div>
                        </>
                    )}
                </div>

                <div className="max-w-[1024px] mx-auto">
                    {/* Brand Logos */}
                    <div className="flex flex-wrap items-center justify-between gap-6 lg:gap-12 opacity-60">
                        <div className="rounded-full overflow-hidden border w-8 h-8 lg:w-24 lg:h-24">
                            <img
                                src="/assets/Rolex-Logo-Transparent-PNG.png"
                                alt="Rolex"
                                className="h-full object-cover grayscale"
                            />
                        </div>
                        <div className="rounded-full overflow-hidden border w-8 h-8 lg:w-24 lg:h-24">
                            <img
                                src="https://w7.pngwing.com/pngs/468/700/png-transparent-omega-logo.png"
                                alt="Omega"
                                className="h-full object-cover grayscale"
                            />
                        </div>
                        <div className="rounded-full overflow-hidden border w-8 h-8 lg:w-24 lg:h-24">
                            <img
                                src="/assets/patek-philippe-logo.png"
                                alt="Patek Philippe"
                                className="h-full object-cover grayscale"
                            />
                        </div>
                        <div className="rounded-full overflow-hidden border w-8 h-8 lg:w-24 lg:h-24">
                            <img
                                src="https://p7.hiclipart.com/preview/950/759/654/cartier-logo-luxury-goods-jewellery-watch-gucci-logo.jpg"
                                alt="Cartier"
                                className="h-full object-cover grayscale"
                            />
                        </div>
                        <div className="rounded-full overflow-hidden border w-8 h-8 lg:w-24 lg:h-24">
                            <img
                                src="/assets/tag-heuer-watch-logo-brand-png-favpng-fgMz5TczwvfTRPVkz4hKMge34.jpg"
                                alt="TAG Heuer"
                                className="h-full object-cover grayscale"
                            />
                        </div>
                        <div className="rounded-full overflow-hidden border w-8 h-8 lg:w-24 lg:h-24">
                            <img
                                src="https://e7.pngegg.com/pngimages/841/580/png-clipart-logo-breitling-sa-emblem-watch-brand-watch-emblem-angle.png"
                                alt="Breitling"
                                className="h-full object-cover grayscale"
                            />
                        </div>
                        <div className="rounded-full overflow-hidden border w-8 h-8 lg:w-24 lg:h-24">
                            <img
                                src="https://e7.pngegg.com/pngimages/461/407/png-clipart-iwc-schaffhausen-international-watch-company-retail-watch-text-retail.png"
                                alt="IWC"
                                className="h-full object-cover grayscale"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
