import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Link, router } from '@inertiajs/react'
import { Plus, Minus, Trash2, Save, X, Search, Package, User, MapPin } from 'lucide-react'
import { Button, TextField, Chip, Box, Typography } from '@mui/material'
import { Card } from '@/components/ui/card'
import toast from 'react-hot-toast'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomSelectField from '@/Components/CustomSelectField'
import CustomTextField from '@/Components/CustomTextField'
import Taka from '@/Components/Taka'
import { useThemeContext } from '@/Contexts/ThemeContext'
import AsynchronousInput from '@/Components/AsynchronousInput'

export default function OrderEdit({ order, products = [], customers = [], shippingCosts = {} }) {
    const { isDarkMode } = useThemeContext()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Order state
    const [orderData, setOrderData] = useState({
        status: order?.status || 'pending',
        payment_method: order?.payment_method || 'cod',
        shipping_method: order?.shipping_method || 'standard',
        notes: order?.notes || '',
        discount_code: '',
        discount_amount: 0,
    })

    // Customer state
    const [selectedCustomer, setSelectedCustomer] = useState(order?.user || null)
    const [shippingAddress, setShippingAddress] = useState(order?.shipping_address || {
        full_name: '',
        phone: '',
        email: '',
        address_line: '',
        area: 'inside_dhaka'
    })

    // Product state
    const [selectedProductVariant, setSelectedProductVariant] = useState(null)
    const [productOptions, setProductOptions] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [orderItems, setOrderItems] = useState(order?.items?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.product_variant_id || item.variant_id,
        product: item.product,
        variant: item.variant,
        quantity: Number(item.quantity || 0),
        unit_price: Number(item.unit_price || 0),
        total_price: Number(item.total_price || 0)
    })) || [])

    // Resolve a displayable image URL for a given product/variant
    const getImageUrl = useCallback((product, variant) => {
        const path =
            (variant && (variant.image_path || variant.image)) ||
            (product?.images?.find(img => img.is_primary)?.image_path) ||
            (product?.images && product.images[0]?.image_path) ||
            product?.image_path ||
            product?.image ||
            ''

        if (!path) return '/placeholder.svg'
        // If already absolute (http/https) return as is; otherwise prefix storage
        const lower = String(path).toLowerCase()
        const isAbsolute = lower.startsWith('http://') || lower.startsWith('https://')
        return isAbsolute ? path : `/storage/${path}`
    }, [])

    // Calculations
    const subtotal = orderItems.reduce((sum, item) => sum + (Number(item.unit_price || 0) * Number(item.quantity || 0)), 0)
    const getShippingCost = () => {
        if (orderData.shipping_method === 'free') return 0
        const area = shippingAddress.area || 'inside_dhaka'
        return shippingCosts[area]?.[orderData.shipping_method] || 0
    }
    const shippingCost = getShippingCost()
    const discountValue = (subtotal * orderData.discount_amount) / 100
    const tax = 0
    const total = subtotal - discountValue + shippingCost + tax

    // Debounce timer ref
    const searchTimeoutRef = useRef(null)

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

    // Handlers
    const handleProductSearchOpen = () => {
        // Don't fetch anything on open, wait for user input
    }

    const handleProductSearchClose = () => {
        setProductOptions([])
        // Clear any pending search
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
            searchTimeoutRef.current = null
        }
    }

    const debouncedSearch = useCallback((searchTerm) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (searchTerm && searchTerm.length >= 2) {
                setLoadingProducts(true)

                // Simulate API call - replace with actual API call
                setTimeout(() => {
                    // Filter products based on search term
                    const filteredProducts = products.filter(product =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.variants?.some(variant =>
                            variant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            variant.sku.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                    )

                    // Flatten filtered products with their variants
                    const flattenedOptions = filteredProducts.flatMap(product =>
                        product.variants?.map(variant => ({
                            ...variant,
                            product: product,
                            productName: product.name,
                            productImage: product.image,
                            productCategory: product.category
                        })) || []
                    )

                    setProductOptions(flattenedOptions)
                    setLoadingProducts(false)
                }, 300)
            } else {
                setProductOptions([])
                setLoadingProducts(false)
            }
        }, 300) // 300ms debounce
    }, [products])

    const handleProductSearchInput = (event, newInputValue, reason) => {
        if (reason === 'input') {
            debouncedSearch(newInputValue)
        }
    }

    const handleProductVariantSelect = (variant) => {
        setSelectedProductVariant(variant)
    }

    const handleAddProduct = () => {
        if (!selectedProductVariant) {
            toast.error('Please select a product variant')
            return
        }

        const existingItem = orderItems.find(item => item.variant_id === selectedProductVariant.id)

        if (existingItem) {
            setOrderItems(orderItems.map(item =>
                item.variant_id === selectedProductVariant.id
                    ? {
                        ...item,
                        quantity: Number(item.quantity || 0) + 1,
                        total_price: (Number(item.quantity || 0) + 1) * Number(item.unit_price || 0)
                    }
                    : item
            ))
        } else {
            setOrderItems([...orderItems, {
                id: null, // New item
                product_id: selectedProductVariant.product.id,
                variant_id: selectedProductVariant.id,
                product: selectedProductVariant.product,
                variant: selectedProductVariant,
                quantity: 1,
                unit_price: Number(selectedProductVariant.price || 0),
                total_price: Number(selectedProductVariant.price || 0)
            }])
        }

        // Reset selection
        setSelectedProductVariant(null)
    }

    const handleUpdateQuantity = (itemId, change) => {
        setOrderItems(orderItems.map(item => {
            if (item.id === itemId || item.variant_id === itemId) {
                const newQuantity = Number(item.quantity || 0) + change
                if (newQuantity <= 0) return null
                return {
                    ...item,
                    quantity: newQuantity,
                    total_price: newQuantity * Number(item.unit_price || 0)
                }
            }
            return item
        }).filter(item => item !== null))
    }

    const handleRemoveItem = (itemId) => {
        setOrderItems(orderItems.filter(item => item.id !== itemId && item.variant_id !== itemId))
    }

    // Price update handler (commented for future use)
    // const handleUpdatePrice = (itemId, newPrice) => {
    //     setOrderItems(orderItems.map(item => {
    //         if (item.id === itemId || item.variant_id === itemId) {
    //             const price = parseFloat(newPrice) || 0
    //             return {
    //                 ...item,
    //                 unit_price: price,
    //                 total_price: price * Number(item.quantity || 0)
    //             }
    //         }
    //         return item
    //     }))
    // }

    const handleSaveOrder = () => {
        if (orderItems.length === 0) {
            toast.error('Please add at least one product to the order')
            return
        }

        if (!shippingAddress.full_name || !shippingAddress.phone || !shippingAddress.email || !shippingAddress.address_line) {
            toast.error('Please fill in all shipping address fields')
            return
        }

        const updateData = {
            order_id: order.id,
            user_id: selectedCustomer?.id || null,
            shipping_address: shippingAddress,
            billing_address: shippingAddress, // Same as shipping for now
            items: orderItems.filter(item => item.variant_id).map(item => ({
                id: item.id,
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            })),
            status: orderData.status,
            payment_method: orderData.payment_method,
            shipping_method: orderData.shipping_method,
            notes: orderData.notes,
            subtotal: subtotal,
            shipping_cost: shippingCost,
            discount_total: 0, // Set to 0 since discount fields are commented out
            tax_total: tax,
            total: total
        }

        setIsSubmitting(true)
        const loadingToast = toast.loading('Updating order...')

        router.post('/orders/update', updateData, {
            onSuccess: () => {
                setIsSubmitting(false)
                toast.dismiss(loadingToast)
                toast.success('Order updated successfully!')
            },
            onError: (errors) => {
                setIsSubmitting(false)
                toast.dismiss(loadingToast)
                if (errors && typeof errors === 'object') {
                    const errorMessages = Object.values(errors).flat()
                    toast.error(errorMessages.join(', '))
                } else {
                    toast.error('Failed to update order. Please try again.')
                }
            }
        })
    }

    if (!order) {
        return (
            <AuthenticatedLayout>
                <div className="py-4">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading order details...</p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        )
    }

    return (
        <AuthenticatedLayout>
            <div className="py-4">
                <div className="space-y-6 custom-container mx-auto md:px-[40px] md:py-[18px]">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl leading-9 font-bold text-text-primary">Edit Order</h2>
                            <p className="text-sm text-text-secondary mt-2">Order #{order.order_number}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/orders">
                                <Button
                                    variant="outline"
                                    className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all bg-transparent"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                onClick={handleSaveOrder}
                                disabled={isSubmitting}
                                className="gap-2 px-6 h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                <Save className="w-4 h-4" />
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items */}
                            <Card className="p-6 bg-card border-border">
                                <div className="flex flex-col gap-6 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-500/10 rounded-lg">
                                            <Package className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">Order Items</h3>
                                    </div>

                                    {/* Product Selection */}
                                    <div className="space-y-4">
                                        <AsynchronousInput
                                            options={productOptions}
                                            loading={loadingProducts}
                                            onOpen={handleProductSearchOpen}
                                            onClose={handleProductSearchClose}
                                            onInputChange={handleProductSearchInput}
                                            onChange={(event, newValue) => handleProductVariantSelect(newValue)}
                                            value={selectedProductVariant}
                                            getOptionLabel={(option) => option ? `${option.productName} - ${option.title}` : ''}
                                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                            label="Search Products"
                                            placeholder="Type at least 2 characters to search..."
                                            noOptionsText={productOptions.length === 0 && !loadingProducts ? "Type to search for products..." : "No products found"}
                                            sx={{ width: '100%' }}
                                            renderOption={(props, option) => (
                                                <Box component="li" {...props} className="flex items-center gap-3 p-3">
                                                    <img
                                                        src={getImageUrl(option.product, option)}
                                                        alt={option.productName}
                                                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <Typography variant="body2" className="font-medium text-foreground truncate">
                                                            {option.productName}
                                                        </Typography>
                                                        <Typography variant="caption" className="text-muted-foreground">
                                                            {option.title} • SKU: {option.sku}
                                                        </Typography>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <Taka className="text-sm" />
                                                        <Typography variant="body2" className="font-medium">
                                                            {Number(option.price || 0).toFixed(2)}
                                                        </Typography>
                                                    </div>
                                                </Box>
                                            )}
                                        />
                                    </div>

                                    {/* Add Product Button */}
                                    <div className="flex justify-end">
                                        <Button
                                            variant="contained"
                                            onClick={handleAddProduct}
                                            disabled={!selectedProductVariant}
                                            className="bg-emerald-500 hover:bg-emerald-600 !text-text-primary"
                                            startIcon={<Plus className="w-4 h-4" />}
                                        >
                                            Add to Order
                                        </Button>
                                    </div>
                                </div>

                                {/* Order Items List */}
                                <div className="space-y-4">
                                    {orderItems.map(item => (
                                        <div key={item.id || item.variant_id} className="bg-muted/30 rounded-lg p-4">
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                {/* Product Image and Info */}
                                                <div className="flex items-center gap-4 flex-1">
                                                    <img
                                                        src={getImageUrl(item.product, item.variant)}
                                                        alt={item.product?.name}
                                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-foreground truncate">{item.product?.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{item.variant?.title}</p>
                                                        <p className="text-sm text-muted-foreground">SKU: {item.variant?.sku}</p>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="small"
                                                        onClick={() => handleUpdateQuantity(item.id || item.variant_id, -1)}
                                                        className="w-3 h-8 p-0"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="small"
                                                        onClick={() => handleUpdateQuantity(item.id || item.variant_id, 1)}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                {/* Price Info */}
                                                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">Unit: </span>
                                                        <div className="flex items-center gap-1">
                                                            <Taka className="text-sm" />
                                                            <span className="font-medium">{Number(item.unit_price || 0).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">Total: </span>
                                                        <div className="flex items-center gap-1">
                                                            <Taka className="text-sm" />
                                                            <span className="font-medium text-lg">{Number(item.total_price || 0).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Remove Button */}
                                                <Button
                                                    variant="outline"
                                                    size="small"
                                                    onClick={() => handleRemoveItem(item.id || item.variant_id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {orderItems.length === 0 && (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground text-lg font-medium">No items in this order</p>
                                        <p className="text-sm text-muted-foreground mt-2">Search and select a product variant above to add items</p>
                                    </div>
                                )}
                            </Card>

                            {/* Payment & Shipping - Commented for future use */}
                            {/* <Card className="p-6 bg-card border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">Payment & Shipping</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <CustomSelectField
                                            label="Payment Method"
                                            options={[{ label: 'Cash on Delivery', value: 'cod' }, { label: 'Credit Card', value: 'card' }, { label: 'bKash', value: 'bkash' }, { label: 'Nagad', value: 'nagad' }, { label: 'Rocket', value: 'rocket' }]}
                                            value={orderData.payment_method}
                                            onChange={(e) => setOrderData({ ...orderData, payment_method: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <CustomSelectField
                                            label="Shipping Method"
                                            options={[{ label: 'Standard', value: 'standard' }, { label: 'Free Shipping', value: 'free' }]}
                                            value={orderData.shipping_method}
                                            onChange={(e) => setOrderData({ ...orderData, shipping_method: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <CustomTextField
                                            label="Order Notes"
                                            value={orderData.notes}
                                            onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                                            rows={3}
                                            placeholder="Add any special instructions..."
                                        />
                                    </div>
                                </div>
                            </Card> */}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="space-y-6">
                            <Card className="p-6 bg-card border-border shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                                        <Taka className="text-2xl p-2" />
                                    </div>
                                    <h2 className="text-xl leading-8 font-bold text-text-primary">Order Summary</h2>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <div className="flex items-center gap-1">
                                            <Taka className="text-sm" />
                                            {subtotal.toFixed(2)}
                                        </div>
                                    </div>
                                    {orderData.discount_amount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-500">Discount ({orderData.discount_amount}%)</span>
                                            <div className="flex items-center gap-1">
                                                <Taka className="text-sm" />
                                                {discountValue.toFixed(2)}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <div className="flex items-center gap-1">
                                            <Taka className="text-sm" />
                                            {shippingCost.toFixed(2)}
                                        </div>
                                    </div>
                                    {tax > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax</span>
                                            <div className="flex items-center gap-1">
                                                <Taka className="text-sm" />
                                                {tax.toFixed(2)}
                                            </div>
                                        </div>
                                    )}
                                    <div className="pt-4 border-t border-border flex justify-between items-center">
                                        <span className="font-semibold text-foreground text-lg">Total</span>
                                        <div className="flex items-center gap-1">
                                            <Taka className="text-sm" />
                                            {total.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Shipping Address */}
                            <Card className="p-6 bg-card border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <MapPin className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">Shipping Address</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <CustomTextField
                                            label="Full Name"
                                            value={shippingAddress.full_name}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <CustomTextField
                                            label="Phone"
                                            value={shippingAddress.phone}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <CustomTextField
                                            label="Email"
                                            value={shippingAddress.email}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <CustomSelectField
                                            label="Area"
                                            options={[{ label: 'Inside Dhaka', value: 'inside_dhaka' }, { label: 'Outside Dhaka', value: 'outside_dhaka' }]}
                                            value={shippingAddress.area}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, area: e.target.value })}
                                        />
                                    </div>
                                    <div >
                                        <CustomTextField
                                            label="Address"
                                            value={shippingAddress.address_line}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, address_line: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Customer Selection */}
                            <Card className="p-6 bg-card border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <User className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">Customer</h3>
                                </div>

                                {selectedCustomer ? (
                                    <div className="p-4 bg-muted/30 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">{selectedCustomer.name}</p>
                                                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                                                <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                                            </div>
                                            {/* Change customer button - commented for future use */}
                                            {/* <Button
                                                variant="outline"
                                                size="small"
                                                onClick={() => setSelectedCustomer(null)}
                                            >
                                                Change
                                            </Button> */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">Guest</div>
                                )}
                            </Card>

                            {/* Discount Section - Commented for future use */}
                            {/* <Card className="p-6 bg-card border-border">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Discount</h3>
                                <div className="space-y-3">
                                    <div>
                                        <CustomTextField
                                            label="Discount Code"
                                            value={orderData.discount_code}
                                            onChange={(e) => setOrderData({ ...orderData, discount_code: e.target.value })}
                                            placeholder="Enter discount code"
                                        />
                                    </div>
                                    <div>
                                        <CustomTextField
                                            label="Discount Amount (%)"
                                            value={orderData.discount_amount}
                                            onChange={(e) => setOrderData({ ...orderData, discount_amount: parseFloat(e.target.value) || 0 })}
                                            placeholder="Enter discount amount"
                                        />
                                    </div>
                                </div>
                            </Card> */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
