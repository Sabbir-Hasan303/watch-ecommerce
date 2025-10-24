import { Truck, CreditCard, FileText } from "lucide-react"
import { Button, RadioGroup, Radio, FormControlLabel, FormControl } from "@mui/material"
import { Card } from "@/components/ui/card"
import CustomTextField from "@/components/CustomTextField"

export default function PaymentShipping({
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    shippingCosts = {},
    shippingAddress = {}
}) {
    return (
        <div className="space-y-6">
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
                                        <span className="text-lg font-bold text-text-primary">
                                            {(() => {
                                                const area = shippingAddress.area || 'inside_dhaka'
                                                const cost = shippingCosts[area]?.standard || 0
                                                return `৳${cost.toFixed(2)}`
                                            })()}
                                        </span>
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
    )
}
