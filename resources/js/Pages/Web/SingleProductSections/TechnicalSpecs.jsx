import React from "react"

export default function TechnicalSpecs() {
    const specs = [
        { label: "Drivetrain", value: "AWD" },
        { label: "Engine", value: "4-Cylinder" },
        { label: "Power", value: "270 hp" },
        { label: "Transmission", value: "CVT" },
        { label: "Fuel Type", value: "Gasoline" },
    ]

    const primaryFeatures = [
        "19-inch wheels",
        "LED headlights",
        "Rain-sensing windshield wipers",
        "Push-button start",
        "Forward collision warning",
        "Lane departure warning",
        "Front and rear parking sensors",
    ]

    const additionalFeatures = [
        "Keyless access",
        "Power moonroof",
        "Heated front seats",
        "Heated steering wheel",
        "Wireless device charging",
        "Harman Kardon stereo",
    ]

    return (
        <section className="max-w-[1440px] mx-auto px-4 py-12">
            {/* Technical Specs */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Technical Specs</h2>
                <div className="bg-white">
                    {specs.map((spec, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center py-4 ${index !== specs.length - 1 ? "border-b border-gray-200" : ""
                                }`}
                        >
                            <span className="text-gray-900">{spec.label}</span>
                            <span className="font-semibold text-gray-900">{spec.value}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center py-4">
                        <span className="text-gray-900">Exterior and Interior color</span>
                        <div className="flex gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#1E3A8A] border border-gray-300" />
                            <div className="w-5 h-5 rounded-full bg-[#000000] border border-gray-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Model Features */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Model Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Primary Features */}
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Primary Features</h3>
                        <ul className="space-y-3">
                            {primaryFeatures.map((feature, index) => (
                                <li key={index} className="text-gray-900">
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Additional Features */}
                    <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Additional Features</h3>
                        <ul className="space-y-3">
                            {additionalFeatures.map((feature, index) => (
                                <li key={index} className="text-gray-900">
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
