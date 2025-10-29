import { Link } from "@inertiajs/react"
import { ChevronRight } from "lucide-react"
import GuestLayout from "@/Layouts/GuestLayout"
import { Head } from "@inertiajs/react"

export default function TermsPage() {
    return (
        <GuestLayout>
            <Head title="Terms and Conditions" />
            <div>
                {/* Breadcrumb */}
                <div className="border-b border-gray-200">
                    <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-600 hover:text-black transition-colors">
                                Home
                            </Link>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-black">Terms and Conditions</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        {/* Header */}
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold text-black mb-4 text-balance">Terms and Conditions</h1>
                            <p className="text-gray-600 text-sm md:text-lg">Last updated: January 19, 2025</p>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-10">
                            {/* Section 1 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">1. Agreement to Terms</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        By accessing and using the Chronos website, you accept and agree to be bound by the terms and
                                        provision of this agreement. If you do not agree to abide by the above, please do not use this
                                        service.
                                    </p>
                                    <p>
                                        These Terms and Conditions constitute a legally binding agreement made between you, whether personally
                                        or on behalf of an entity, and Chronos, concerning your access to and use of the website.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">2. Intellectual Property Rights</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        Unless otherwise indicated, the website is our proprietary property and all source code, databases,
                                        functionality, software, website designs, audio, video, text, photographs, and graphics on the website
                                        (collectively, the "Content") are owned or controlled by us or licensed to us.
                                    </p>
                                    <p>
                                        The Content and the trademarks, service marks, and logos contained therein (the "Marks") are protected
                                        by copyright and trademark laws and various other intellectual property rights and unfair competition
                                        laws of the United States, international copyright laws, and international conventions.
                                    </p>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">3. User Representations</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>By using the website, you represent and warrant that:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>All registration information you submit will be true, accurate, current, and complete</li>
                                        <li>
                                            You will maintain the accuracy of such information and promptly update such registration information
                                            as necessary
                                        </li>
                                        <li>You have the legal capacity and you agree to comply with these Terms and Conditions</li>
                                        <li>You are not a minor in the jurisdiction in which you reside</li>
                                        <li>
                                            You will not access the website through automated or non-human means, whether through a bot, script,
                                            or otherwise
                                        </li>
                                        <li>You will not use the website for any illegal or unauthorized purpose</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">4. Products and Services</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        All products and services are subject to availability. We reserve the right to discontinue any product
                                        or service at any time. Prices for our products are subject to change without notice.
                                    </p>
                                    <p>
                                        We reserve the right to limit the sales of our products or services to any person, geographic region,
                                        or jurisdiction. We may exercise this right on a case-by-case basis.
                                    </p>
                                    <p>
                                        All descriptions of products or product pricing are subject to change at any time without notice, at
                                        our sole discretion. We reserve the right to discontinue any product at any time.
                                    </p>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">5. Purchases and Payment</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>We accept the following forms of payment:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Visa</li>
                                        <li>Mastercard</li>
                                        <li>American Express</li>
                                        <li>PayPal</li>
                                    </ul>
                                    <p>
                                        You agree to provide current, complete, and accurate purchase and account information for all
                                        purchases made via the website. You further agree to promptly update account and payment information,
                                        including email address, payment method, and payment card expiration date.
                                    </p>
                                </div>
                            </section>

                            {/* Section 6 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">6. Return and Refund Policy</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        All sales are final and no refund will be issued unless the product is defective or damaged upon
                                        arrival. If you receive a defective or damaged product, please contact us within 7 days of receipt.
                                    </p>
                                    <p>
                                        To be eligible for a return, your item must be unused and in the same condition that you received it.
                                        It must also be in the original packaging with all tags and certificates of authenticity.
                                    </p>
                                </div>
                            </section>

                            {/* Section 7 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">7. Prohibited Activities</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        You may not access or use the website for any purpose other than that for which we make the website
                                        available. The website may not be used in connection with any commercial endeavors except those that
                                        are specifically endorsed or approved by us.
                                    </p>
                                    <p>As a user of the website, you agree not to:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Systematically retrieve data or other content from the website to create a collection</li>
                                        <li>Make any unauthorized use of the website</li>
                                        <li>Use the website to advertise or offer to sell goods and services</li>
                                        <li>Engage in unauthorized framing of or linking to the website</li>
                                        <li>Interfere with, disrupt, or create an undue burden on the website</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 8 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">8. Limitation of Liability</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        In no event will we or our directors, employees, or agents be liable to you or any third party for any
                                        direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost
                                        profit, lost revenue, loss of data, or other damages arising from your use of the website.
                                    </p>
                                </div>
                            </section>

                            {/* Section 9 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">9. Modifications and Interruptions</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        We reserve the right to change, modify, or remove the contents of the website at any time or for any
                                        reason at our sole discretion without notice. However, we have no obligation to update any information
                                        on our website.
                                    </p>
                                    <p>
                                        We cannot guarantee the website will be available at all times. We may experience hardware, software,
                                        or other problems or need to perform maintenance related to the website, resulting in interruptions,
                                        delays, or errors.
                                    </p>
                                </div>
                            </section>

                            {/* Section 10 */}
                            <section>
                                <h2 className="text-2xl font-bold text-black mb-4">10. Contact Us</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        In order to resolve a complaint regarding the website or to receive further information regarding use
                                        of the website, please contact us at:
                                    </p>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
                                        <p className="font-semibold text-black mb-2">Chronos</p>
                                        <p>Storkower Strasse 41</p>
                                        <p>Rheinland-Pfalz, 56379</p>
                                        <p>Germany</p>
                                        <p className="mt-4">
                                            Email:{" "}
                                            <a href="mailto:support@chronos.com" className="text-black font-semibold hover:underline">
                                                support@chronos.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}
