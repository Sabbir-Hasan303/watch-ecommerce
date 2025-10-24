import { React, useState } from 'react'
import { ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock, Download, Printer, User, XCircleIcon } from 'lucide-react'
import { Button, FormControl } from '@mui/material'
import { router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomSelectField from '@/Components/CustomSelectField'
import Taka from '@/Components/Taka'
import CancelOrderDialog from '@/Components/CancelOrderDialog'
import { toast } from 'react-hot-toast'
import { useThemeContext } from '@/Contexts/ThemeContext'

const statusConfig = {
    pending: {
        label: 'Pending',
        icon: Clock,
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    },
    confirmed: {
        label: 'Confirmed',
        icon: CheckCircle,
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    shipped: {
        label: 'Shipped',
        icon: Truck,
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    },
    delivered: {
        label: 'Delivered',
        icon: Package,
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        color: 'bg-red-500/10 text-red-500 border-red-500/20'
    }
}

export default function ViewOrder({ order }) {
    const [orderStatus, setOrderStatus] = useState(order?.status || 'pending')
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
    const { isDarkMode } = useThemeContext()
    // Helper function to get customer info
    const getCustomerInfo = () => {
        if (order?.user && order?.shipping_address) {
            return {
                name: order.user.name,
                email: order.user.email,
                phone: order.user.addresses.find(address => address.is_default)?.phone || 'N/A'
            }
        } else if (order?.guest_info) {
            return {
                name: order.guest_info.name || 'Guest',
                email: order.guest_info.email || 'N/A',
                phone: order.guest_info.phone || 'N/A'
            }
        }
        return { name: 'Guest', email: 'N/A', phone: 'N/A' }
    }

    const customer = getCustomerInfo()

    const handleStatusChange = newStatus => {
        // Find the key that matches the selected label
        const statusKey = Object.keys(statusConfig).find(key => statusConfig[key].label === newStatus)
        if (statusKey) {
            router.post('/orders/change-status', {
                id: order.id,
                status: statusKey
            }, {
                onSuccess: () => {
                    setOrderStatus(statusKey)
                    toast.success(`Order status updated to ${newStatus}`)
                },
                onError: (errors) => {
                    console.error('Error updating order status:', errors)
                    toast.error('Failed to update order status')
                }
            })
        }
    }

    const handleCancelOrderSuccess = () => {
        setOrderStatus('cancelled')
    }

    const StatusIcon = statusConfig[orderStatus].icon

    // Show loading state if order is not loaded
    if (!order) {
        return (
            <AuthenticatedLayout>
                <div className='py-4'>
                    <div className='flex items-center justify-center min-h-[400px]'>
                        <div className='text-center'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
                            <p className='text-muted-foreground'>Loading order details...</p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        )
    }

    return (
        <AuthenticatedLayout>
            <div className='py-4'>
                <div className='space-y-6 custom-container mx-auto md:px-[40px] md:py-[18px]'>
                    <div className='bg-card rounded-xl p-6 space-y-6'>
                        <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                            <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Order Details</h2>
                            <div className='flex items-center gap-3'>
                                <Button
                                    variant='outlined'
                                    size='sm'
                                    onClick={() => window.open(`/orders/${order.id}/invoice`, '_blank')}
                                    sx={{
                                        color: isDarkMode ? '#9CA3AF' : '#374151',
                                    borderColor: isDarkMode ? '#374151' : '#9CA3AF',
                                    '&:hover': {
                                        bgcolor: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : '#9CA3AF',
                                        borderColor: isDarkMode ? '#6B7280' : '#9CA3AF'
                                    }
                                    }}>
                                    <Download className='w-4 h-4 mr-2' />
                                    <span className='hidden sm:inline'>Invoice</span>
                                </Button>
                            </div>
                        </div>
                        {/* Status and Actions */}
                        <div className='bg-card border border-border rounded-xl p-6'>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                                <div className='flex items-center gap-3'>
                                    <div className={`p-3 rounded-lg ${statusConfig[orderStatus].color}`}>
                                        <StatusIcon className='w-6 h-6' />
                                    </div>
                                    <div>
                                        <p className='text-sm text-muted-foreground'>Order Status</p>
                                        <p className='text-lg font-semibold text-foreground'>{statusConfig[orderStatus].label}</p>
                                        <p className='text-sm text-muted-foreground'>Order #{order?.order_number}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 w-full sm:w-auto'>
                                    {orderStatus === 'cancelled' ? (
                                        <div className='flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg'>
                                            <XCircleIcon className='w-5 h-5 text-red-500' />
                                            <span className='text-red-500 font-medium'>Order Cancelled</span>
                                        </div>
                                    ) : (
                                        <>
                                            <FormControl size='small' sx={{ minWidth: 200 }}>
                                                <CustomSelectField
                                                    label='Order Status'
                                                    options={Object.values(statusConfig)
                                                        .filter(status => status.label !== 'Cancelled')
                                                        .map(status => ({ label: status.label, value: status.label }))}
                                                    value={statusConfig[orderStatus]?.label || ''}
                                                    onChange={e => handleStatusChange(e.target.value)}
                                                />
                                            </FormControl>
                                            {/* <Button variant='outlined' onClick={() => setCancelDialogOpen(true)}>
                                                Cancel Order
                                            </Button> */}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                            {/* Order Items */}
                            <div className='lg:col-span-2 space-y-6'>
                                <div className='bg-card border border-border rounded-xl p-6'>
                                    <h2 className='text-lg font-semibold text-foreground mb-4'>Order Items</h2>
                                    <div className='space-y-4'>
                                        {order?.items?.map(item => {
                                            // Find variant image from product.images by matching product_variant_id
                                            const variantImage = item.product?.images?.find(img =>
                                                img.product_variant_id === item.variant?.id
                                            )

                                            // Get image with priority: variant image -> first product image -> placeholder
                                            const productImage = variantImage?.image_path
                                                ? `/storage/${variantImage.image_path}`
                                                : (item.product?.images?.[0]?.image_path
                                                    ? `/storage/${item.product.images[0].image_path}`
                                                    : '/placeholder.svg')

                                            return (
                                                <div key={item.id} className='flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg'>
                                                    <img src={productImage} alt={item.product?.name || 'Product'} className='w-20 h-20 object-cover rounded-lg bg-muted' />
                                                    <div className='flex-1'>
                                                        <h3 className='font-semibold text-foreground'>{item.product?.name || 'Unknown Product'}</h3>
                                                        <p className='text-sm text-muted-foreground mt-1'>{item.variant?.title || 'Default'}</p>
                                                        <p className='text-sm text-muted-foreground mt-1'>SKU: {item.variant?.sku || item.product?.sku || 'N/A'}</p>
                                                        <p className='text-sm text-muted-foreground mt-2'>Quantity: {item.quantity}</p>
                                                    </div>
                                                    <div className='text-right'>
                                                        <p className='font-semibold text-foreground'>
                                                            <Taka />
                                                            {Number(item.total_price || 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        }) || (
                                                <div className='text-center py-8'>
                                                    <p className='text-muted-foreground'>No items found</p>
                                                </div>
                                            )}
                                    </div>

                                    <div className='mt-6 pt-6 border-t border-border space-y-2'>
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-muted-foreground'>Subtotal</span>
                                            <span className='text-foreground'>
                                                <Taka />
                                                {Number(order.subtotal || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-muted-foreground'>Shipping</span>
                                            <span className='text-foreground'>
                                                <Taka />
                                                {Number(order.shipping_cost || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-muted-foreground'>Tax</span>
                                            <span className='text-foreground'>
                                                <Taka />
                                                {Number(order.tax_total || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className='flex justify-between text-lg font-semibold pt-2 border-t border-border'>
                                            <span className='text-foreground'>Total</span>
                                            <span className='text-foreground'>
                                                <Taka />
                                                {Number(order.total || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer and Shipping Info */}
                            <div className='space-y-6'>
                                {/* Customer Info */}
                                <div className='bg-card border border-border rounded-xl p-6'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='p-2 bg-emerald-500/10 rounded-lg'>
                                            <User className='w-5 h-5 text-emerald-500' />
                                        </div>
                                        <h2 className='text-lg font-semibold text-foreground'>Customer</h2>
                                    </div>
                                    <div className='space-y-2'>
                                        <p className='font-medium text-foreground'>{customer.name}</p>
                                        <p className='text-sm text-muted-foreground'>{customer.email}</p>
                                        <p className='text-sm text-muted-foreground'>{customer.phone}</p>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className='bg-card border border-border rounded-xl p-6'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='p-2 bg-purple-500/10 rounded-lg'>
                                            <MapPin className='w-5 h-5 text-purple-500' />
                                        </div>
                                        <h2 className='text-lg font-semibold text-foreground'>Shipping Address</h2>
                                    </div>
                                    <div className='space-y-1 text-sm text-muted-foreground'>
                                        {order?.shipping_address ? (
                                            <>
                                                <p><strong>{order.shipping_address.full_name || order.user.name}</strong></p>
                                                <p>{order.shipping_address.phone}</p>
                                                {order.shipping_address.area === 'inside_dhaka' ? (
                                                    <p>Inside Dhaka</p>
                                                ) : (
                                                    <p>Outside Dhaka</p>
                                                )}
                                                <p>{order.shipping_address.address_line}</p>
                                            </>
                                        ) : order?.guest_info?.address ? (
                                            <>
                                                <p><strong>{order.guest_info.name}</strong></p>
                                                <p>{order.guest_info.phone}</p>
                                                <p>{order.guest_info.email}</p>
                                                {order.guest_info.area === 'inside_dhaka' ? (
                                                    <p>Inside Dhaka</p>
                                                ) : (
                                                    <p>Outside Dhaka</p>
                                                )}
                                                <p>{order.guest_info.address}</p>
                                            </>
                                        ) : (
                                            <p>No shipping address provided</p>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className='bg-card border border-border rounded-xl p-6'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='p-2 bg-blue-500/10 rounded-lg'>
                                            <CreditCard className='w-5 h-5 text-blue-500' />
                                        </div>
                                        <h2 className='text-lg font-semibold text-foreground'>Payment</h2>
                                    </div>
                                    {/* if payment method is cod then show Cash on Delivery */}
                                    {order?.payment_method === 'cod' ? (
                                        <p className='text-sm text-muted-foreground'>Cash on Delivery</p>
                                    ) : (
                                        <p className='text-sm text-muted-foreground'>{order?.payment_method || 'N/A'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Cancel Order Button */}
                        <div className='flex justify-end'>
                            {orderStatus !== 'cancelled' && (
                                <Button variant='outlined' onClick={() => setCancelDialogOpen(true)} className='!bg-red-500/10 !border-red-500/20 !text-red-500 hover:bg-red-500/20 hover:text-white'>
                                    Cancel Order
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Order Dialog */}
            <CancelOrderDialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                orderId={order.id}
                onSuccess={handleCancelOrderSuccess}
            />
        </AuthenticatedLayout>
    )
}
