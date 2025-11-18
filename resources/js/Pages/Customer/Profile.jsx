import { useEffect, useRef, useState } from "react"
import { Head, router, useForm } from "@inertiajs/react"
import CustomerLayout from "@/Layouts/CustomerLayout"
import { Plus, MapPin, Trash2, Star } from "lucide-react"

export default function ProfilePage({ user, addresses = [], areaOptions = [] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const profileForm = useForm({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const addressForm = useForm({
    full_name: "",
    phone: "",
    address_line: "",
    area: areaOptions[0]?.value || "inside_dhaka",
    is_default: false,
  })

  const imageForm = useForm({
    profile_image: null,
  })

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    profileForm.put(route("customer.profile.update"), {
      preserveScroll: true,
      onSuccess: () => setIsEditing(false),
    })
  }

  const handleAddAddress = (e) => {
    e.preventDefault()
    addressForm.post(route("customer.addresses.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setShowAddressForm(false)
        addressForm.reset()
        addressForm.setData("area", areaOptions[0]?.value || "inside_dhaka")
        addressForm.setData("is_default", false)
      },
    })
  }

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    imageForm.setData("profile_image", file)
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
  }

  const handleProfileImageSubmit = (event) => {
    event.preventDefault()
    if (!imageForm.data.profile_image) return

    imageForm.post(route("customer.profile.image"), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        imageForm.reset()
        setPreviewUrl((current) => {
          if (current) URL.revokeObjectURL(current)
          return null
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      },
    })
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleDeleteAddress = (id) => {
    router.delete(route("customer.addresses.destroy", id), {
      preserveScroll: true,
    })
  }

  const handleSetDefault = (id) => {
    router.patch(route("customer.addresses.default", id), {}, {
      preserveScroll: true,
    })
  }

  return (
    <CustomerLayout>
      <Head title='Profile' />
      <div>
        <h1 className="text-2xl font-bold mb-8">Personal Details</h1>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center hover:ring-2 hover:ring-gray-300 transition"
            >
              {previewUrl || user?.profile_image ? (
                <img
                  src={previewUrl || `/storage/${user.profile_image}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">Upload</span>
              )}
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-2">Profile Picture</h2>
              <p className="text-sm text-gray-600 mb-4">
                Upload a square image (JPG, PNG, or WebP) no larger than 2 MB.
              </p>
              <form onSubmit={handleProfileImageSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
                <button
                  type="submit"
                  disabled={!imageForm.data.profile_image || imageForm.processing}
                  className="px-6 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  Upload
                </button>
              </form>
              {imageForm.errors.profile_image && (
                <p className="mt-2 text-sm text-red-600">{imageForm.errors.profile_image}</p>
              )}
            </div>
          </div>
        </div>

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
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.data.name}
                    onChange={(e) => profileForm.setData("name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  {profileForm.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileForm.data.phone}
                    onChange={(e) => profileForm.setData("phone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {profileForm.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.errors.phone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profileForm.data.email}
                    onChange={(e) => profileForm.setData("email", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  {profileForm.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.errors.email}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={profileForm.processing}
                  className="px-6 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
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
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="font-medium">{user?.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-medium">{user?.phone || "Not set"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium">{user?.email || "Not set"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Address Management */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Saved Addresses</h2>
            <button
              onClick={() => setShowAddressForm((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              {showAddressForm ? "Hide Form" : "Add Address"}
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-4">New Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Name</label>
                  <input
                    type="text"
                    value={addressForm.data.full_name}
                    onChange={(e) => addressForm.setData("full_name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {addressForm.errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{addressForm.errors.full_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={addressForm.data.phone}
                    onChange={(e) => addressForm.setData("phone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  {addressForm.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{addressForm.errors.phone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address Line</label>
                  <input
                    type="text"
                    value={addressForm.data.address_line}
                    onChange={(e) => addressForm.setData("address_line", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  {addressForm.errors.address_line && (
                    <p className="mt-1 text-sm text-red-600">{addressForm.errors.address_line}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Area</label>
                  <select
                    value={addressForm.data.area}
                    onChange={(e) => addressForm.setData("area", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {areaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {addressForm.errors.area && (
                    <p className="mt-1 text-sm text-red-600">{addressForm.errors.area}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="address-default"
                    type="checkbox"
                    checked={addressForm.data.is_default}
                    onChange={(e) => addressForm.setData("is_default", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="address-default" className="text-sm font-medium text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={addressForm.processing}
                  className="px-6 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
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
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{address.full_name || user?.name || "Recipient"}</h3>
                          {address.is_default && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-black text-white rounded-full">
                              <Star className="w-3 h-3" />Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{address.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">{address.address_line}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{address.area_label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

