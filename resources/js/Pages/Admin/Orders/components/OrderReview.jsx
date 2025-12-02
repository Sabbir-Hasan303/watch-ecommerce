import { User, Package, Truck, Mail } from "lucide-react"
import { Switch } from "@mui/material"
import { Card } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import Taka from "@/Components/Taka"

export default function OrderReview({
    selectedCustomer,
    cart,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    orderNotes,
    discountAmount,
    discountCode,
    sendConfirmationEmail,
    setSendConfirmationEmail,
    sendInvoice,
    setSendInvoice
}) {
    return (
        <div className="space-y-6">
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
                    {selectedCustomer?.personal_phone ? (
                        <p className="text-muted-foreground">{selectedCustomer?.personal_phone}</p>
                    ) : (
                        <p className="text-muted-foreground">{shippingAddress.phone}</p>
                    )}
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
                                {item.variantTitle && (
                                    <p className="text-sm text-muted-foreground">
                                        Variant: {item.variantTitle}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground mt-1">
                                    Quantity: {item.quantity} • SKU: {item.sku}
                                </p>
                                <p className="text-sm font-semibold text-emerald-500 mt-2">
                                    {/* ${((item.price || 0) * item.quantity).toFixed(2)} */}
                                    <div className="flex items-center gap-1">
                                        <Taka color="text-emerald-500" className="text-sm" />{((item.price || 0) * item.quantity).toFixed(2)}
                                    </div>
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
    )
}
