export default function TechnicalSpecs({ specs = [], modelFeatures = [] }) {
    const hasSpecs = specs.length > 0
    const hasModelFeatures = modelFeatures.length > 0

    return (
        <section className="max-w-[1440px] mx-auto px-4 py-12">
            {/* Technical Specs */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Technical Specs</h2>
                {hasSpecs ? (
                    <div className="">
                        {specs.map((spec, index) => (
                            <div
                                key={`${spec.key}-${index}`}
                                className={`flex justify-between items-center py-4 ${index !== specs.length - 1 ? "border-b border-gray-200" : ""}`}
                            >
                                <span className="text-gray-900">{spec.key}</span>
                                <span className="font-semibold text-gray-900">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Technical specifications will be available soon.</p>
                )}
            </div>

            {/* Model Features */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Model Features</h2>
                {hasModelFeatures ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {modelFeatures.map((featureGroup, index) => (
                            <div key={`${featureGroup.category ?? "features"}-${index}`} className="border border-gray-200 rounded-lg p-6">
                                {/* <h3 className="text-lg font-bold mb-4">{featureGroup.category ?? "Features"}</h3> */}
                                {/* if featuredgroup category is primary then show Primary and if additional then show Additional */}
                                {featureGroup.category === "primary" ? (
                                    <h3 className="text-lg font-bold mb-4">Primary</h3>
                                ) : (
                                    <h3 className="text-lg font-bold mb-4">Additional</h3>
                                )}
                                {featureGroup.items?.length ? (
                                    <ul className="space-y-3">
                                        {featureGroup.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="text-gray-900">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Details coming soon.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Model feature details will be shared soon.</p>
                )}
            </div>
        </section>
    )
}
