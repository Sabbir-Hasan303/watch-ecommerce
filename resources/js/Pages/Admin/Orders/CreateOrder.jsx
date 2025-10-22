import { useState } from "react"
import { Link } from "@inertiajs/react"
import {
  User,
  Package,
  ShoppingCart,
  CreditCard,
  MapPin,
  Mail,
  FileText,
  Send,
  Plus,
  Minus,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Truck,
  DollarSign,
  AlertTriangle,
  Tag,
  Percent,
  Download,
  UserPlus,
  Eye,
} from "lucide-react"
import { Button, RadioGroup, Radio, FormControlLabel, FormControl, Switch, Avatar } from "@mui/material"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CustomTextField from "@/components/CustomTextField"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CustomSelectField from "@/Components/CustomSelectField"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"

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

  const applyDiscountCode = () => {
    const validCodes = {
      SAVE10: 10,
      SAVE20: 20,
      VIP25: 25,
      WELCOME15: 15,
    }

    if (validCodes[discountCode.toUpperCase()]) {
      setDiscountAmount(validCodes[discountCode.toUpperCase()])
      alert(`Discount code applied! ${validCodes[discountCode.toUpperCase()]}% off`)
    } else {
      alert("Invalid discount code")
      setDiscountAmount(0)
    }
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
    { number: 1, title: "Add Products", icon: Package },
    { number: 2, title: "Select Customer", icon: User },
    { number: 3, title: "Payment & Shipping", icon: Truck },
    { number: 4, title: "Review & Confirm", icon: Check },
  ]

  const isLowStock = (product) => product.stock <= product.lowStockThreshold

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
                    <Card className="p-10 bg-card border-border shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl shadow-lg">
                          <Package className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h2 className="text-xl leading-8 font-bold text-text-primary">Add Products</h2>
                          <p className="text-sm text-text-secondary mt-2">Search and add products to the order</p>
                        </div>
                      </div>

                      <div className="mb-10">
                        <CustomTextField
                          label="Search Products"
                          placeholder="Search by name, SKU, or category..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          suggestion={true}
                          suggestions={filteredProducts.map((product) => product.name)}
                          onSelect={(selectedProduct) => {
                            const product = filteredProducts.find((p) => p.name === selectedProduct)
                            if (product) {
                              addToCart(product)
                              setProductSearch("")
                            }
                          }}
                        />
                      </div>

                      {filteredProducts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {filteredProducts.map((product) => (
                            <Card
                              key={product.id}
                              className="p-6 border-border hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                              <div className="flex flex-wrap gap-5">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-24 h-24 rounded-xl object-cover bg-muted shadow-md"
                                />
                                <div className="flex-1">
                                  <h3 className="font-bold text-foreground text-lg">{product.name}</h3>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {product.category} • SKU: {product.sku}
                                  </p>
                                  <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                                    <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                      ${product.price.toFixed(2)}
                                    </p>
                                    {isLowStock(product) ? (
                                      <Badge
                                        variant="outline"
                                        className="text-xs border-orange-500 text-orange-600 bg-orange-50"
                                      >
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Low: {product.stock}
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-emerald-50 border-emerald-500 text-emerald-600"
                                      >
                                        {product.stock} in stock
                                      </Badge>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => addToCart(product)}
                                    className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all"
                                    disabled={product.stock === 0}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Cart Summary */}
                  <div className="space-y-6 w-full md:max-w-[400px]">
                    <Card className="p-8 bg-card border-border sticky top-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl shadow-lg">
                          <ShoppingCart className="w-7 h-7 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-xl leading-8 font-bold text-text-primary">Cart</h2>
                          <p className="text-sm text-text-secondary mt-1">{cart.length} items</p>
                        </div>
                      </div>

                      {cart.length === 0 ? (
                        <div className="text-center py-16">
                          <ShoppingCart className="w-20 h-20 text-muted-foreground mx-auto mb-5 opacity-30" />
                          <p className="text-base font-medium text-text-secondary">Cart is empty</p>
                          <p className="text-sm text-text-secondary mt-2">Add products to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4 p-5 bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                            >
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-20 h-20 rounded-xl object-cover shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                                <p className="text-base font-semibold text-emerald-600 mt-2">${item.price.toFixed(2)}</p>
                                {item.quantity > item.stock && (
                                  <p className="text-xs text-orange-600 flex items-center gap-1 mt-2 font-medium">
                                    <AlertTriangle className="w-3 h-3" />
                                    Exceeds stock!
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-4">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 rounded-lg hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600 bg-transparent"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="text-base font-bold w-12 text-center">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 rounded-lg hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600 bg-transparent"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex justify-end">
                                <Button
                                    size="icon"
                                    variant="outlined"
                                    className="h-8 w-8 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <X className="w-5 h-5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="pt-6 border-t-2 border-border space-y-3">
                            <div className="flex justify-between text-base">
                              <span className="text-muted-foreground font-medium">Subtotal</span>
                              <span className="font-bold text-foreground text-xl">${subtotal.toFixed(2)}</span>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 bg-card border-border shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-emerald-500/10 rounded-xl">
                            <User className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <h2 className="text-xl leading-8 font-bold text-text-primary">Select Customer</h2>
                            <p className="text-sm text-text-secondary mt-1">Choose the customer for this order</p>
                          </div>
                        </div>
                        <Button variant="outlined" onClick={handleNewCustomerClick} className="gap-2 bg-transparent">
                          <UserPlus className="w-4 h-4" />
                          Guest Customer
                        </Button>
                      </div>

                      {/* Customer Search */}
                      {!showNewCustomerForm && !selectedCustomer && (
                        <div className="mb-6">
                          <CustomTextField
                            label="Search Customers"
                            placeholder="Search by name, email, or phone..."
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            suggestion={true}
                            suggestions={filteredCustomers.map((customer) => customer.name)}
                            onSelect={(selectedCustomerName) => {
                              const customer = filteredCustomers.find((c) => c.name === selectedCustomerName)
                              if (customer) {
                                handleCustomerSelect(customer)
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* Selected Customer Display */}
                      {selectedCustomer && !showNewCustomerForm && (
                        <Card className="p-6 mb-6 bg-emerald-500/5 border-emerald-500/20">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <Avatar className="w-14 h-14 bg-emerald-500 text-white text-lg">
                                {selectedCustomer.name.charAt(0)}
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-lg font-semibold text-text-primary">{selectedCustomer.name}</p>
                                </div>
                                <p className="text-sm text-text-secondary">{selectedCustomer.email}</p>
                                <p className="text-sm text-text-secondary">{selectedCustomer.phone}</p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
                                  <span className="flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    {selectedCustomer.totalOrders} orders
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedCustomer(null)
                                  setShippingAddress({
                                    fullName: "",
                                    phone: "",
                                    address: "",
                                    area: "inside_dhaka",
                                  })
                                  setIsAddressFieldsDisabled(false)
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* New Customer Form */}
                      {showNewCustomerForm && (
                        <Card className="p-6 mb-6 bg-muted/30 border-border">
                          <h3 className="text-lg font-semibold text-foreground mb-6">Enter Guest Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                              <CustomTextField
                                label="Full Name"
                                name="fullName"
                                value={newCustomerData.fullName}
                                onChange={(e) => setNewCustomerData({ ...newCustomerData, fullName: e.target.value })}
                                placeholder="John Doe"
                              />
                            </div>
                            <div>
                              <CustomTextField
                                label="Phone"
                                name="phone"
                                value={newCustomerData.phone}
                                onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                                placeholder="+1 (123) 456-7890"
                              />
                            </div>
                            <div>
                              <CustomTextField
                                label="Email"
                                name="email"
                                type="email"
                                value={newCustomerData.email}
                                onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                                placeholder="john.doe@example.com"
                              />
                            </div>
                            <div>
                              <CustomSelectField
                                label="Area"
                                name="area"
                                value={newCustomerData.area}
                                onChange={(e) => setNewCustomerData({ ...newCustomerData, area: e.target.value })}
                                placeholder="Inside Dhaka"
                                options={[
                                  { label: "Inside Dhaka", value: "inside_dhaka" },
                                  { label: "Outside Dhaka", value: "outside_dhaka" },
                                ]}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <CustomTextField
                                label="Full Address"
                                name="address"
                                value={newCustomerData.address}
                                onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                                placeholder="123 Main St, City, State, ZIP"
                              />
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={handleCreateCustomer}
                              disabled={!newCustomerData.fullName || !newCustomerData.phone || !newCustomerData.address}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              Create Guest
                            </Button>
                            <Button variant="outline" onClick={() => setShowNewCustomerForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </Card>
                      )}

                      {/* Shipping Address */}
                      {!showNewCustomerForm && selectedCustomer && (
                        <Card className="p-8 bg-card border-border">
                          <div className="flex flex-wrap items-center justify-between mb-8 gap-5">
                            <div className="flex items-center gap-4">
                              <div className="p-4 bg-blue-500/10 rounded-xl">
                                <MapPin className="w-5 h-5 text-blue-500" />
                              </div>
                              <div>
                                <h2 className="text-xl leading-8 font-bold text-text-primary">Shipping Address</h2>
                                <p className="text-sm text-text-secondary mt-1">Enter delivery address</p>
                              </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center w-full md:w-auto gap-2">
                              {selectedCustomer &&
                                selectedCustomer.addresses &&
                                selectedCustomer.addresses.length > 1 && (
                                  <CustomSelectField
                                    label="Saved Address"
                                    options={selectedCustomer.addresses.map((address) => ({
                                      label: address.name,
                                      value: address.id,
                                    }))}
                                    value={selectedAddress}
                                    onChange={(addressId) => handleAddressSelect(addressId)}
                                    placeholder="Choose address"
                                    className="w-full md:w-48"
                                  />
                                )}

                              <Button
                                onClick={handleCreateNewAddress}
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-transparent"
                              >
                                <Plus className="w-4 h-4" />
                                New Address
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <CustomTextField
                                  label="Full Name"
                                  name="fullName"
                                  value={shippingAddress.fullName}
                                  onChange={(e) => handleShippingAddressChange("fullName", e.target.value)}
                                  placeholder="John Doe"
                                  disabled={isAddressFieldsDisabled}
                                />
                              </div>
                              <div>
                                <CustomTextField
                                  label="Phone"
                                  name="phone"
                                  value={shippingAddress.phone}
                                  onChange={(e) => handleShippingAddressChange("phone", e.target.value)}
                                  placeholder="+1 (123) 456-7890"
                                  disabled={isAddressFieldsDisabled}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <CustomSelectField
                                  label="Area"
                                  name="area"
                                  value={shippingAddress.area}
                                  onChange={(e) => handleShippingAddressChange("area", e.target.value)}
                                  placeholder="Inside Dhaka"
                                  options={[
                                    { label: "Inside Dhaka", value: "inside_dhaka" },
                                    { label: "Outside Dhaka", value: "outside_dhaka" },
                                  ]}
                                  disabled={isAddressFieldsDisabled}
                                />
                              </div>
                              <div>
                                <CustomTextField
                                  label="Full Address"
                                  name="address"
                                  value={shippingAddress.address}
                                  onChange={(e) => handleShippingAddressChange("address", e.target.value)}
                                  placeholder="123 Main St, City, State, ZIP"
                                  disabled={isAddressFieldsDisabled}
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}
                    </Card>
                  </div>

                  {/* Cart Summary */}
                  <div className="space-y-6">
                    <Card className="p-6 bg-card border-border shadow-sm sticky top-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                          <ShoppingCart className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">Cart</h2>
                          <p className="text-sm text-muted-foreground">{cart.length} items</p>
                        </div>
                      </div>

                      {cart.length === 0 ? (
                        <div className="text-center py-12">
                          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <p className="text-sm text-muted-foreground">Cart is empty</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div key={item.id} className="flex gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  ${item.price.toFixed(2)} × {item.quantity}
                                </p>
                                <p className="text-sm font-semibold text-emerald-500 mt-1">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}

                          <div className="pt-4 border-t border-border space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 bg-card border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                          <Truck className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <h2 className="text-xl leading-8 font-bold text-text-primary">Shipping Method</h2>
                          <p className="text-sm text-text-secondary mt-1">Choose a shipping option</p>
                        </div>
                      </div>

                      <FormControl component="fieldset" className="w-full">
                        <RadioGroup
                          value={shippingMethod}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="space-y-3"
                        >
                          <div
                            className={`rounded-xl border-2 p-5 transition-all cursor-pointer ${shippingMethod === "standard" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-emerald-500/30"}`}
                          >
                            <FormControlLabel
                              value="standard"
                              control={<Radio />}
                              label={
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <span className="font-semibold text-text-primary block text-base">
                                      Standard Shipping
                                    </span>
                                    <span className="text-sm text-text-secondary">5-7 business days</span>
                                  </div>
                                  <span className="text-lg font-bold text-text-primary">$10.00</span>
                                </div>
                              }
                              sx={{
                                "& .MuiTypography-root": {
                                  width: "100%",
                                },
                              }}
                              className="w-full m-0"
                            />
                          </div>
                          <div
                            className={`rounded-xl border-2 p-5 transition-all cursor-pointer ${shippingMethod === "free" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-emerald-500/30"}`}
                          >
                            <FormControlLabel
                              value="free"
                              control={<Radio />}
                              label={
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <span className="font-semibold text-text-primary block text-base">Free Shipping</span>
                                    <span className="text-sm text-text-secondary">7-10 business days</span>
                                  </div>
                                  <span className="text-lg font-bold text-text-primary">FREE</span>
                                </div>
                              }
                              sx={{
                                "& .MuiTypography-root": {
                                  width: "100%",
                                },
                              }}
                              className="w-full m-0"
                            />
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </Card>

                    <Card className="p-8 bg-card border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-orange-500/10 rounded-lg">
                          <CreditCard className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <h2 className="text-xl leading-8 font-bold text-text-primary">Payment Method</h2>
                          <p className="text-sm text-text-secondary mt-1">How will the customer pay?</p>
                        </div>
                      </div>

                      <FormControl component="fieldset" className="w-full">
                        <RadioGroup
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="space-y-3"
                        >
                          <div
                            className={`rounded-xl border-2 p-5 transition-all cursor-pointer ${paymentMethod === "cod" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-emerald-500/30"}`}
                          >
                            <FormControlLabel
                              value="cod"
                              control={<Radio />}
                              label={<span className="font-semibold text-text-primary text-base">Cash on Delivery</span>}
                              className="w-full m-0"
                            />
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </Card>

                    {/* <Card className="p-8 bg-card border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-pink-500/10 rounded-lg">
                          <Tag className="w-5 h-5 text-pink-500" />
                        </div>
                        <div>
                          <h2 className="text-xl leading-8 font-bold text-text-primary">Discount Code</h2>
                          <p className="text-sm text-text-secondary mt-1">Apply a coupon or promo code</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-1">
                          <CustomTextField
                            label="Discount Code"
                            name="discountCode"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Enter discount code"
                          />
                        </div>
                        <Button
                          onClick={applyDiscountCode}
                          variant="outline"
                          className="mt-6 h-11 bg-transparent"
                          disabled={!discountCode}
                        >
                          Apply
                        </Button>
                      </div>
                      {discountAmount > 0 && (
                        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                          <Check className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-600">
                            {discountAmount}% discount applied! Saving ${discountValue.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="mt-4 text-xs text-text-secondary">Try: SAVE10, SAVE20, VIP25, WELCOME15</div>
                    </Card> */}

                    <Card className="p-8 bg-card border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                          <FileText className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <h2 className="text-xl leading-8 font-bold text-text-primary">Order Notes</h2>
                          <p className="text-sm text-text-secondary mt-1">Add any special instructions</p>
                        </div>
                      </div>
                      <CustomTextField
                        label="Order Notes"
                        name="orderNotes"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Special delivery instructions, gift message, etc."
                        rows={4}
                      />
                    </Card>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-6">
                    <Card className="p-6 bg-card border-border shadow-sm sticky top-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                          <DollarSign className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h2 className="text-xl leading-8 font-bold text-text-primary">Order Summary</h2>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-500 flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              Discount ({discountAmount}%)
                            </span>
                            <span className="font-medium text-emerald-500">-${discountValue.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-medium text-foreground">${shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax (8%)</span>
                          <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                        </div>
                        <div className="pt-4 border-t border-border flex justify-between items-center">
                          <span className="font-semibold text-foreground text-lg">Total</span>
                          <span className="text-3xl font-bold text-emerald-500">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Confirm */}
              {currentStep === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <Card className="p-8 bg-card border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                          <User className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Customer Information</h3>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <p className="text-foreground font-semibold text-base">{selectedCustomer?.name}</p>
                          {selectedCustomer?.type === "vip" && (
                            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">VIP</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{selectedCustomer?.email}</p>
                        <p className="text-muted-foreground">{selectedCustomer?.phone}</p>
                      </div>
                    </Card>

                    {/* Order Items */}
                    <Card className="p-8 bg-card border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-teal-500/10 rounded-lg">
                          <Package className="w-6 h-6 text-teal-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Order Items</h3>
                      </div>
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{item.name}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Quantity: {item.quantity} • SKU: {item.sku}
                              </p>
                              <p className="text-sm font-semibold text-emerald-500 mt-2">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-8 bg-card border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                          <Truck className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Shipping & Payment</h3>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-3">Shipping Address</p>
                          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm space-y-1">
                            <p className="font-medium text-foreground">{shippingAddress.fullName}</p>
                            <p className="text-muted-foreground">{shippingAddress.phone}</p>
                            <p className="text-muted-foreground">{shippingAddress.address}</p>
                            <p className="text-muted-foreground capitalize">{shippingAddress.area.replace("_", " ")}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-2">Shipping Method</p>
                            <p className="text-foreground capitalize">{shippingMethod.replace("-", " ")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-2">Payment Method</p>
                            <p className="text-foreground capitalize">{paymentMethod.replace("-", " ")}</p>
                          </div>
                        </div>
                      </div>

                      {discountAmount > 0 && (
                        <div className="mt-6 pt-6 border-t border-border">
                          <p className="text-sm font-semibold text-muted-foreground mb-2">Discount Applied</p>
                          <p className="text-emerald-500 font-semibold">
                            {discountCode} - {discountAmount}% off
                          </p>
                        </div>
                      )}

                      {orderNotes && (
                        <div className="mt-6 pt-6 border-t border-border">
                          <p className="text-sm font-semibold text-muted-foreground mb-2">Order Notes</p>
                          <p className="text-foreground">{orderNotes}</p>
                        </div>
                      )}
                    </Card>

                    <Card className="p-8 bg-card border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                          <Mail className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Notifications</h3>
                      </div>
                      <div className="space-y-5">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Send Order Confirmation Email</p>
                            <p className="text-xs text-muted-foreground mt-1">Email customer with order details</p>
                          </div>
                          <Switch
                            checked={sendConfirmationEmail}
                            onChange={(e) => setSendConfirmationEmail(e.target.checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Send Invoice Email</p>
                            <p className="text-xs text-muted-foreground mt-1">Email invoice to customer</p>
                          </div>
                          <Switch checked={sendInvoice} onChange={(e) => setSendInvoice(e.target.checked)} />
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Final Summary */}
                  <div className="space-y-6">
                    <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 shadow-lg sticky top-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-500/20 rounded-lg">
                          <DollarSign className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Final Total</h2>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-500">Discount</span>
                            <span className="font-medium text-emerald-500">-${discountValue.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-medium text-foreground">${shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                        </div>
                        <div className="pt-4 border-t border-emerald-500/20 flex justify-between items-center">
                          <span className="font-semibold text-foreground text-lg">Total</span>
                          <span className="text-4xl font-bold text-emerald-500">${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Dialog open={showInvoicePreview} onOpenChange={setShowInvoicePreview}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full mb-3 bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Invoice
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>Invoice Preview</DialogTitle>
                            <DialogDescription>Review the invoice before placing the order</DialogDescription>
                          </DialogHeader>
                          <div className="p-8 bg-white text-black rounded-lg">
                            <div className="text-center mb-8">
                              <h2 className="text-3xl font-bold">INVOICE</h2>
                              <p className="text-sm text-gray-600 mt-2">Order #ORD-{Date.now()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8 mb-8">
                              <div>
                                <h3 className="font-semibold mb-3">Bill To:</h3>
                                <p className="font-medium">{selectedCustomer?.name}</p>
                                <p className="text-sm text-gray-600">{selectedCustomer?.email}</p>
                                <p className="text-sm text-gray-600">{selectedCustomer?.phone}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-3">Ship To:</h3>
                                <p className="text-sm text-gray-600">{shippingAddress.fullName}</p>
                                <p className="text-sm text-gray-600">{shippingAddress.phone}</p>
                                <p className="text-sm text-gray-600">{shippingAddress.address}</p>
                              </div>
                            </div>
                            <table className="w-full mb-8">
                              <thead className="border-b-2 border-gray-300">
                                <tr>
                                  <th className="text-left py-3">Item</th>
                                  <th className="text-right py-3">Qty</th>
                                  <th className="text-right py-3">Price</th>
                                  <th className="text-right py-3">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cart.map((item) => (
                                  <tr key={item.id} className="border-b border-gray-200">
                                    <td className="py-3">{item.name}</td>
                                    <td className="text-right">{item.quantity}</td>
                                    <td className="text-right">${item.price.toFixed(2)}</td>
                                    <td className="text-right">${(item.price * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="flex justify-end">
                              <div className="w-72 space-y-2">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                  <div className="flex justify-between text-green-600">
                                    <span>Discount ({discountAmount}%):</span>
                                    <span>-${discountValue.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Shipping:</span>
                                  <span>${shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tax:</span>
                                  <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl border-t-2 border-gray-300 pt-3 mt-3">
                                  <span>Total:</span>
                                  <span>${total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => setShowInvoicePreview(false)}
                            >
                              Close
                            </Button>
                            <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={handlePlaceOrder}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 h-14 text-base font-semibold"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Place Order
                      </Button>
                    </Card>
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
