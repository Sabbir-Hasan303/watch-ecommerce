import { User, MapPin, UserPlus, X, Package, Plus } from "lucide-react"
import { Button, Avatar } from "@mui/material"
import { Card } from "@/components/ui/card"
import CustomTextField from "@/components/CustomTextField"
import CustomSelectField from "@/Components/CustomSelectField"

export default function CustomerSelection({
    customerSearch,
    setCustomerSearch,
    filteredCustomers,
    selectedCustomer,
    setSelectedCustomer,
    showNewCustomerForm,
    setShowNewCustomerForm,
    newCustomerData,
    setNewCustomerData,
    shippingAddress,
    setShippingAddress,
    handleCustomerSelect,
    handleCreateCustomer,
    handleNewCustomerClick,
    handleCreateNewAddress,
    handleAddressSelect,
    selectedAddress,
    isAddressFieldsDisabled,
    setIsAddressFieldsDisabled,
    handleShippingAddressChange
}) {
    return (
        <div className="space-y-6">
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
    )
}
