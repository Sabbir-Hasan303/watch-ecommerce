import Overview from "@/Pages/Web/SingleProductSections/Overview"
import SimilarProduct from "@/Pages/Web/SingleProductSections/SimilarProduct"
import CTA from "@/Components/CTA"
import ProductHero from "@/Pages/Web/SingleProductSections/ProductHero"
import GuestLayout from "@/Layouts/GuestLayout"
import { Head } from "@inertiajs/react"

export default function SingleProduct({ product, similarProducts = [], banner }) {
    return (
        <GuestLayout>
            <Head title="Single Product" />
            <div>
                <ProductHero product={product} banner={banner} />
                <Overview product={product} />
                <SimilarProduct products={similarProducts} />
                <CTA />
            </div>
        </GuestLayout>
    )
}
