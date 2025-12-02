import { Link } from "@inertiajs/react"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
// import { FaPinterest } from "react-icons/fa"

export default function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Left Section - Logo, Address, Social, Button */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold">RavenHour</span>
                        </div>

                        <address className="not-italic text-sm mb-6 leading-relaxed">
                            Storkower Strasse
                            <br />
                            41Rheinland-Pfalz,56379,
                            <br />
                            Germany
                        </address>

                        <div className="flex gap-4 mb-6">
                            <Link href="#" className="hover:text-gray-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-gray-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-gray-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-gray-400 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            {/* <Link href="#" className="hover:text-gray-400 transition-colors">
                                <FaPinterest className="h-5 w-5" />
                            </Link> */}
                        </div>

                        {/*<Link
              href="#"
              className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Purchase Template
            </Link>*/}

                        <p className="text-sm mt-8">© 2025 All rights reserved</p>
                    </div>

                    {/* Primary Pages Column */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4 text-gray-400">Primary Pages</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/contact" className="font-bold hover:text-gray-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="font-bold hover:text-gray-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="font-bold hover:text-gray-400 transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Listings Column */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4 text-gray-400">Listings</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/watches" className="font-bold hover:text-gray-400 transition-colors">
                                    Watches
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Overview & Details Column */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4 text-gray-400">Overview & Details</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/checkout" className="font-bold hover:text-gray-400 transition-colors">
                                    Checkout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}
