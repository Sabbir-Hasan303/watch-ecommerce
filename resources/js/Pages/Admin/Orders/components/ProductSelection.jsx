import { useState } from "react"
import { Package, Plus, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@mui/material"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CustomTextField from "@/components/CustomTextField"

export default function ProductSelection({
    productSearch,
    setProductSearch,
    filteredProducts,
    addToCart,
    cart
}) {
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [imageLoading, setImageLoading] = useState(false)

    const isLowStock = (variant) => variant.quantity <= 10 // Using lowStockThreshold from product

    const handleProductSelect = (product) => {
        setSelectedProduct(product)
        setSelectedVariant(null) // Reset variant selection when product changes
        setProductSearch("") // Clear search
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
                <CustomTextField
                    label="Search Products"
                    placeholder="Search by name, SKU, or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    suggestion={true}
                    suggestions={filteredProducts.map((product) => product.name)}
                    onSelect={(selectedProductName) => {
                        const product = filteredProducts.find((p) => p.name === selectedProductName)
                        if (product) {
                            handleProductSelect(product)
                        }
                    }}
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
                                                ${(selectedVariant.price || 0).toFixed(2)}
                                            </span>
                                            {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    ${(selectedVariant.compare_at_price || 0).toFixed(2)}
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
            {!selectedProduct && productSearch.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Product Selected</h3>
                    <p className="text-muted-foreground">Search for a product to see its variants and add to cart</p>
                </div>
            )}
        </Card>
    )
}
