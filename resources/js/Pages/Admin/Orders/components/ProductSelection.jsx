import { useState } from "react"
import { Package, Plus, AlertTriangle } from "lucide-react"
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
    const isLowStock = (product) => product.stock <= product.lowStockThreshold

    return (
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
    )
}
