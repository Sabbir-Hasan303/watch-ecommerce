// import ProductBanner from "@/components/product-banner"
import Overview from "@/Pages/Web/SingleProductSections/Overview"
import SimilarProduct from "@/Pages/Web/SingleProductSections/SimilarProduct"
// import TechnicalSpecsSection from "@/components/technical-specs-section"
import CTA from "@/Components/CTA"
import HeroSection from "@/Pages/Web/HomeSections/Hero"
import GuestLayout from "@/Layouts/GuestLayout"
import { Head } from "@inertiajs/react"

export default function SingleProduct() {
    return (
        <GuestLayout>
            <Head title="Single Product" />
            <div>
                {/* <HeroSection /> */}
                {/*<ProductBanner />*/}
                {/* <OverviewSection /> */}
                {/* <SimilarCarsSection /> */}
                {/*<TechnicalSpecsSection />*/}
                {/* <CTASection /> */}

                <HeroSection />
                <Overview />
                <SimilarProduct />
                <CTA />
            </div>
        </GuestLayout>
    )
}
