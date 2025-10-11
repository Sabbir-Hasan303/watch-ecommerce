import { React, useState } from 'react'
import { ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock, Download, Printer, User } from 'lucide-react'
import { Button, FormControl, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomSelectField from '@/Components/CustomSelectField'

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

export default function OrderDetails({ orderId }) {
  const [orderStatus, setOrderStatus] = useState('confirmed')
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  // Mock order data
  const order = {
    id: orderId,
    orderNumber: 'ORD-2024-002',
    date: '2024-01-16',
    status: orderStatus,
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 123-4567'
    },
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    billingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    items: [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        variant: 'Black / Medium',
        sku: 'WH-BLK-M',
        quantity: 1,
        price: 99.99,
        image: '/placeholder.svg?height=80&width=80'
      },
      {
        id: '2',
        name: 'Smart Watch Pro',
        variant: 'Silver / 42mm',
        sku: 'SW-SLV-42',
        quantity: 1,
        price: 299.99,
        image: '/placeholder.svg?height=80&width=80'
      }
    ],
    subtotal: 399.98,
    shipping: 15.0,
    tax: 35.0,
    total: 449.98,
    paymentMethod: 'Credit Card ending in 4242',
    trackingNumber: 'TRK123456789'
  }

  const handleStatusChange = newStatus => {
    // Find the key that matches the selected label
    const statusKey = Object.keys(statusConfig).find(key => statusConfig[key].label === newStatus)
    if (statusKey) {
      setOrderStatus(statusKey)
      console.log('[v0] Order status updated to:', statusKey)
      alert(`Order status updated to ${newStatus}`)
    }
  }

  const handleCancelOrder = () => {
    setOrderStatus('cancelled')
    setCancelDialogOpen(false)
    console.log('[v0] Order cancelled:', orderId)
    alert('Order has been cancelled')
  }

  const StatusIcon = statusConfig[orderStatus].icon

  return (
    <AuthenticatedLayout>
      <div className='py-4'>
        <div className='space-y-6'>
          <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
            <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Order Details</h2>
            <div className='flex items-center gap-3'>
              <Button variant='outline' size='sm' className='gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10'>
                <Download className='w-4 h-4' />
                <span className='hidden sm:inline'>Invoice</span>
              </Button>
              <Button variant='outline' size='sm' className='gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10'>
                <Printer className='w-4 h-4' />
                <span className='hidden sm:inline'>Print</span>
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
                </div>
              </div>
              <div className='flex items-center gap-3 w-full sm:w-auto'>
                <FormControl size='small' sx={{ minWidth: 200 }}>
                  <CustomSelectField
                    label='Order Status'
                    options={Object.values(statusConfig).map(status => ({ label: status.label, value: status.label }))}
                    value={statusConfig[orderStatus]?.label || ''}
                    onChange={e => handleStatusChange(e.target.value)}
                  />
                </FormControl>
                <Button variant='outlined' onClick={() => setCancelDialogOpen(true)}>
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Order Items */}
            <div className='lg:col-span-2 space-y-6'>
              <div className='bg-card border border-border rounded-xl p-6'>
                <h2 className='text-lg font-semibold text-foreground mb-4'>Order Items</h2>
                <div className='space-y-4'>
                  {order.items.map(item => (
                    <div key={item.id} className='flex gap-4 p-4 bg-muted/30 rounded-lg'>
                      <img src={item.image || '/placeholder.svg'} alt={item.name} className='w-20 h-20 object-cover rounded-lg bg-muted' />
                      <div className='flex-1'>
                        <h3 className='font-semibold text-foreground'>{item.name}</h3>
                        <p className='text-sm text-muted-foreground mt-1'>{item.variant}</p>
                        <p className='text-sm text-muted-foreground mt-1'>SKU: {item.sku}</p>
                        <p className='text-sm text-muted-foreground mt-2'>Quantity: {item.quantity}</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold text-foreground'>${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-6 pt-6 border-t border-border space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Subtotal</span>
                    <span className='text-foreground'>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Shipping</span>
                    <span className='text-foreground'>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Tax</span>
                    <span className='text-foreground'>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-lg font-semibold pt-2 border-t border-border'>
                    <span className='text-foreground'>Total</span>
                    <span className='text-foreground'>${order.total.toFixed(2)}</span>
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
                  <p className='font-medium text-foreground'>{order.customer.name}</p>
                  <p className='text-sm text-muted-foreground'>{order.customer.email}</p>
                  <p className='text-sm text-muted-foreground'>{order.customer.phone}</p>
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
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                {order.trackingNumber && (
                  <div className='mt-4 pt-4 border-t border-border'>
                    <p className='text-xs text-muted-foreground mb-1'>Tracking Number</p>
                    <p className='text-sm font-mono text-foreground'>{order.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className='bg-card border border-border rounded-xl p-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='p-2 bg-blue-500/10 rounded-lg'>
                    <CreditCard className='w-5 h-5 text-blue-500' />
                  </div>
                  <h2 className='text-lg font-semibold text-foreground'>Payment</h2>
                </div>
                <p className='text-sm text-muted-foreground'>{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1C252E',
            border: '1px solid #374151'
          }
        }}>
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }} className='text-text-primary'>
          Cancel Order
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#9CA3AF', mt: 1 }} className='text-text-primary'>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            variant='outlined'
            onClick={() => setCancelDialogOpen(false)}
            sx={{
              color: '#9CA3AF',
              borderColor: '#374151',
              '&:hover': {
                bgcolor: 'rgba(55, 65, 81, 0.3)',
                borderColor: '#6B7280'
              }
            }}>
            No, keep order
          </Button>
          <Button
            variant='contained'
            onClick={handleCancelOrder}
            sx={{
              bgcolor: '#EF4444',
              '&:hover': {
                bgcolor: '#DC2626'
              }
            }}>
            Yes, cancel order
          </Button>
        </DialogActions>
      </Dialog>
    </AuthenticatedLayout>
  )
}
