import { React, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Link, router } from '@inertiajs/react'
import { Search, User, Package, ShoppingCart, CreditCard, MapPin, Mail, FileText, Send, Plus, Minus, X, Check, ArrowRight, ArrowLeft, Truck, DollarSign, AlertTriangle, Tag, Calendar, MessageSquare, Eye, Filter, Star, TrendingUp, Clock, Percent, Download, Printer, UserPlus } from 'lucide-react'
import { Button, RadioGroup, Radio, FormControlLabel, FormControl, FormLabel, Switch, Avatar } from '@mui/material'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CustomSelectField from '@/components/CustomSelectField'
import CustomTextField from '@/components/CustomTextField'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CheckBox } from '@mui/icons-material'

const mockCustomers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001',
        type: 'vip',
        totalOrders: 45,
        totalSpent: 12450.0,
        lastOrderDate: '2024-02-10',
        defaultShippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
        }
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 234-5678',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        type: 'regular',
        totalOrders: 12,
        totalSpent: 3200.0,
        lastOrderDate: '2024-02-05',
        defaultShippingAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
            country: 'USA'
        }
    },
    {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1 (555) 345-6789',
        address: '789 Pine Rd, Chicago, IL 60601',
        type: 'new',
        totalOrders: 2,
        totalSpent: 450.0,
        lastOrderDate: '2024-02-15',
        defaultShippingAddress: {
            street: '789 Pine Rd',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'USA'
        }
    },
    {
        id: '4',
        name: 'Alice Williams',
        email: 'alice@example.com',
        phone: '+1 (555) 456-7890',
        address: '321 Elm St, Miami, FL 33101',
        type: 'vip',
        totalOrders: 67,
        totalSpent: 18900.0,
        lastOrderDate: '2024-02-12',
        defaultShippingAddress: {
            street: '321 Elm St',
            city: 'Miami',
            state: 'FL',
            zipCode: '33101',
            country: 'USA'
        }
    }
]

const mockProducts = [
    {
        id: '1',
        name: 'Wireless Headphones Pro',
        price: 299.99,
        stock: 5,
        image: 'http://127.0.0.1:8000/storage/products/4/zMiOkSYPjhJLqs4SGAVsw7EtAeTKQYv55Q0aStVc.webp',
        category: 'Electronics',
        sku: 'WHP-001',
        lowStockThreshold: 10
    },
    {
        id: '2',
        name: 'Smart Watch Ultra',
        price: 499.99,
        stock: 23,
        image: 'http://127.0.0.1:8000/storage/products/5/variants/erwVWL65ImzrqAbLCX65k6PauvE3ct2NofhmcYXy.webp',
        category: 'Electronics',
        sku: 'SWU-002',
        lowStockThreshold: 15
    },
    {
        id: '3',
        name: 'Premium Yoga Mat',
        price: 79.99,
        stock: 67,
        image: '/placeholder.svg?height=60&width=60',
        category: 'Sports',
        sku: 'PYM-003',
        lowStockThreshold: 20
    },
    {
        id: '4',
        name: 'Designer Backpack',
        price: 149.99,
        stock: 2,
        image: '/placeholder.svg?height=60&width=60',
        category: 'Fashion',
        sku: 'DBP-004',
        lowStockThreshold: 5
    },
    {
        id: '5',
        name: 'LED Desk Lamp',
        price: 59.99,
        stock: 89,
        image: '/placeholder.svg?height=60&width=60',
        category: 'Home',
        sku: 'LDL-005',
        lowStockThreshold: 25
    }
]

export default function CreateOrder() {
    const [currentStep, setCurrentStep] = useState(1)

    // Step 1: Product Selection
    const [productSearch, setProductSearch] = useState('')
    const [cart, setCart] = useState([])

    // Step 2: Customer Selection & Address
    const [customerSearch, setCustomerSearch] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
    const [newCustomerData, setNewCustomerData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    })

    // Address fields
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    })
    const [billingAddress, setBillingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    })
    const [useDefaultAddress, setUseDefaultAddress] = useState(false)
    const [sameAsShipping, setSameAsShipping] = useState(true)

    // Step 3: Payment & Shipping
    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [shippingMethod, setShippingMethod] = useState('standard')
    const [orderNotes, setOrderNotes] = useState('')
    const [discountCode, setDiscountCode] = useState('')
    const [discountAmount, setDiscountAmount] = useState(0)
    const [scheduleOrder, setScheduleOrder] = useState(false)
    const [scheduledDate, setScheduledDate] = useState('')

    // Step 4: Confirmation & Notifications
    const [sendConfirmationEmail, setSendConfirmationEmail] = useState(true)
    const [sendInvoice, setSendInvoice] = useState(true)
    const [generateInvoice, setGenerateInvoice] = useState(true)
    const [sendSMS, setSendSMS] = useState(false)
    const [emailTemplate, setEmailTemplate] = useState('standard')
    const [showInvoicePreview, setShowInvoicePreview] = useState(false)

    const filteredCustomers = customerSearch.length > 0 ? mockCustomers.filter(customer => {
        const matchesSearch =
            customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
            customer.phone.includes(customerSearch)
        return matchesSearch
    }) : []

    const filteredProducts = productSearch.length > 0 ? mockProducts.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(productSearch.toLowerCase())
    ) : []

    const addToCart = product => {
        const existingItem = cart.find(item => item.id === product.id)
        if (existingItem) {
            setCart(cart.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }
    }

    const updateQuantity = (productId, change) => {
        setCart(
            cart
                .map(item => {
                    if (item.id === productId) {
                        const newQuantity = item.quantity + change
                        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
                    }
                    return item
                })
                .filter(item => item !== null)
        )
    }

    const removeFromCart = productId => {
        setCart(cart.filter(item => item.id !== productId))
    }

    const applyDiscountCode = () => {
        const validCodes = {
            SAVE10: 10,
            SAVE20: 20,
            VIP25: 25,
            WELCOME15: 15
        }

        if (validCodes[discountCode.toUpperCase()]) {
            setDiscountAmount(validCodes[discountCode.toUpperCase()])
            alert(`Discount code applied! ${validCodes[discountCode.toUpperCase()]}% off`)
        } else {
            alert('Invalid discount code')
            setDiscountAmount(0)
        }
    }

    const handleUseDefaultAddress = checked => {
        setUseDefaultAddress(checked)
        if (checked && selectedCustomer?.defaultShippingAddress) {
            setShippingAddress(selectedCustomer.defaultShippingAddress)
            if (sameAsShipping) {
                setBillingAddress(selectedCustomer.defaultShippingAddress)
            }
        }
    }

    const handleSameAsShipping = checked => {
        setSameAsShipping(checked)
        if (checked) {
            setBillingAddress(shippingAddress)
        }
    }

    const handleShippingAddressChange = (field, value) => {
        const newAddress = { ...shippingAddress, [field]: value }
        setShippingAddress(newAddress)
        if (sameAsShipping) {
            setBillingAddress(newAddress)
        }
    }

    const handleCreateCustomer = () => {
        const newCustomer = {
            id: Date.now().toString(),
            name: `${newCustomerData.firstName} ${newCustomerData.lastName}`,
            email: newCustomerData.email,
            phone: newCustomerData.phone,
            address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
            type: 'new',
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: new Date().toISOString().split('T')[0],
            defaultShippingAddress: {
                street: shippingAddress.street,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country
            }
        }
        setSelectedCustomer(newCustomer)
        setBillingAddress(shippingAddress)
        setShowNewCustomerForm(false)
        setNewCustomerData({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        })
    }

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer)
        if (customer.defaultShippingAddress) {
            setShippingAddress(customer.defaultShippingAddress)
            setBillingAddress(customer.defaultShippingAddress)
        }
    }

    const handleNewCustomerClick = () => {
        setShowNewCustomerForm(!showNewCustomerForm)
        if (!showNewCustomerForm) {
            // Reset shipping address fields when opening new customer form
            setShippingAddress({
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            })
            setSelectedCustomer(null)
        }
    }

    const handleSendEmail = () => {
        console.log('Sending order confirmation email...')
        alert('Order confirmation email sent!')
    }

    const handleGenerateInvoicePDF = () => {
        console.log('Generating invoice PDF...')
        alert('Invoice generated and downloaded!')
    }

    const handlePrintPackingSlip = () => {
        console.log('Printing packing slip...')
        alert('Packing slip sent to printer!')
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = shippingMethod === 'express' ? 25.0 : shippingMethod === 'standard' ? 10.0 : 0
    const discountValue = (subtotal * discountAmount) / 100
    const tax = (subtotal - discountValue) * 0.08
    const total = subtotal - discountValue + shippingCost + tax

    const handlePlaceOrder = () => {
        console.log('Placing order:', { customer: selectedCustomer, cart, shippingAddress, billingAddress, paymentMethod, shippingMethod, orderNotes, discountCode, discountAmount, scheduleOrder, scheduledDate, sendConfirmationEmail, sendInvoice, generateInvoice, sendSMS, emailTemplate, total })

        alert('Order placed successfully! Redirecting to order details...')
        router.push('/orders')
    }

    const canProceedToStep2 = cart.length > 0
    const canProceedToStep3 = selectedCustomer !== null && shippingAddress.street.trim() !== '' && shippingAddress.city.trim() !== '' && shippingAddress.zipCode.trim() !== ''
    const canProceedToStep4 = paymentMethod !== '' && shippingMethod !== ''

    const steps = [
        { number: 1, title: 'Add Products', icon: Package },
        { number: 2, title: 'Select Customer', icon: User },
        { number: 3, title: 'Payment & Shipping', icon: Truck },
        { number: 4, title: 'Review & Confirm', icon: Check }
    ]


    const isLowStock = product => product.stock <= product.lowStockThreshold
    return (
        <AuthenticatedLayout>
            <div className='py-4'>
                {/* Header */}
                <div className='space-y-6'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div>
                            <h2 className='text-2xl leading-9 font-bold text-text-primary'>Create New Order</h2>
                            <p className='text-sm text-muted-foreground mt-1'>Place an order on behalf of a customer</p>
                        </div>
                        <Link href='/orders'>
                            <Button variant='outlined'>
                                <X className='w-4 h-4 mr-2' />
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Progress Steps */}
                {/* <div className='py-4'>
                    <div className='flex items-center justify-between custom-container mx-auto'>
                        {steps.map((step, index) => {
                            const StepIcon = step.icon
                            const isActive = currentStep === step.number
                            const isCompleted = currentStep > step.number

                            return (
                                <div key={step.number} className='flex items-center flex-1'>
                                    <div className='flex flex-col items-center flex-1'>
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                                                : isActive
                                                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500 text-emerald-500'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}>
                                            {isCompleted ? <Check className='w-6 h-6' /> : <StepIcon className='w-6 h-6' />}
                                        </div>
                                        <p
                                            className={`text-xs mt-2 font-medium text-center ${isActive ? 'text-emerald-500' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                                }`}>
                                            {step.title}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-border'
                                                }`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div> */}

                <div className='py-6'>
                    <div className='custom-container mx-auto flex items-center justify-between'>
                        <Button variant='outline' onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1} className='gap-2'>
                            <ArrowLeft className='w-4 h-4' />
                            Previous
                        </Button>

                        <div className='text-sm text-muted-foreground'>
                            Step {currentStep} of {steps.length}
                        </div>

                        {currentStep < 4 ? (
                            <Button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                disabled={
                                    (currentStep === 1 && !canProceedToStep2) || (currentStep === 2 && !canProceedToStep3) || (currentStep === 3 && !canProceedToStep4)
                                }
                                className='gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'>
                                Next
                                <ArrowRight className='w-4 h-4' />
                            </Button>
                        ) : (
                            <div className='w-24' />
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className='py-6'>
                    <div className='custom-container mx-auto'>
                        {/* Step 1: Product Selection */}
                        {currentStep === 1 && (
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 duration-500'>
                                <div className='lg:col-span-2 space-y-6'>
                                    <Card className='p-6 bg-card border-border'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-emerald-500/10 rounded-lg'>
                                                <Package className='w-6 h-6 text-emerald-500' />
                                            </div>
                                            <div>
                                                <h2 className='text-xl font-semibold text-foreground'>Add Products</h2>
                                                <p className='text-sm text-muted-foreground'>Search and add products to the order</p>
                                            </div>
                                        </div>

                                        <div className='mb-6'>
                                            <CustomTextField
                                                label="Search Products"
                                                placeholder="Search by name, SKU, or category..."
                                                value={productSearch}
                                                onChange={(e) => setProductSearch(e.target.value)}
                                                suggestion={true}
                                                suggestions={filteredProducts.map(product => product.name)}
                                                onSelect={(selectedProduct) => {
                                                    const product = filteredProducts.find(p => p.name === selectedProduct)
                                                    if (product) {
                                                        addToCart(product)
                                                        setProductSearch('')
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            {filteredProducts.map(product => (
                                                <Card key={product.id} className='p-4 border-border hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg'>
                                                    <div className='flex gap-3'>
                                                        <img
                                                            src={product.image || '/placeholder.svg'}
                                                            alt={product.name}
                                                            className='w-16 h-16 rounded-lg object-cover bg-muted'
                                                        />
                                                        <div className='flex-1'>
                                                            <h3 className='font-semibold text-foreground text-sm'>{product.name}</h3>
                                                            <p className='text-xs text-muted-foreground mt-1'>
                                                                {product.category} • SKU: {product.sku}
                                                            </p>
                                                            <div className='flex items-center justify-between mt-2'>
                                                                <p className='font-bold text-emerald-500'>${product.price.toFixed(2)}</p>
                                                                {isLowStock(product) ? (
                                                                    <Badge variant='outline' className='text-xs border-orange-500 text-orange-500'>
                                                                        <AlertTriangle className='w-3 h-3 mr-1' />
                                                                        Low: {product.stock}
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant='outline' className='text-xs'>
                                                                        {product.stock} in stock
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <Button
                                                                size='sm'
                                                                onClick={() => addToCart(product)}
                                                                className='w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                                                                disabled={product.stock === 0}>
                                                                <Plus className='w-4 h-4 mr-1' />
                                                                Add to Cart
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </Card>
                                </div>

                                {/* Cart Summary */}
                                <div className='space-y-6'>
                                    <Card className='p-6 bg-card border-border sticky top-6'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-purple-500/10 rounded-lg'>
                                                <ShoppingCart className='w-6 h-6 text-purple-500' />
                                            </div>
                                            <div>
                                                <h2 className='text-lg font-semibold text-foreground'>Cart</h2>
                                                <p className='text-xs text-muted-foreground'>{cart.length} items</p>
                                            </div>
                                        </div>

                                        {cart.length === 0 ? (
                                            <div className='text-center py-8'>
                                                <ShoppingCart className='w-12 h-12 text-muted-foreground mx-auto mb-3' />
                                                <p className='text-sm text-muted-foreground'>Cart is empty</p>
                                            </div>
                                        ) : (
                                            <div className='space-y-4'>
                                                {cart.map(item => (
                                                    <div key={item.id} className='flex gap-3 p-3 bg-muted/30 rounded-lg'>
                                                        <img src={item.image || '/placeholder.svg'} alt={item.name} className='w-12 h-12 rounded object-cover' />
                                                        <div className='flex-1'>
                                                            <p className='text-sm font-medium text-foreground'>{item.name}</p>
                                                            <p className='text-xs text-muted-foreground'>${item.price.toFixed(2)}</p>
                                                            {item.quantity > item.stock && (
                                                                <p className='text-xs text-orange-500 flex items-center gap-1 mt-1'>
                                                                    <AlertTriangle className='w-3 h-3' />
                                                                    Exceeds stock!
                                                                </p>
                                                            )}
                                                            <div className='flex items-center gap-2 mt-2'>
                                                                <Button size='icon' variant='outline' className='h-6 w-6 bg-transparent' onClick={() => updateQuantity(item.id, -1)}>
                                                                    <Minus className='w-3 h-3' />
                                                                </Button>
                                                                <span className='text-sm font-medium w-8 text-center'>{item.quantity}</span>
                                                                <Button size='icon' variant='outline' className='h-6 w-6 bg-transparent' onClick={() => updateQuantity(item.id, 1)}>
                                                                    <Plus className='w-3 h-3' />
                                                                </Button>
                                                                <Button
                                                                    size='icon'
                                                                    variant='ghost'
                                                                    className='h-6 w-6 ml-auto text-destructive'
                                                                    onClick={() => removeFromCart(item.id)}>
                                                                    <X className='w-3 h-3' />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className='pt-4 border-t border-border space-y-2'>
                                                    <div className='flex justify-between text-sm'>
                                                        <span className='text-muted-foreground'>Subtotal</span>
                                                        <span className='font-medium text-foreground'>${subtotal.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Customer Selection & Address */}
                        {currentStep === 2 && (
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                                <div className='lg:col-span-2 space-y-6    duration-500'>
                                    <Card className='p-6 bg-card'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-emerald-500/10 rounded-lg'>
                                                <User className='w-6 h-6 text-emerald-500' />
                                            </div>
                                            <div className='flex-1'>
                                                <h2 className='text-xl font-semibold text-foreground'>Select Customer</h2>
                                                <p className='text-sm text-muted-foreground'>Choose the customer for this order</p>
                                            </div>
                                            <Button variant='outline' onClick={handleNewCustomerClick} className='gap-2 bg-transparent'>
                                                <UserPlus className='w-4 h-4' />
                                                New Customer
                                            </Button>
                                        </div>

                                        {/* Customer Search with CustomTextField */}
                                        <div className='mb-6'>
                                            <CustomTextField
                                                label="Search Customers"
                                                placeholder="Search by name, email, or phone..."
                                                value={customerSearch}
                                                onChange={(e) => setCustomerSearch(e.target.value)}
                                                suggestion={true}
                                                suggestions={filteredCustomers.map(customer => customer.name)}
                                                onSelect={(selectedCustomerName) => {
                                                    const customer = filteredCustomers.find(c => c.name === selectedCustomerName)
                                                    if (customer) {
                                                        handleCustomerSelect(customer)
                                                        setCustomerSearch('')
                                                    }
                                                }}
                                            />
                                        </div>

                                        {/* Selected Customer Display */}
                                        {selectedCustomer && !showNewCustomerForm && (
                                            <Card className='p-4 mb-6 bg-emerald-500/5 border-emerald-500/20  slide-in-from-top-2 duration-300'>
                                                <div className='flex items-start justify-between'>
                                                    <div className='flex items-start gap-4 flex-1'>
                                                        <Avatar className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500">
                                                            {selectedCustomer.name.charAt(0)}
                                                        </Avatar>
                                                        <div className='flex-1 min-w-0'>
                                                            <div className='flex items-center gap-2 mb-1'>
                                                                <p className='font-semibold text-foreground'>{selectedCustomer.name}</p>
                                                                <Badge variant='outline' className='text-xs'>
                                                                    {selectedCustomer.type}
                                                                </Badge>
                                                            </div>
                                                            <p className='text-sm text-muted-foreground'>{selectedCustomer.email}</p>
                                                            <p className='text-sm text-muted-foreground'>{selectedCustomer.phone}</p>
                                                            <div className='flex items-center gap-4 mt-2 text-xs text-muted-foreground'>
                                                                <span className='flex items-center gap-1'>
                                                                    <Package className='w-3 h-3' />
                                                                    {selectedCustomer.totalOrders} orders
                                                                </span>
                                                                <span className='flex items-center gap-1'>
                                                                    <DollarSign className='w-3 h-3' />${selectedCustomer.totalSpent.toFixed(0)} spent
                                                                </span>
                                                                <span className='flex items-center gap-1'>
                                                                    <Clock className='w-3 h-3' />
                                                                    Last: {selectedCustomer.lastOrderDate}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0'>
                                                        <Check className='w-5 h-5 text-white' />
                                                    </div>
                                                </div>
                                            </Card>
                                        )}

                                        {/* New Customer Form */}
                                        {showNewCustomerForm && (
                                            <Card className='p-4 mb-6 bg-muted/30 border-emerald-500/20  slide-in-from-top-2 duration-300'>
                                                <h3 className='font-semibold text-foreground mb-4'>Create New Customer</h3>
                                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                                                    <div>
                                                        <CustomTextField label='First Name' name='firstName' value={newCustomerData.firstName} onChange={e => setNewCustomerData({ ...newCustomerData, firstName: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <CustomTextField label='Last Name' name='lastName' value={newCustomerData.lastName} onChange={e => setNewCustomerData({ ...newCustomerData, lastName: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <CustomTextField label='Email' name='email' type='email' value={newCustomerData.email} onChange={e => setNewCustomerData({ ...newCustomerData, email: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <CustomTextField label='Phone' name='phone' type='tel' value={newCustomerData.phone} onChange={e => setNewCustomerData({ ...newCustomerData, phone: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className='flex gap-2 mt-4'>
                                                    <Button
                                                        onClick={handleCreateCustomer}
                                                        disabled={!newCustomerData.firstName || !newCustomerData.lastName || !newCustomerData.email}
                                                        className='bg-gradient-to-r from-emerald-500 to-teal-500 text-white'>
                                                        Create Customer
                                                    </Button>
                                                    <Button variant='ghost' onClick={() => setShowNewCustomerForm(false)}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </Card>
                                        )}

                                        {/* Shipping Address */}
                                        <Card className='p-6 bg-card border-border'>
                                            <div className='flex items-center gap-3 mb-6'>
                                                <div className='p-3 bg-blue-500/10 rounded-lg'>
                                                    <MapPin className='w-6 h-6 text-blue-500' />
                                                </div>
                                                <div>
                                                    <h2 className='text-xl font-semibold text-foreground'>Shipping Address</h2>
                                                    <p className='text-sm text-muted-foreground'>
                                                        {showNewCustomerForm
                                                            ? 'Enter delivery address for the new customer'
                                                            : 'Enter delivery address'
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='space-y-4'>
                                                {(!useDefaultAddress || showNewCustomerForm) && (
                                                    <div className='space-y-4  slide-in-from-top-2 duration-300'>
                                                        <div>
                                                            <CustomTextField label='Street Address' name='street' value={shippingAddress.street} onChange={e => handleShippingAddressChange('street', e.target.value)} placeholder='123 Main St' />
                                                        </div>
                                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                                            <div>
                                                                <CustomTextField label='City' name='city' value={shippingAddress.city} onChange={e => handleShippingAddressChange('city', e.target.value)} placeholder='New York' />
                                                            </div>
                                                            <div>
                                                                <CustomTextField label='State' name='state' value={shippingAddress.state} onChange={e => handleShippingAddressChange('state', e.target.value)} placeholder='NY' />
                                                            </div>
                                                        </div>
                                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                                            <div>
                                                                <CustomTextField label='ZIP Code' name='zipCode' value={shippingAddress.zipCode} onChange={e => handleShippingAddressChange('zipCode', e.target.value)} placeholder='10001' />
                                                            </div>
                                                            <div>
                                                                <CustomTextField label='Country' name='country' value={shippingAddress.country} onChange={e => handleShippingAddressChange('country', e.target.value)} placeholder='USA' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </Card>
                                </div>

                                {/* Cart Summary */}
                                <div className='space-y-6'>
                                    <Card className='p-6 bg-card border-border sticky top-6'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-purple-500/10 rounded-lg'>
                                                <ShoppingCart className='w-6 h-6 text-purple-500' />
                                            </div>
                                            <div>
                                                <h2 className='text-lg font-semibold text-foreground'>Cart</h2>
                                                <p className='text-xs text-muted-foreground'>{cart.length} items</p>
                                            </div>
                                        </div>

                                        {cart.length === 0 ? (
                                            <div className='text-center py-8'>
                                                <ShoppingCart className='w-12 h-12 text-muted-foreground mx-auto mb-3' />
                                                <p className='text-sm text-muted-foreground'>Cart is empty</p>
                                            </div>
                                        ) : (
                                            <div className='space-y-4'>
                                                {cart.map(item => (
                                                    <div key={item.id} className='flex gap-3 p-3 bg-muted/30 rounded-lg'>
                                                        <img src={item.image || '/placeholder.svg'} alt={item.name} className='w-12 h-12 rounded object-cover' />
                                                        <div className='flex-1'>
                                                            <p className='text-sm font-medium text-foreground'>{item.name}</p>
                                                            <p className='text-xs text-muted-foreground'>${item.price.toFixed(2)}</p>
                                                            {item.quantity > item.stock && (
                                                                <p className='text-xs text-orange-500 flex items-center gap-1 mt-1'>
                                                                    <AlertTriangle className='w-3 h-3' />
                                                                    Exceeds stock!
                                                                </p>
                                                            )}
                                                            <div className='flex items-center gap-2 mt-2'>
                                                                <Button size='icon' variant='outline' className='h-6 w-6 bg-transparent' onClick={() => updateQuantity(item.id, -1)}>
                                                                    <Minus className='w-3 h-3' />
                                                                </Button>
                                                                <span className='text-sm font-medium w-8 text-center'>{item.quantity}</span>
                                                                <Button size='icon' variant='outline' className='h-6 w-6 bg-transparent' onClick={() => updateQuantity(item.id, 1)}>
                                                                    <Plus className='w-3 h-3' />
                                                                </Button>
                                                                <Button
                                                                    size='icon'
                                                                    variant='ghost'
                                                                    className='h-6 w-6 ml-auto text-destructive'
                                                                    onClick={() => removeFromCart(item.id)}>
                                                                    <X className='w-3 h-3' />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className='pt-4 border-t border-border space-y-2'>
                                                    <div className='flex justify-between text-sm'>
                                                        <span className='text-muted-foreground'>Subtotal</span>
                                                        <span className='font-medium text-foreground'>${subtotal.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment & Shipping */}
                        {currentStep === 3 && (
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6    duration-500'>
                                <div className='lg:col-span-2 space-y-6'>

                                    <Card className='p-6 bg-card border-border'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-purple-500/10 rounded-lg'>
                                                <Truck className='w-6 h-6 text-purple-500' />
                                            </div>
                                            <div>
                                                <h2 className='text-xl font-semibold text-foreground'>Shipping Method</h2>
                                                <p className='text-sm text-muted-foreground'>Choose a shipping option</p>
                                            </div>
                                        </div>

                                        <FormControl component="fieldset" className='w-full'>
                                            <RadioGroup
                                                value={shippingMethod}
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                className="space-y-3"
                                            >
                                                <div className='flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-emerald-500/50 transition-colors'>
                                                    <FormControlLabel
                                                        value="standard"
                                                        control={<Radio />}
                                                        label={
                                                            <div className="flex justify-between items-center w-full">
                                                                <div>
                                                                    <span className='font-medium text-foreground block'>Standard Shipping</span>
                                                                    <span className='text-sm text-muted-foreground'>5-7 business days</span>
                                                                </div>
                                                                <span className='font-semibold text-foreground'>$10.00</span>
                                                            </div>
                                                        }
                                                        sx={{
                                                            '& .MuiTypography-root': {
                                                                width: '100%',
                                                            },
                                                        }}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className='flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-emerald-500/50 transition-colors'>
                                                    <FormControlLabel
                                                        value="free"
                                                        control={<Radio />}
                                                        label={
                                                            <div className="flex flex-1 justify-between items-center">
                                                                <div>
                                                                    <span className='font-medium text-foreground block'>Free Shipping</span>
                                                                    <span className='text-sm text-muted-foreground'>7-10 business days</span>
                                                                </div>
                                                                <span className='font-semibold text-emerald-500'>FREE</span>
                                                            </div>
                                                        }
                                                        sx={{
                                                            '& .MuiTypography-root': {
                                                                width: '100%',
                                                            },
                                                        }}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                    </Card>

                                    <Card className='p-6 bg-card border-border'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-orange-500/10 rounded-lg'>
                                                <CreditCard className='w-6 h-6 text-orange-500' />
                                            </div>
                                            <div>
                                                <h2 className='text-xl font-semibold text-foreground'>Payment Method</h2>
                                                <p className='text-sm text-muted-foreground'>How will the customer pay?</p>
                                            </div>
                                        </div>

                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="space-y-3"
                                            >
                                                {[
                                                    // { id: 'credit-card', label: 'Credit Card' },
                                                    // { id: 'paypal', label: 'PayPal' },
                                                    // { id: 'bank-transfer', label: 'Bank Transfer' },
                                                    { id: 'cod', label: 'Cash on Delivery' }
                                                ].map(method => (
                                                    <div
                                                        key={method.id}
                                                        className='flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-emerald-500/50 transition-colors'>
                                                        <FormControlLabel
                                                            value={method.id}
                                                            control={<Radio />}
                                                            label={method.label}
                                                            className="flex-1 cursor-pointer text-foreground"
                                                        />
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </Card>

                                    <Card className='p-6 bg-card border-border'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-pink-500/10 rounded-lg'>
                                                <Tag className='w-6 h-6 text-pink-500' />
                                            </div>
                                            <div>
                                                <h2 className='text-xl font-semibold text-foreground'>Discount Code</h2>
                                                <p className='text-sm text-muted-foreground'>Apply a coupon or promo code</p>
                                            </div>
                                        </div>

                                        <div className='flex gap-2'>
                                            <CustomTextField label='Discount Code' name='discountCode' value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder='Enter discount code' />
                                            <Button onClick={applyDiscountCode} variant='outline' className='bg-transparent' disabled={!discountCode}>
                                                Apply
                                            </Button>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className='mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2'>
                                                <Check className='w-4 h-4 text-emerald-500' />
                                                <span className='text-sm text-emerald-500'>
                                                    {discountAmount}% discount applied! Saving ${discountValue.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className='mt-3 text-xs text-muted-foreground'>Try: SAVE10, SAVE20, VIP25, WELCOME15</div>
                                    </Card>

                                    <Card className='p-6 bg-card border-border'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-purple-500/10 rounded-lg'>
                                                <FileText className='w-6 h-6 text-purple-500' />
                                            </div>
                                            <div>
                                                <h2 className='text-xl font-semibold text-foreground'>Order Notes</h2>
                                                <p className='text-sm text-muted-foreground'>Add any special instructions</p>
                                            </div>
                                        </div>
                                        <CustomTextField label='Order Notes' name='orderNotes' value={orderNotes} onChange={e => setOrderNotes(e.target.value)} placeholder='Special delivery instructions, gift message, etc.' rows={4} />
                                    </Card>
                                </div>

                                {/* Order Summary */}
                                <div className='space-y-6'>
                                    <Card className='p-6 bg-card border-border sticky top-6'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-emerald-500/10 rounded-lg'>
                                                <DollarSign className='w-6 h-6 text-emerald-500' />
                                            </div>
                                            <h2 className='text-lg font-semibold text-foreground'>Order Summary</h2>
                                        </div>

                                        <div className='space-y-3'>
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Subtotal ({cart.length} items)</span>
                                                <span className='font-medium text-foreground'>${subtotal.toFixed(2)}</span>
                                            </div>
                                            {discountAmount > 0 && (
                                                <div className='flex justify-between text-sm'>
                                                    <span className='text-emerald-500 flex items-center gap-1'>
                                                        <Percent className='w-3 h-3' />
                                                        Discount ({discountAmount}%)
                                                    </span>
                                                    <span className='font-medium text-emerald-500'>-${discountValue.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Shipping</span>
                                                <span className='font-medium text-foreground'>${shippingCost.toFixed(2)}</span>
                                            </div>
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Tax (8%)</span>
                                                <span className='font-medium text-foreground'>${tax.toFixed(2)}</span>
                                            </div>
                                            <div className='pt-3 border-t border-border flex justify-between'>
                                                <span className='font-semibold text-foreground'>Total</span>
                                                <span className='text-2xl font-bold text-emerald-500'>${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review & Confirm */}
                        {currentStep === 4 && (
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6    duration-500'>
                                <div className='lg:col-span-2 space-y-6'>
                                    {/* Customer Info */}
                                    <Card className='p-6 bg-card border-border'>
                                        <div className='flex items-center gap-3 mb-4'>
                                            <div className='p-2 bg-emerald-500/10 rounded-lg'>
                                                <User className='w-5 h-5 text-emerald-500' />
                                            </div>
                                            <h3 className='font-semibold text-foreground'>Customer Information</h3>
                                        </div>
                                        <div className='space-y-2 text-sm'>
                                            <div className='flex items-center gap-2'>
                                                <p className='text-foreground font-medium'>{selectedCustomer?.name}</p>
                                            </div>
                                            <p className='text-muted-foreground'>{selectedCustomer?.email}</p>
                                            <p className='text-muted-foreground'>{selectedCustomer?.phone}</p>
                                        </div>
                                    </Card>

                                    {/* Order Items */}
                                    <Card className='p-6 bg-card border-border'>
                                        <div className='flex items-center gap-3 mb-4'>
                                            <div className='p-2 bg-teal-500/10 rounded-lg'>
                                                <Package className='w-5 h-5 text-teal-500' />
                                            </div>
                                            <h3 className='font-semibold text-foreground'>Order Items</h3>
                                        </div>
                                        <div className='space-y-3'>
                                            {cart.map(item => (
                                                <div key={item.id} className='flex gap-3 p-3 bg-muted/30 rounded-lg'>
                                                    <img src={item.image || '/placeholder.svg'} alt={item.name} className='w-16 h-16 rounded object-cover' />
                                                    <div className='flex-1'>
                                                        <p className='font-medium text-foreground'>{item.name}</p>
                                                        <p className='text-sm text-muted-foreground'>
                                                            Quantity: {item.quantity} • SKU: {item.sku}
                                                        </p>
                                                        <p className='text-sm font-semibold text-emerald-500 mt-1'>${(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    <Card className='p-6 bg-card border-border'>
                                        <div className='flex items-center gap-3 mb-4'>
                                            <div className='p-2 bg-blue-500/10 rounded-lg'>
                                                <Truck className='w-5 h-5 text-blue-500' />
                                            </div>
                                            <h3 className='font-semibold text-foreground'>Shipping & Payment</h3>
                                        </div>
                                        <div className='grid gap-4 sm:grid-cols-2'>
                                            <div>
                                                <p className='text-sm font-medium text-muted-foreground mb-2'>Shipping Address</p>
                                                <div className='rounded-lg border border-border bg-muted/30 p-3 text-sm'>
                                                    <p className='text-foreground'>{shippingAddress.street}</p>
                                                    <p className='text-foreground'>
                                                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                                                    </p>
                                                    <p className='text-foreground'>{shippingAddress.country}</p>
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-2 justify-center'>
                                                <div className='flex flex-col justify-center'>
                                                    <p className='text-muted-foreground mb-1 text-sm'>Shipping Method</p>
                                                    <p className='text-foreground capitalize'>{shippingMethod.replace('-', ' ')}</p>
                                                </div>
                                                <div className='flex flex-col justify-center'>
                                                    <p className='text-muted-foreground mb-1 text-sm'>Payment Method</p>
                                                    <p className='text-foreground capitalize'>{paymentMethod.replace('-', ' ')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {discountAmount > 0 && (
                                            <div className='mt-4'>
                                                <p className='text-muted-foreground mb-1 text-sm'>Discount Applied</p>
                                                <p className='text-emerald-500 font-medium'>
                                                    {discountCode} - {discountAmount}% off
                                                </p>
                                            </div>
                                        )}

                                        {orderNotes && (
                                            <div className='mt-4'>
                                                <p className='text-muted-foreground mb-1 text-sm'>Order Notes</p>
                                                <p className='text-foreground'>{orderNotes}</p>
                                            </div>
                                        )}
                                    </Card>

                                    <Card className='p-6 bg-card border-border'>
                                        <div className='flex items-center gap-3 mb-4'>
                                            <div className='p-2 bg-purple-500/10 rounded-lg'>
                                                <Mail className='w-5 h-5 text-purple-500' />
                                            </div>
                                            <h3 className='font-semibold text-foreground'>Notifications</h3>
                                        </div>
                                        <div className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <div>
                                                    <p className='text-sm font-medium text-foreground'>Send Order Confirmation Email</p>
                                                    <p className='text-xs text-muted-foreground'>Email customer with order details</p>
                                                </div>
                                                <Switch checked={sendConfirmationEmail} onChange={(e) => setSendConfirmationEmail(e.target.checked)} />
                                            </div>

                                            <div className='flex items-center justify-between'>
                                                <div>
                                                    <p className='text-sm font-medium text-foreground'>Send Invoice Email</p>
                                                    <p className='text-xs text-muted-foreground'>Email invoice to customer</p>
                                                </div>
                                                <Switch checked={sendInvoice} onChange={(e) => setSendInvoice(e.target.checked)} />
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Final Summary with Invoice Preview */}
                                <div className='space-y-6'>
                                    <Card className='p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 sticky top-6'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <div className='p-3 bg-emerald-500/20 rounded-lg'>
                                                <DollarSign className='w-6 h-6 text-emerald-500' />
                                            </div>
                                            <h2 className='text-lg font-semibold text-foreground'>Final Total</h2>
                                        </div>

                                        <div className='space-y-3'>
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Subtotal</span>
                                                <span className='font-medium text-foreground'>${subtotal.toFixed(2)}</span>
                                            </div>
                                            {discountAmount > 0 && (
                                                <div className='flex justify-between text-sm'>
                                                    <span className='text-emerald-500'>Discount</span>
                                                    <span className='font-medium text-emerald-500'>-${discountValue.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Shipping</span>
                                                <span className='font-medium text-foreground'>${shippingCost.toFixed(2)}</span>
                                            </div>
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>Tax</span>
                                                <span className='font-medium text-foreground'>${tax.toFixed(2)}</span>
                                            </div>
                                            <div className='pt-3 border-t border-emerald-500/20 flex justify-between'>
                                                <span className='font-semibold text-foreground'>Total</span>
                                                <span className='text-3xl font-bold text-emerald-500'>${total.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <Dialog open={showInvoicePreview} onOpenChange={setShowInvoicePreview}>
                                            <DialogTrigger asChild>
                                                <Button variant='outline' className='w-full mt-4 bg-transparent'>
                                                    <Eye className='w-4 h-4 mr-2' />
                                                    Preview Invoice
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className='max-w-2xl max-h-[80vh] overflow-auto'>
                                                <DialogHeader>
                                                    <DialogTitle>Invoice Preview</DialogTitle>
                                                    <DialogDescription>Review the invoice before placing the order</DialogDescription>
                                                </DialogHeader>
                                                <div className='p-6 bg-white text-black rounded-lg'>
                                                    <div className='text-center mb-6'>
                                                        <h2 className='text-2xl font-bold'>INVOICE</h2>
                                                        <p className='text-sm text-gray-600'>Order #ORD-{Date.now()}</p>
                                                    </div>
                                                    <div className='grid grid-cols-2 gap-6 mb-6'>
                                                        <div>
                                                            <h3 className='font-semibold mb-2'>Bill To:</h3>
                                                            <p>{selectedCustomer?.name}</p>
                                                            <p className='text-sm text-gray-600'>{selectedCustomer?.email}</p>
                                                            <p className='text-sm text-gray-600'>{selectedCustomer?.phone}</p>
                                                        </div>
                                                        <div>
                                                            <h3 className='font-semibold mb-2'>Ship To:</h3>
                                                            <p className='text-sm text-gray-600'>{shippingAddress.street}</p>
                                                            <p className='text-sm text-gray-600'>
                                                                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                                                            </p>
                                                            <p className='text-sm text-gray-600'>{shippingAddress.country}</p>
                                                        </div>
                                                    </div>
                                                    <table className='w-full mb-6'>
                                                        <thead className='border-b-2 border-gray-300'>
                                                            <tr>
                                                                <th className='text-left py-2'>Item</th>
                                                                <th className='text-right py-2'>Qty</th>
                                                                <th className='text-right py-2'>Price</th>
                                                                <th className='text-right py-2'>Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cart.map(item => (
                                                                <tr key={item.id} className='border-b border-gray-200'>
                                                                    <td className='py-2'>{item.name}</td>
                                                                    <td className='text-right'>{item.quantity}</td>
                                                                    <td className='text-right'>${item.price.toFixed(2)}</td>
                                                                    <td className='text-right'>${(item.price * item.quantity).toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className='flex justify-end'>
                                                        <div className='w-64 space-y-2'>
                                                            <div className='flex justify-between'>
                                                                <span>Subtotal:</span>
                                                                <span>${subtotal.toFixed(2)}</span>
                                                            </div>
                                                            {discountAmount > 0 && (
                                                                <div className='flex justify-between text-green-600'>
                                                                    <span>Discount ({discountAmount}%):</span>
                                                                    <span>-${discountValue.toFixed(2)}</span>
                                                                </div>
                                                            )}
                                                            <div className='flex justify-between'>
                                                                <span>Shipping:</span>
                                                                <span>${shippingCost.toFixed(2)}</span>
                                                            </div>
                                                            <div className='flex justify-between'>
                                                                <span>Tax:</span>
                                                                <span>${tax.toFixed(2)}</span>
                                                            </div>
                                                            <div className='flex justify-between font-bold text-lg border-t-2 border-gray-300 pt-2'>
                                                                <span>Total:</span>
                                                                <span>${total.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex gap-2'>
                                                    <Button variant='outline' className='flex-1 bg-transparent' onClick={() => setShowInvoicePreview(false)}>
                                                        Close
                                                    </Button>
                                                    <Button className='flex-1 bg-gradient-to-r from-emerald-500 to-teal-500'>
                                                        <Download className='w-4 h-4 mr-2' />
                                                        Download PDF
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Button
                                            onClick={handlePlaceOrder}
                                            className='w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 h-12'>
                                            <Send className='w-5 h-5 mr-2' />
                                            Place Order
                                        </Button>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
