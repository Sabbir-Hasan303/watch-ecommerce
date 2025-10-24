import { DollarSign, Percent, Eye, Download, Send } from "lucide-react"
import { Button } from "@mui/material"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function OrderSummary({
    subtotal,
    discountAmount,
    discountValue,
    shippingCost,
    tax,
    total,
    isCompact = false,
    // Additional props for invoice preview and order placement
    selectedCustomer,
    cart,
    shippingAddress,
    showInvoicePreview,
    setShowInvoicePreview,
    handlePlaceOrder,
    isSubmitting = false
}) {
    if (isCompact) {
        return (
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
                    {tax > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax (8%)</span>
                            <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="pt-4 border-t border-border flex justify-between items-center">
                        <span className="font-semibold text-foreground text-lg">Total</span>
                        <span className="text-3xl font-bold text-emerald-500">${total.toFixed(2)}</span>
                    </div>
                </div>
            </Card>
        )
    }

    return (
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
                {tax > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                    </div>
                )}
                <div className="pt-4 border-t border-emerald-500/20 flex justify-between items-center">
                    <span className="font-semibold text-foreground text-lg">Total</span>
                    <span className="text-4xl font-bold text-emerald-500">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Invoice Preview Dialog */}
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
                                        <td className="py-3">
                                            <div>
                                                <div className="font-medium">{item.name}</div>
                                                {item.variantTitle && (
                                                    <div className="text-sm text-gray-500">
                                                        Variant: {item.variantTitle}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-right">{item.quantity}</td>
                                        <td className="text-right">${(item.price || 0).toFixed(2)}</td>
                                        <td className="text-right">${((item.price || 0) * item.quantity).toFixed(2)}</td>
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
                                {tax > 0 && (
                                    <div className="flex justify-between">
                                    <span>Tax:</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                )}
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
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 h-14 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5 mr-2" />
                        Place Order
                    </>
                )}
            </Button>
        </Card>
    )
}
