import { Phone, Mail, MapPin } from "lucide-react"
import { Head, useForm, usePage } from "@inertiajs/react"
import GuestLayout from "@/Layouts/GuestLayout"
import { toast } from "react-hot-toast"

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
    })

    const { flash } = usePage().props

    const submit = (e) => {
        e.preventDefault()
        post(route("contact.store"), {
            onSuccess: () => {
                reset("name", "email", "subject", "message")
                toast.success("Message sent successfully")
            },
            onError: () => {
                toast.error("Failed to send message")
            },
        })
    }

    return (
        <GuestLayout>
            <Head title="Contact" />
            <div>
                {/* Hero Section */}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-6xl font-bold text-black mb-4">Contact Us</h1>
                        <p className="text-base text-[#454f53]">Our customer services team is always happy to answer any questions</p>
                    </div>
                </section>

                {/* Google Maps Section */}
                <section className="px-4 mb-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="w-full h-[450px] rounded-2xl overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2435.8662!2d4.8945!3d52.3676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDIyJzAzLjQiTiA0wrA1Myc0MC4yIkU!5e0!3m2!1sen!2snl!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </section>

                {/* Contact Details Section */}
                <section className="px-4 mb-12">
                    <div className="max-w-[640px] mx-auto">
                        <h2 className="text-3xl font-bold text-black mb-8">Contact details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Headquarter Office Card */}
                            <div className="md:row-span-2 bg-[#454f53] text-white p-6 rounded-xl relative min-h-[160px]">
                                <h3 className="text-base font-semibold mb-3">Headquarter office</h3>
                                <div className="space-y-0.5 text-sm leading-relaxed">
                                    <p>Storkower Strasse 41</p>
                                    <p>Rheinland-Pfalz</p>
                                    <p>56379</p>
                                    <p>Germany, Berlin</p>
                                </div>
                                <div className="absolute bottom-5 right-5">
                                    <MapPin className="w-5 h-5 text-white/60" />
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="bg-[#6e828a] text-white p-6 rounded-xl relative min-h-[74px]">
                                <div className="absolute top-5 right-5">
                                    <Mail className="w-5 h-5 text-white/60" />
                                </div>
                                <h3 className="text-base font-semibold mb-1">support@bydrive.com</h3>
                                <p className="text-sm text-white/70">Send your email</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="px-4 pb-20">
                    <div className="max-w-[640px] mx-auto">
                        <h2 className="text-3xl font-bold text-black mb-8">Send your message</h2>

                        {flash?.success && (
                            <div className="mb-6 rounded-xl bg-green-50 text-green-700 px-4 py-3">
                                {flash.success}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm text-[#6e828a] mb-2">
                                        Full name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="name"
                                        placeholder="Enter your name"
                                        className="w-full px-5 py-3.5 bg-[#f2f2f2] rounded-xl text-[#6e828a] placeholder:text-[#6e828a]/60 focus:outline-none focus:ring-2 focus:ring-black/10"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label htmlFor="email" className="block text-sm text-[#6e828a] mb-2">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="w-full px-5 py-3.5 bg-[#f2f2f2] rounded-xl text-[#6e828a] placeholder:text-[#6e828a]/60 focus:outline-none focus:ring-2 focus:ring-black/10"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label htmlFor="subject" className="block text-sm text-[#6e828a] mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    placeholder="Enter your subject"
                                    className="w-full px-5 py-3.5 bg-[#f2f2f2] rounded-xl text-[#6e828a] placeholder:text-[#6e828a]/60 focus:outline-none focus:ring-2 focus:ring-black/10"
                                    value={data.subject}
                                    onChange={(e) => setData("subject", e.target.value)}
                                    required
                                />
                            </div>
                            {errors.subject && (
                                <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
                            )}

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm text-[#6e828a] mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    placeholder="Tell us more"
                                    className="w-full px-5 py-3.5 bg-[#f2f2f2] rounded-xl text-[#6e828a] placeholder:text-[#6e828a]/60 focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                                    value={data.message}
                                    onChange={(e) => setData("message", e.target.value)}
                                    required
                                />
                                {errors.message && (
                                    <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                {processing ? "Sending..." : "Send Your Request"}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </GuestLayout>
    )
}
