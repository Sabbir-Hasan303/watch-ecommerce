import HeroSection from "@/Pages/Web/HomeSections/Hero"
import Trending from "@/Pages/Web/HomeSections/Trending"
import Category from "@/Pages/Web/HomeSections/Category"
import GuestLayout from "@/Layouts/GuestLayout"
import { Head } from "@inertiajs/react"

export default function Home({ categories, trendingProducts, banner }) {
  return (
    <GuestLayout>
        <Head title="Home" />
        <div className="min-h-screen">
            <HeroSection banner={banner} />
            <Trending trendingProducts={trendingProducts} />
            <Category categories={categories} />
        </div>
    </GuestLayout>
  )
}
