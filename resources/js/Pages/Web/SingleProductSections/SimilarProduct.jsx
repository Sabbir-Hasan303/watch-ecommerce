import ProductCardCompact from "@/Components/ProductCardCompact"

export default function SimilarProduct({ products = [] }) {
    if (!products.length) {
        return null
    }

    return (
        <section className="max-w-[1440px] w-full mx-auto px-4 py-12">
            <div className="w-full">
                <h2 className="text-2xl font-bold mb-8 w-full">Explore similar watches</h2>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {products.map((product) => (
                        <ProductCardCompact
                            key={product.id}
                            product={product}
                            showCategory={false}
                            showColors={false}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
