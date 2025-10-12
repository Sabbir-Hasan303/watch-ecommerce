import React, { useState } from 'react'
import { router, Link } from '@inertiajs/react'
import { Download, Eye, Package, Clock, CheckCircle, XCircle, Truck, MoreVertical } from 'lucide-react'
import { Search, Filter } from '@mui/icons-material'
import { Button, InputAdornment, FormControl, Menu, MenuItem, Divider, IconButton } from '@mui/material'
import Badge from '@mui/material/Badge'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/Components/ui/dropdown-menu'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mui/material'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomSelectField from '@/Components/CustomSelectField'
import CustomTextField from '@/Components/CustomTextField'

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

export default function OrdersList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const [orders] = useState([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: { name: 'John Doe', email: 'john@example.com' },
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: 3,
      paymentMethod: 'Credit Card'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: { name: 'Jane Smith', email: 'jane@example.com' },
      date: '2024-01-16',
      status: 'shipped',
      total: 149.99,
      items: 2,
      paymentMethod: 'PayPal'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: { name: 'Bob Johnson', email: 'bob@example.com' },
      date: '2024-01-17',
      status: 'confirmed',
      total: 89.99,
      items: 1,
      paymentMethod: 'Credit Card'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customer: { name: 'Alice Williams', email: 'alice@example.com' },
      date: '2024-01-18',
      status: 'pending',
      total: 199.99,
      items: 4,
      paymentMethod: 'Debit Card'
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      customer: { name: 'Charlie Brown', email: 'charlie@example.com' },
      date: '2024-01-19',
      status: 'cancelled',
      total: 59.99,
      items: 1,
      paymentMethod: 'Credit Card'
    }
  ])

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === '' || statusConfig[order.status]?.label.toLowerCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewOrder = orderId => {
    router.push(`/orders/${orderId}`)
  }

  const handleMenuOpen = (event, orderId) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedOrderId(orderId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedOrderId(null)
  }

  const handleMenuItemClick = (action, orderId) => {
    handleMenuClose()
    switch (action) {
      case 'view':
        handleViewOrder(orderId)
        break
      case 'download':
        // Handle download invoice
        console.log('Download invoice for order:', orderId)
        break
      case 'cancel':
        // Handle cancel order
        console.log('Cancel order:', orderId)
        break
      default:
        break
    }
  }

  return (
    <AuthenticatedLayout>
      <div className='py-4'>
        <div className='space-y-6'>
          <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
            <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Order Management</h2>
            <div>
              <Button variant='outline' className='gap-2 bg-transparent'>
                <Download className='w-4 h-4' />
                Export
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className=''>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className=''>
                {/* <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' /> */}
                <CustomTextField
                  placeholder='Search by order number, customer name, or email...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-10'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search className='w-4 h-4 mr-2' />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <FormControl size='small' sx={{ minWidth: 200 }}>
                <CustomSelectField
                  placeholder='All Statuses'
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  label='Status'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Filter className='w-4 h-4 mr-2' />
                      </InputAdornment>
                    )
                  }}
                  options={[
                    { value: '', label: 'All Statuses' },
                    ...Object.values(statusConfig).map(status => ({ value: status.label.toLowerCase(), label: status.label }))
                  ]}
                />
              </FormControl>
            </div>
          </div>

          {/* Orders Table */}
          <div className='bg-card border border-border rounded-xl overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-muted/50'>
                  <tr className='border-b border-border'>
                    <th className='text-left py-4 px-6 text-sm font-semibold text-foreground'>Order</th>
                    <th className='text-left py-4 px-6 text-sm font-semibold text-foreground'>Customer</th>
                    <th className='text-left py-4 px-6 text-sm font-semibold text-foreground'>Date</th>
                    <th className='text-left py-4 px-6 text-sm font-semibold text-foreground'>Status</th>
                    <th className='text-left py-4 px-6 text-sm font-semibold text-foreground'>Items</th>
                    <th className='text-left py-4 px-6 text-sm font-semibold text-foreground'>Total</th>
                    <th className='text-right py-4 px-6 text-sm font-semibold text-foreground'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const StatusIcon = statusConfig[order.status].icon
                    return (
                      <tr
                        key={order.id}
                        className='border-b border-border hover:bg-muted/30 transition-colors cursor-pointer group'
                        onClick={() => handleViewOrder(order.id)}>
                        <td className='py-4 px-6'>
                          <div>
                            <p className='font-semibold text-foreground'>{order.orderNumber}</p>
                            <p className='text-sm text-muted-foreground'>{order.paymentMethod}</p>
                          </div>
                        </td>
                        <td className='py-4 px-6'>
                          <div>
                            <p className='font-medium text-foreground'>{order.customer.name}</p>
                            <p className='text-sm text-muted-foreground'>{order.customer.email}</p>
                          </div>
                        </td>
                        <td className='py-4 px-6'>
                          <p className='text-sm text-foreground'>
                            {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </td>
                        <td className='py-4 px-6'>
                          <Badge variant='outline' className={`gap-1.5 ${statusConfig[order.status].color}`}>
                            <StatusIcon className='w-3.5 h-3.5' />
                            {statusConfig[order.status].label}
                          </Badge>
                        </td>
                        <td className='py-4 px-6'>
                          <p className='text-sm text-foreground'>{order.items} items</p>
                        </td>
                        <td className='py-4 px-6'>
                          <p className='font-semibold text-foreground'>${order.total.toFixed(2)}</p>
                        </td>
                        <td className='py-4 px-6'>
                          <div className='flex items-center justify-end gap-2'>
                            <Link href={`/orders/${order.id}`} className='w-8 h-8'>
                              <IconButton size='small' className='h-8 w-8'>
                                <Eye className='w-4 h-4' />
                              </IconButton>
                            </Link>
                            <IconButton size='small' className='h-8 w-8' onClick={e => handleMenuOpen(e, order.id)}>
                              <MoreVertical className='w-4 h-4' />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className='py-12 text-center'>
                <Package className='w-12 h-12 text-muted-foreground mx-auto mb-3' />
                <p className='text-muted-foreground'>No orders found</p>
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }
            }}>
            <MenuItem
              onClick={() => handleMenuItemClick('view', selectedOrderId)}
              sx={{
                fontSize: '0.875rem',
                py: 1.5,
                px: 2
              }}>
              <Eye className='w-4 h-4 mr-2' />
              View Details
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick('download', selectedOrderId)}
              sx={{
                fontSize: '0.875rem',
                py: 1.5,
                px: 2
              }}>
              <Download className='w-4 h-4 mr-2' />
              Download Invoice
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => handleMenuItemClick('cancel', selectedOrderId)}
              sx={{
                fontSize: '0.875rem',
                py: 1.5,
                px: 2,
                color: 'error.main'
              }}>
              <XCircle className='w-4 h-4 mr-2' />
              Cancel Order
            </MenuItem>
          </Menu>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
