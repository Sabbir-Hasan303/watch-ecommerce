import { ShoppingCart, Plus, Minus, X, AlertTriangle } from "lucide-react"
import { Button } from "@mui/material"
import { Card } from "@/Components/ui/card"

export default function CartSummary({
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    isCompact = false
}) {
    if (isCompact) {
        return (
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
                                    {item.variantTitle && (
                                        <p className="text-xs text-muted-foreground">
                                            Variant: {item.variantTitle}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground mt-1">
                                        ${(item.price || 0).toFixed(2)} × {item.quantity}
                                    </p>
                                    <p className="text-sm font-semibold text-emerald-500 mt-1">
                                        ${((item.price || 0) * item.quantity).toFixed(2)}
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
        )
    }

    return (
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
                                {item.variantTitle && (
                                    <p className="text-xs text-muted-foreground">
                                        Variant: {item.variantTitle}
                                    </p>
                                )}
                                <p className="text-base font-semibold text-emerald-600 mt-2">${(item.price || 0).toFixed(2)}</p>
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
    )
}
