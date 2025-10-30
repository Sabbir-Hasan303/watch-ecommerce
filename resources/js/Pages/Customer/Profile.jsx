import React from "react"
import { router } from "@inertiajs/react"
import { useEffect, useState } from "react"
import CustomerLayout from "@/Layouts/CustomerLayout"
import { Plus, MapPin, Trash2 } from "lucide-react"

export default function ProfilePage( { user } ) {
    const [isEditing, setIsEditing] = useState(false)
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    })

    const [addressForm, setAddressForm] = useState({
        label: "",
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        isDefault: false,
    })

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
            })
        }
    }, [user])

    //if (!isLoggedIn || !user) {
    //  return null
    //}

    const handleProfileUpdate = (e) => {
        e.preventDefault()
        router.put(route("customer.profile.update"), formData)
        setIsEditing(false)
    }

    const handleAddAddress = (e) => {
        e.preventDefault()
        const newAddress = {
            id: Date.now().toString(),
            ...addressForm,
        }
        const addresses = user?.addresses || []
        router.put(route("customer.profile.update"), { addresses: [...addresses, newAddress] })
        setShowAddressForm(false)
        setAddressForm({
            label: "",
            fullName: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            isDefault: false,
        })
    }

    const handleDeleteAddress = (id) => {
        const addresses = user?.addresses?.filter((addr) => addr.id !== id) || []
        router.put(route("customer.profile.update"), { addresses })
    }

    return (
        <CustomerLayout>
            <div>
                <h1 className="text-2xl font-bold mb-8">Personal Details</h1>

                {/* Profile Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Profile Information</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">First Name</p>
                                <p className="font-medium">{user?.firstName || "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Last Name</p>
                                <p className="font-medium">{user?.lastName || "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <p className="font-medium">{user?.email || "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Phone</p>
                                <p className="font-medium">{user?.phone || "Not set"}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Address Management */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold">Saved Addresses</h2>
                        <button
                            onClick={() => setShowAddressForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Address
                        </button>
                    </div>

                    {showAddressForm && (
                        <form onSubmit={handleAddAddress} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <h3 className="font-semibold mb-4">New Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Label (e.g., Home, Office)</label>
                                    <input
                                        type="text"
                                        value={addressForm.label}
                                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={addressForm.fullName}
                                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={addressForm.phone}
                                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={addressForm.address}
                                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">City</label>
                                    <input
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">State</label>
                                    <input
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                                    <input
                                        type="text"
                                        value={addressForm.zipCode}
                                        onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Country</label>
                                    <input
                                        type="text"
                                        value={addressForm.country}
                                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    Save Address
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddressForm(false)}
                                    className="px-6 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-3">
                        {user?.addresses && user.addresses.length > 0 ? (
                            user.addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold">{address.label}</h3>
                                                    {address.isDefault && (
                                                        <span className="text-xs px-2 py-1 bg-black text-white rounded-full">Default</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700">{address.fullName}</p>
                                                <p className="text-sm text-gray-600">{address.phone}</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {address.address}, {address.city}, {address.state} {address.zipCode}, {address.country}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center py-8">No saved addresses yet</p>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}
