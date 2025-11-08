import { useState, useCallback, useRef, useEffect } from "react"
import { User, MapPin, UserPlus, X, Package, Plus } from "lucide-react"
import { Button, Avatar, Box, Typography } from "@mui/material"
import { Card } from "@/Components/ui/card"
import CustomTextField from "@/components/CustomTextField"
import CustomSelectField from "@/Components/CustomSelectField"
import AsynchronousInput from "@/Components/AsynchronousInput"

export default function CustomerSelection({
    customers = [],
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
    const [customerOptions, setCustomerOptions] = useState([])
    const [loadingCustomers, setLoadingCustomers] = useState(false)

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

    const handleCustomerSearchOpen = () => {
        // Don't fetch anything on open, wait for user input
    }

    const handleCustomerSearchClose = () => {
        setCustomerOptions([])
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
                setLoadingCustomers(true)

                // Simulate API call - replace with actual API call
                setTimeout(() => {
                    // Filter customers based on search term
                    const filteredCustomers = customers.filter(customer =>
                        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
                    )

                    setCustomerOptions(filteredCustomers)
                    setLoadingCustomers(false)
                }, 300)
            } else {
                setCustomerOptions([])
                setLoadingCustomers(false)
            }
        }, 300) // 300ms debounce
    }, [customers])

    const handleCustomerSearchInput = (event, newInputValue, reason) => {
        if (reason === 'input') {
            debouncedSearch(newInputValue)
        }
    }

    const handleCustomerVariantSelect = (customer) => {
        handleCustomerSelect(customer)
    }
    // Validation functions
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const isValidPhone = (phone) => {
        // Allow various phone formats: +1234567890, 1234567890, (123) 456-7890, etc.
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
        return phoneRegex.test(phone.replace(/\s/g, ''))
    }

    const isFormValid = () => {
        return (
            newCustomerData.fullName.trim() !== "" &&
            newCustomerData.phone.trim() !== "" &&
            newCustomerData.email.trim() !== "" &&
            newCustomerData.address.trim() !== "" &&
            isValidEmail(newCustomerData.email) &&
            isValidPhone(newCustomerData.phone)
        )
    }
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
                        <AsynchronousInput
                            options={customerOptions}
                            loading={loadingCustomers}
                            onOpen={handleCustomerSearchOpen}
                            onClose={handleCustomerSearchClose}
                            onInputChange={handleCustomerSearchInput}
                            onChange={(event, newValue) => handleCustomerVariantSelect(newValue)}
                            value={null}
                            getOptionLabel={(option) => option ? `${option.name} - ${option.email}` : ''}
                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                            label="Search Customers"
                            placeholder="Type at least 2 characters to search..."
                            noOptionsText={customerOptions.length === 0 && !loadingCustomers ? "Type to search for customers..." : "No customers found"}
                            sx={{ width: '100%' }}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} className="flex items-center gap-3 p-3">
                                    <Avatar className="w-10 h-10 bg-emerald-500 text-white text-sm">
                                        {option.name.charAt(0)}
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <Typography variant="body2" className="font-medium text-foreground truncate">
                                            {option.name}
                                        </Typography>
                                        <Typography variant="caption" className="text-muted-foreground">
                                            {option.email} • {option.phone}
                                        </Typography>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Typography variant="caption" className="text-muted-foreground">
                                            {option.totalOrders} orders
                                        </Typography>
                                    </div>
                                </Box>
                            )}
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
                                            email: "",
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
                                    error={newCustomerData.phone.trim() !== "" && !isValidPhone(newCustomerData.phone)}
                                    helperText={newCustomerData.phone.trim() !== "" && !isValidPhone(newCustomerData.phone) ? "Please enter a valid phone number" : ""}
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
                                    error={newCustomerData.email.trim() !== "" && !isValidEmail(newCustomerData.email)}
                                    helperText={newCustomerData.email.trim() !== "" && !isValidEmail(newCustomerData.email) ? "Please enter a valid email address" : ""}
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
                                disabled={!isFormValid()}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            options={selectedCustomer.addresses.map((address, index) => {
                                                const getOrdinal = (num) => {
                                                    const suffixes = ['th', 'st', 'nd', 'rd'];
                                                    const v = num % 100;
                                                    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
                                                };

                                                let label;
                                                if (address.isDefault) {
                                                    label = "Default Address";
                                                } else if (index === 1) {
                                                    label = "Secondary Address";
                                                } else {
                                                    label = `${getOrdinal(index + 1)} Address`;
                                                }

                                                return {
                                                    label,
                                                    value: String(address.id),
                                                };
                                            })}
                                            value={selectedAddress ? String(selectedAddress) : ""}
                                            onChange={(event) => {
                                                const addressId = event.target.value
                                                handleAddressSelect(addressId)
                                            }}
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
                                        error={shippingAddress.phone.trim() !== "" && !isValidPhone(shippingAddress.phone)}
                                        helperText={shippingAddress.phone.trim() !== "" && !isValidPhone(shippingAddress.phone) ? "Please enter a valid phone number" : ""}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <CustomTextField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={shippingAddress.email}
                                        onChange={(e) => handleShippingAddressChange("email", e.target.value)}
                                        placeholder="john.doe@example.com"
                                        disabled={isAddressFieldsDisabled}
                                        error={shippingAddress.email.trim() !== "" && !isValidEmail(shippingAddress.email)}
                                        helperText={shippingAddress.email.trim() !== "" && !isValidEmail(shippingAddress.email) ? "Please enter a valid email address" : ""}
                                    />
                                </div>
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
                            </div>
                            <div className="grid grid-cols-1 gap-4">
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
