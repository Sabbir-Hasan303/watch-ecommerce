import { useState } from "react"
import { Link, router } from "@inertiajs/react"
import { ArrowRight, ArrowLeft, X } from "lucide-react"
import { Button } from "@mui/material"
import toast from "react-hot-toast"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import ProductSelection from "./components/ProductSelection"
import CartSummary from "./components/CartSummary"
import CustomerSelection from "./components/CustomerSelection"
import PaymentShipping from "./components/PaymentShipping"
import OrderReview from "./components/OrderReview"
import OrderSummary from "./components/OrderSummary"

export default function CreateOrder({ products = [], customers = [], shippingCosts = {} }) {
    const [currentStep, setCurrentStep] = useState(1)

    // Step 1: Product Selection
    const [cart, setCart] = useState([])

    // Step 2: Customer Selection & Address
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)

    const [newCustomerData, setNewCustomerData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        area: "inside_dhaka",
    })

    const [shippingAddress, setShippingAddress] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        area: "inside_dhaka",
    })

    const [sameAsShipping, setSameAsShipping] = useState(true)

    // Step 3: Payment & Shipping
    const [paymentMethod, setPaymentMethod] = useState("cod")
    const [shippingMethod, setShippingMethod] = useState("standard")
    const [orderNotes, setOrderNotes] = useState("")
    const [discountCode, setDiscountCode] = useState("")
    const [discountAmount, setDiscountAmount] = useState(0)

    // Step 4: Confirmation & Notifications
    const [sendConfirmationEmail, setSendConfirmationEmail] = useState(true)
    const [sendInvoice, setSendInvoice] = useState(true)
    const [showInvoicePreview, setShowInvoicePreview] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [isCreatingNewAddress, setIsCreatingNewAddress] = useState(false)
    const [isAddressFieldsDisabled, setIsAddressFieldsDisabled] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)


    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id)
        if (existingItem) {
            setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }
    }

    const updateQuantity = (productId, change) => {
        setCart(
            cart
                .map((item) => {
                    if (item.id === productId) {
                        const newQuantity = item.quantity + change
                        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
                    }
                    return item
                })
                .filter((item) => item !== null),
        )
    }

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId))
    }


    const handleShippingAddressChange = (field, value) => {
        const newAddress = { ...shippingAddress, [field]: value }
        setShippingAddress(newAddress)
    }

    const handleCreateCustomer = () => {
        const newCustomer = {
            id: Date.now().toString(),
            name: newCustomerData.fullName,
            email: newCustomerData.email,
            phone: newCustomerData.phone,
            address: newCustomerData.address,
            type: "guest",
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: new Date().toISOString().split("T")[0],
            defaultShippingAddress: {
                address_line: newCustomerData.address,
                area: newCustomerData.area,
            },
        }

        setSelectedCustomer(newCustomer)

        setShippingAddress({
            fullName: newCustomerData.fullName,
            phone: newCustomerData.phone,
            email: newCustomerData.email,
            address: newCustomerData.address,
            area: newCustomerData.area,
        })

        setShowNewCustomerForm(false)
        setIsAddressFieldsDisabled(true)

        // Reset form
        setNewCustomerData({
            fullName: "",
            phone: "",
            email: "",
            address: "",
            area: "inside_dhaka",
        })
    }

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer)

        // Auto-fill shipping address with customer's default address
        if (customer.defaultShippingAddress) {
            setShippingAddress({
                fullName: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.defaultShippingAddress.address_line,
                area: customer.defaultShippingAddress.area,
            })
            setIsAddressFieldsDisabled(true)
            setIsCreatingNewAddress(false)
        } else {
            // If no default address, fill basic info but keep address fields editable
            setShippingAddress({
                fullName: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: "",
                area: "inside_dhaka",
            })
            setIsAddressFieldsDisabled(false)
            setIsCreatingNewAddress(false)
        }

        // Auto-select the default address if customer has addresses
        if (customer.addresses && customer.addresses.length > 0) {
            const defaultAddress = customer.addresses.find(addr => addr.isDefault)
            if (defaultAddress) {
                setSelectedAddress(defaultAddress.id)
            }
        }
    }

    const handleCreateNewAddress = () => {
        setIsCreatingNewAddress(true)
        setIsAddressFieldsDisabled(false)
        setSelectedAddress(null)
        // Clear the address fields for new entry
        setShippingAddress({
            fullName: selectedCustomer?.name || "",
            phone: selectedCustomer?.phone || "",
            email: selectedCustomer?.email || "",
            address: "",
            area: "inside_dhaka",
        })
    }

    const handleAddressSelect = (addressId) => {
        if (selectedCustomer && selectedCustomer.addresses) {
            const address = selectedCustomer.addresses.find((addr) => addr.id == addressId)

            if (address) {
                setShippingAddress({
                    fullName: selectedCustomer.name,
                    phone: selectedCustomer.phone,
                    email: selectedCustomer.email,
                    address: address.address_line,
                    area: address.area,
                })
                setIsAddressFieldsDisabled(true)
                setIsCreatingNewAddress(false)
                setSelectedAddress(addressId)
            }
        }
    }

    const handleNewCustomerClick = () => {
        setShowNewCustomerForm(!showNewCustomerForm)
        if (!showNewCustomerForm) {
            // Reset shipping address fields when opening new customer form
            setShippingAddress({
                fullName: "",
                phone: "",
                email: "",
                address: "",
                area: "inside_dhaka",
            })
            setSelectedCustomer(null)
            setIsAddressFieldsDisabled(false)
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

    // Calculate shipping cost based on area and method
    const getShippingCost = () => {
        if (shippingMethod === 'free') return 0
        const area = shippingAddress.area || 'inside_dhaka'
        return shippingCosts[area]?.[shippingMethod] || 0
    }

    const shippingCost = getShippingCost()
    const discountValue = (subtotal * discountAmount) / 100
    const tax = 0 // This will be calculated on the backend
    const total = subtotal - discountValue + shippingCost + tax

    // Validation functions
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const isValidPhone = (phone) => {
        // Allow various phone formats: +1234567890, 1234567890, (123) 456-7890, etc.
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
        return phoneRegex.test(phone.replace(/\s/g, ''))
    }

    const handlePlaceOrder = () => {
        // Determine if it's a guest customer
        const isGuestCustomer = selectedCustomer?.type === 'guest'

        // Determine if it's a new address
        const isNewAddress = isCreatingNewAddress

        // Get selected address ID (if not a new address)
        const selectedAddressId = isNewAddress ? null : selectedAddress

        // Prepare shipping address JSON
        const shippingAddressData = {
            full_name: shippingAddress.fullName,
            phone: shippingAddress.phone,
            email: shippingAddress.email,
            address_line: shippingAddress.address,
            area: shippingAddress.area
        }

        // Prepare billing address JSON (same as shipping for now)
        const billingAddressData = {
            full_name: shippingAddress.fullName,
            phone: shippingAddress.phone,
            email: shippingAddress.email,
            address_line: shippingAddress.address,
            area: shippingAddress.area
        }

        // Clean order data with only essential information
        const orderData = {
            // Customer information
            user_id: isGuestCustomer ? null : selectedCustomer?.id || null,

            // Address information (JSON format)
            shipping_address: shippingAddressData,
            billing_address: billingAddressData,

            // Order items
            items: cart.map(item => ({
                product_id: item.productId,
                variant_id: item.variantId,
                quantity: item.quantity,
                price: item.price
            })),

            // Order details
            payment_method: paymentMethod,
            shipping_method: shippingMethod,
            notes: orderNotes,
            discount_code: discountCode,
            discount_amount: discountAmount,

            // Notifications
            send_confirmation_email: sendConfirmationEmail,
            send_invoice: sendInvoice,

            // Totals
            subtotal: subtotal,
            shipping_cost: shippingCost,
            discount_total: discountValue,
            tax_total: tax,
            total: total
        }

        // console.log("Clean order data:", orderData)

        // Submit order using Inertia
        setIsSubmitting(true)
        const loadingToast = toast.loading('Creating order...')
        router.post('/orders/store', orderData, {
            onStart: () => {
            },
            onSuccess: (page) => {
                setIsSubmitting(false)
                toast.dismiss(loadingToast)
                toast.success("Order placed successfully!")
            },
            onError: (errors) => {
                setIsSubmitting(false)
                toast.dismiss(loadingToast)
                if (errors && typeof errors === 'object') {
                    const errorMessages = Object.values(errors).flat()
                    toast.error(errorMessages.join(', '))
                } else {
                    toast.error("Failed to place order. Please try again.")
                }
            }
        })
    }

    const canProceedToStep2 = cart.length > 0

    const canProceedToStep3 =
        selectedCustomer !== null &&
        shippingAddress.fullName.trim() !== "" &&
        shippingAddress.phone.trim() !== "" &&
        shippingAddress.email.trim() !== "" &&
        shippingAddress.address.trim() !== "" &&
        shippingAddress.area.trim() !== "" &&
        isValidEmail(shippingAddress.email) &&
        isValidPhone(shippingAddress.phone)

    const canProceedToStep4 = paymentMethod !== "" && shippingMethod !== ""

    const steps = [
        { number: 1, title: "Add Products" },
        { number: 2, title: "Select Customer" },
        { number: 3, title: "Payment & Shipping" },
        { number: 4, title: "Review & Confirm" },
    ]


    return (
        <AuthenticatedLayout>
            <div className="py-4">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl leading-9 font-bold text-text-primary">Create New Order</h2>
                                <p className="text-sm text-text-secondary mt-2">Place an order on behalf of a customer</p>
                            </div>
                            <Link href="/orders">
                                <Button
                                    variant="outline"
                                    className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all bg-transparent"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </Button>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mb-10">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                disabled={currentStep === 1}
                                className="gap-2 px-6 h-11 hover:bg-muted transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            <div className="text-sm font-semibold text-muted-foreground bg-muted px-6 py-2 rounded-full">
                                Step {currentStep} of {steps.length}
                            </div>

                            {currentStep < 4 ? (
                                <Button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={
                                        (currentStep === 1 && !canProceedToStep2) ||
                                        (currentStep === 2 && !canProceedToStep3) ||
                                        (currentStep === 3 && !canProceedToStep4)
                                    }
                                    className="gap-2 px-6 h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <div className="w-28" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="transition-all duration-300">
                            {/* Step 1: Product Selection */}
                            {currentStep === 1 && (
                                <div className="flex md:flex-row flex-col-reverse justify-center flex-wrap gap-8">
                                    <div className="w-full md:max-w-[900px] space-y-6">
                                        <ProductSelection
                                            products={products}
                                            addToCart={addToCart}
                                            cart={cart}
                                        />
                                    </div>

                                    {/* Cart Summary */}
                                    <div className="space-y-6 w-full md:max-w-[400px]">
                                        <CartSummary
                                            cart={cart}
                                            updateQuantity={updateQuantity}
                                            removeFromCart={removeFromCart}
                                            subtotal={subtotal}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Customer Selection & Address */}
                            {currentStep === 2 && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        <CustomerSelection
                                            customers={customers}
                                            selectedCustomer={selectedCustomer}
                                            setSelectedCustomer={setSelectedCustomer}
                                            showNewCustomerForm={showNewCustomerForm}
                                            setShowNewCustomerForm={setShowNewCustomerForm}
                                            newCustomerData={newCustomerData}
                                            setNewCustomerData={setNewCustomerData}
                                            shippingAddress={shippingAddress}
                                            setShippingAddress={setShippingAddress}
                                            handleCustomerSelect={handleCustomerSelect}
                                            handleCreateCustomer={handleCreateCustomer}
                                            handleNewCustomerClick={handleNewCustomerClick}
                                            handleCreateNewAddress={handleCreateNewAddress}
                                            handleAddressSelect={handleAddressSelect}
                                            selectedAddress={selectedAddress}
                                            isAddressFieldsDisabled={isAddressFieldsDisabled}
                                            setIsAddressFieldsDisabled={setIsAddressFieldsDisabled}
                                            handleShippingAddressChange={handleShippingAddressChange}
                                        />
                                    </div>

                                    {/* Cart Summary */}
                                    <div className="space-y-6">
                                        <CartSummary
                                            cart={cart}
                                            updateQuantity={updateQuantity}
                                            removeFromCart={removeFromCart}
                                            subtotal={subtotal}
                                            isCompact={true}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment & Shipping */}
                            {currentStep === 3 && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        <PaymentShipping
                                            shippingMethod={shippingMethod}
                                            setShippingMethod={setShippingMethod}
                                            paymentMethod={paymentMethod}
                                            setPaymentMethod={setPaymentMethod}
                                            orderNotes={orderNotes}
                                            setOrderNotes={setOrderNotes}
                                            shippingCosts={shippingCosts}
                                            shippingAddress={shippingAddress}
                                        />
                                    </div>

                                    {/* Order Summary */}
                                    <div className="space-y-6">
                                        <OrderSummary
                                            subtotal={subtotal}
                                            discountAmount={discountAmount}
                                            discountValue={discountValue}
                                            shippingCost={shippingCost}
                                            tax={tax}
                                            total={total}
                                            isCompact={true}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review & Confirm */}
                            {currentStep === 4 && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        <OrderReview
                                            selectedCustomer={selectedCustomer}
                                            cart={cart}
                                            shippingAddress={shippingAddress}
                                            shippingMethod={shippingMethod}
                                            paymentMethod={paymentMethod}
                                            orderNotes={orderNotes}
                                            discountAmount={discountAmount}
                                            discountCode={discountCode}
                                            sendConfirmationEmail={sendConfirmationEmail}
                                            setSendConfirmationEmail={setSendConfirmationEmail}
                                            sendInvoice={sendInvoice}
                                            setSendInvoice={setSendInvoice}
                                        />
                                    </div>

                                    {/* Final Summary */}
                                    <div className="space-y-6">
                                        <OrderSummary
                                            subtotal={subtotal}
                                            discountAmount={discountAmount}
                                            discountValue={discountValue}
                                            shippingCost={shippingCost}
                                            tax={tax}
                                            total={total}
                                            selectedCustomer={selectedCustomer}
                                            cart={cart}
                                            shippingAddress={shippingAddress}
                                            showInvoicePreview={showInvoicePreview}
                                            setShowInvoicePreview={setShowInvoicePreview}
                                            handlePlaceOrder={handlePlaceOrder}
                                            isSubmitting={isSubmitting}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
