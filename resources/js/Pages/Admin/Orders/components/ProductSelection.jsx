import { useState, useCallback, useRef, useEffect } from "react"
import { Package, Plus, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { Button, Box, Typography } from "@mui/material"
import { Card } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import AsynchronousInput from "@/Components/AsynchronousInput"
import Taka from "@/Components/Taka"

export default function ProductSelection({
    products = [],
    addToCart,
    cart
}) {
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [imageLoading, setImageLoading] = useState(false)
    const [productOptions, setProductOptions] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(false)

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

    const isLowStock = (variant) => variant.quantity <= 10 // Using lowStockThreshold from product

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
        setSelectedProduct(variant.product)
        setSelectedVariant(variant)
    }

    const selectVariant = (variant) => {
        setImageLoading(true)
        setSelectedVariant(variant)
        // Reset loading state after a short delay to allow image to load
        setTimeout(() => setImageLoading(false), 300)
    }

    const addVariantToCart = () => {
        if (selectedProduct && selectedVariant) {
            const cartItem = {
                id: `${selectedProduct.id}-${selectedVariant.id}`, // Unique ID for product-variant combination
                productId: selectedProduct.id,
                variantId: selectedVariant.id,
                name: selectedProduct.name,
                variantTitle: selectedVariant.title,
                sku: selectedVariant.sku,
                price: selectedVariant.price,
                compare_at_price: selectedVariant.compare_at_price,
                stock: selectedVariant.quantity,
                image: selectedVariant.image || selectedProduct.image,
                category: selectedProduct.category,
                quantity: 1
            }
            addToCart(cartItem)
        }
    }

    return (
        <Card className="p-4 md:p-10 bg-card border-border shadow-xl hover:shadow-2xl transition-shadow duration-300">
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
                <AsynchronousInput
                    options={productOptions}
                    loading={loadingProducts}
                    onOpen={handleProductSearchOpen}
                    onClose={handleProductSearchClose}
                    onInputChange={handleProductSearchInput}
                    onChange={(event, newValue) => handleProductVariantSelect(newValue)}
                    value={null}
                    getOptionLabel={(option) => option ? `${option.productName} - ${option.title}` : ''}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    label="Search Products"
                    placeholder="Type at least 2 characters to search..."
                    noOptionsText={productOptions.length === 0 && !loadingProducts ? "Type to search for products..." : "No products found"}
                    sx={{ width: '100%' }}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} className="flex items-center gap-3 p-3">
                            <img
                                src={option.productImage || '/placeholder.svg'}
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
                                <Typography variant="body2" className="font-medium">
                                    {/* ${Number(option.price || 0).toFixed(2)} */}
                                    <div className="flex items-center gap-1">
                                        <Taka color='text-black dark:text-white' className='text-base' />
                                        <span className="text-base">{Number(option.price || 0).toFixed(2)}</span>
                                    </div>
                                </Typography>
                            </div>
                        </Box>
                    )}
                />
            </div>

            {/* Selected Product Display */}
            {selectedProduct && (
                <div className="space-y-6">
                    <Card className="p-6 border-border shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={selectedProduct.image || "/placeholder.svg"}
                                alt={selectedProduct.name}
                                className="w-20 h-20 rounded-xl object-cover bg-muted shadow-md"
                            />
                            <div>
                                <h3 className="font-bold text-foreground text-xl">{selectedProduct.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedProduct.category} • {selectedProduct.variants.length} variant{selectedProduct.variants.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Selected Variant Details */}
                        {selectedVariant && (
                            <Card className="p-4 max-w-sm">
                                <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-4">
                                    <div className="relative">
                                        <img
                                            key={selectedVariant.id} // Force re-render when variant changes
                                            src={selectedVariant.image}
                                            alt={selectedVariant.title}
                                            className={`w-16 h-16 rounded-lg object-cover bg-muted shadow-sm transition-all duration-300 ${
                                                imageLoading ? 'opacity-50' : 'opacity-100'
                                            }`}
                                            onLoad={() => setImageLoading(false)}
                                            onError={() => setImageLoading(false)}
                                        />
                                        {imageLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                                                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex-wrap gap-2">
                                        <h5 className="font-semibold text-foreground">
                                            {selectedVariant.title || `${selectedVariant.color || ''} ${selectedVariant.size || ''}`.trim()}
                                        </h5>
                                        <p className="text-sm text-muted-foreground">
                                            SKU: {selectedVariant.sku}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            <span className="text-lg font-bold text-emerald-600">
                                                {/* ${(selectedVariant.price || 0).toFixed(2)} */}
                                                <div className="flex items-center gap-1">
                                                    <Taka color='text-emerald-600' className='text-base font-bold' />
                                                    <span className="text-base">{(selectedVariant.price || 0).toFixed(2)}</span>
                                                </div>
                                            </span>
                                            {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    {/* ${(selectedVariant.compare_at_price || 0).toFixed(2)} */}
                                                    <div className="flex items-center gap-1">
                                                        <Taka color='text-gray-500' className='text-sm font-bold' />
                                                        <span className="text-sm">{(selectedVariant.compare_at_price || 0).toFixed(2)}</span>
                                                    </div>
                                                </span>
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                ({selectedVariant.quantity} in stock)
                                            </span>
                                            {isLowStock(selectedVariant) && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs border-orange-500 text-orange-600 bg-orange-50"
                                                >
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    Low Stock
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={addVariantToCart}
                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all"
                                        disabled={selectedVariant.quantity === 0}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Variant Selection Buttons */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-foreground mt-3">Select Variant:</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedProduct.variants.map((variant) => (
                                    <Button
                                        key={variant.id}
                                        variant={selectedVariant?.id === variant.id ? "outlined" : "outlined"}
                                        onClick={() => selectVariant(variant)}
                                        className={`min-w-0 ${selectedVariant?.id === variant.id
                                                ? '!bg-emerald-500 !hover:bg-emerald-600 !text-white !border-none'
                                                : 'border-gray-300 hover:border-emerald-500'
                                            }`}
                                        disabled={variant.quantity === 0}
                                    >
                                        <div className="text-center">
                                            <div className="font-medium text-sm">
                                                {variant.title || `${variant.color || ''} ${variant.size || ''}`.trim()}
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Show message when no product is selected */}
            {!selectedProduct && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Product Selected</h3>
                    <p className="text-muted-foreground">Search for a product to see its variants and add to cart</p>
                </div>
            )}
        </Card>
    )
}
