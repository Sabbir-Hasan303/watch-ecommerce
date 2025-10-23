import { useState } from "react"
import { Link } from "@inertiajs/react"
import { ArrowRight, ArrowLeft, X } from "lucide-react"
import { Button } from "@mui/material"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import ProductSelection from "./components/ProductSelection"
import CartSummary from "./components/CartSummary"
import CustomerSelection from "./components/CustomerSelection"
import PaymentShipping from "./components/PaymentShipping"
import OrderReview from "./components/OrderReview"
import OrderSummary from "./components/OrderSummary"

const mockCustomers = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        type: "vip",
        totalOrders: 45,
        totalSpent: 12450.0,
        lastOrderDate: "2024-02-10",
        defaultShippingAddress: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
        },
        addresses: [
            {
                id: 1,
                name: "Home Address",
                street: "123 Main St",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                country: "USA",
                isDefault: true,
            },
            {
                id: 2,
                name: "Office Address",
                street: "456 Business Ave",
                city: "New York",
                state: "NY",
                zipCode: "10002",
                country: "USA",
                isDefault: false,
            },
        ],
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 (555) 234-5678",
        address: "456 Oak Ave, Los Angeles, CA 90001",
        type: "regular",
        totalOrders: 12,
        totalSpent: 3200.0,
        lastOrderDate: "2024-02-05",
        defaultShippingAddress: {
            street: "456 Oak Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "USA",
        },
        addresses: [
            {
                id: 1,
                name: "Home Address",
                street: "456 Oak Ave",
                city: "Los Angeles",
                state: "CA",
                zipCode: "90001",
                country: "USA",
                isDefault: true,
            },
        ],
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "+1 (555) 345-6789",
        address: "789 Pine Rd, Chicago, IL 60601",
        type: "new",
        totalOrders: 2,
        totalSpent: 450.0,
        lastOrderDate: "2024-02-15",
        defaultShippingAddress: {
            street: "789 Pine Rd",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
            country: "USA",
        },
        addresses: [
            {
                id: 1,
                name: "Home Address",
                street: "789 Pine Rd",
                city: "Chicago",
                state: "IL",
                zipCode: "60601",
                country: "USA",
                isDefault: true,
            },
        ],
    },
    {
        id: "4",
        name: "Alice Williams",
        email: "alice@example.com",
        phone: "+1 (555) 456-7890",
        address: "321 Elm St, Miami, FL 33101",
        type: "vip",
        totalOrders: 67,
        totalSpent: 18900.0,
        lastOrderDate: "2024-02-12",
        defaultShippingAddress: {
            street: "321 Elm St",
            city: "Miami",
            state: "FL",
            zipCode: "33101",
            country: "USA",
        },
    },
]

const mockProducts = [
    {
        id: "1",
        name: "Wireless Headphones Pro",
        price: 299.99,
        stock: 5,
        image: "http://127.0.0.1:8000/storage/products/4/zMiOkSYPjhJLqs4SGAVsw7EtAeTKQYv55Q0aStVc.webp",
        category: "Electronics",
        sku: "WHP-001",
        lowStockThreshold: 10,
    },
    {
        id: "2",
        name: "Smart Watch Ultra",
        price: 499.99,
        stock: 23,
        image: "http://127.0.0.1:8000/storage/products/5/variants/erwVWL65ImzrqAbLCX65k6PauvE3ct2NofhmcYXy.webp",
        category: "Electronics",
        sku: "SWU-002",
        lowStockThreshold: 15,
    },
    {
        id: "3",
        name: "Premium Yoga Mat",
        price: 79.99,
        stock: 67,
        image: "/placeholder.svg?height=60&width=60",
        category: "Sports",
        sku: "PYM-003",
        lowStockThreshold: 20,
    },
    {
        id: "4",
        name: "Designer Backpack",
        price: 149.99,
        stock: 2,
        image: "/placeholder.svg?height=60&width=60",
        category: "Fashion",
        sku: "DBP-004",
        lowStockThreshold: 5,
    },
    {
        id: "5",
        name: "LED Desk Lamp",
        price: 59.99,
        stock: 89,
        image: "/placeholder.svg?height=60&width=60",
        category: "Home",
        sku: "LDL-005",
        lowStockThreshold: 25,
    },
]

export default function CreateOrder() {
    const [currentStep, setCurrentStep] = useState(1)

    // Step 1: Product Selection
    const [productSearch, setProductSearch] = useState("")
    const [cart, setCart] = useState([])

    // Step 2: Customer Selection & Address
    const [customerSearch, setCustomerSearch] = useState("")
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

    const filteredCustomers =
        customerSearch.length > 0
            ? mockCustomers.filter((customer) => {
                const matchesSearch =
                    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                    customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                    customer.phone.includes(customerSearch)
                return matchesSearch
            })
            : []

    const filteredProducts =
        productSearch.length > 0
            ? mockProducts.filter(
                (product) =>
                    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                    product.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
                    product.category.toLowerCase().includes(productSearch.toLowerCase()),
            )
            : []

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
                street: newCustomerData.address,
                city: "",
                state: "",
                zipCode: "",
                country: "",
            },
        }

        setSelectedCustomer(newCustomer)

        setShippingAddress({
            fullName: newCustomerData.fullName,
            phone: newCustomerData.phone,
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
        setCustomerSearch("")

        // Auto-fill shipping address with customer's default address
        if (customer.defaultShippingAddress) {
            setShippingAddress({
                fullName: customer.name,
                phone: customer.phone,
                address: customer.defaultShippingAddress.street,
                area: "inside_dhaka",
            })
            setIsAddressFieldsDisabled(true)
            setIsCreatingNewAddress(false)
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
            address: "",
            area: "inside_dhaka",
        })
    }

    const handleAddressSelect = (addressId) => {
        if (selectedCustomer && selectedCustomer.addresses) {
            const address = selectedCustomer.addresses.find((addr) => addr.id === addressId)
            if (address) {
                setShippingAddress({
                    fullName: selectedCustomer.name,
                    phone: selectedCustomer.phone,
                    address: address.street,
                    area: "inside_dhaka",
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
                address: "",
                area: "inside_dhaka",
            })
            setSelectedCustomer(null)
            setIsAddressFieldsDisabled(false)
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = shippingMethod === "express" ? 25.0 : shippingMethod === "standard" ? 10.0 : 0
    const discountValue = (subtotal * discountAmount) / 100
    const tax = (subtotal - discountValue) * 0.08
    const total = subtotal - discountValue + shippingCost + tax

    const handlePlaceOrder = () => {
        console.log("Placing order:", {
            customer: selectedCustomer,
            cart,
            shippingAddress,
            paymentMethod,
            shippingMethod,
            orderNotes,
            discountCode,
            discountAmount,
            sendConfirmationEmail,
            sendInvoice,
            total,
        })

        alert("Order placed successfully! Redirecting to order details...")
        // router.push('/orders')
    }

    const canProceedToStep2 = cart.length > 0

    const canProceedToStep3 =
        selectedCustomer !== null &&
        shippingAddress.fullName.trim() !== "" &&
        shippingAddress.phone.trim() !== "" &&
        shippingAddress.address.trim() !== "" &&
        shippingAddress.area.trim() !== ""

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
                                            productSearch={productSearch}
                                            setProductSearch={setProductSearch}
                                            filteredProducts={filteredProducts}
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
                                            customerSearch={customerSearch}
                                            setCustomerSearch={setCustomerSearch}
                                            filteredCustomers={filteredCustomers}
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
