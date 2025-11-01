import Overview from "@/Pages/Web/SingleProductSections/Overview"
import SimilarProduct from "@/Pages/Web/SingleProductSections/SimilarProduct"
import CTA from "@/Components/CTA"
import HeroSection from "@/Pages/Web/HomeSections/Hero"
import GuestLayout from "@/Layouts/GuestLayout"
import { Head } from "@inertiajs/react"

export default function SingleProduct({ product, similarProducts = [] }) {
    return (
        <GuestLayout>
            <Head title="Single Product" />
            <div>
                <HeroSection product={product} />
                <Overview product={product} />
                <SimilarProduct products={similarProducts} />
                <CTA />
            </div>
        </GuestLayout>
    )
}
