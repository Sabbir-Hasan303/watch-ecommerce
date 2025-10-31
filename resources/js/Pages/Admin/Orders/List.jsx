import React, { useState } from 'react'
import { router, Link } from '@inertiajs/react'
import { Download, Eye, Package, Clock, CheckCircle, XCircle, Truck, MoreVertical } from 'lucide-react'
import { Search, Filter } from '@mui/icons-material'
import { Button, InputAdornment, FormControl, Menu, MenuItem, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Typography, Chip, TablePagination } from '@mui/material'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomSelectField from '@/Components/CustomSelectField'
import CustomTextField from '@/Components/CustomTextField'
import CancelOrderDialog from '@/Components/CancelOrderDialog'
import { Head } from '@inertiajs/react'
import Taka from '@/Components/Taka'

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

export default function OrdersList({ orders = [], flash }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === '' || statusConfig[order.status]?.label.toLowerCase() === statusFilter

        return matchesSearch && matchesStatus
    })

    // Pagination
    const startIndex = page * rowsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage)

    const handleViewOrder = orderId => {
        router.visit(route('admin.orders.show', { id: orderId }))
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
                window.open(route('admin.orders.invoice', { id: orderId }), '_blank')
                break
            case 'cancel':
                // Handle cancel order
                setSelectedOrderId(orderId)
                setCancelDialogOpen(true)
                break
            default:
                break
        }
    }

    const handleCancelOrderSuccess = () => {
        // Refresh the page to show updated order status
        router.reload()
    }

    return (
        <AuthenticatedLayout flash={flash}>
            <Head title='Order Management' />
            <div className='py-4 custom-container mx-auto md:px-[40px] md:py-[18px]'>
                <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                    <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Order Management</h2>
                    {/* <div>
                        <Button variant='outlined' size='md' startIcon={<Download className='w-4 h-4' />}>
                            Export
                        </Button>
                    </div> */}
                </div>

                <div className='space-y-6'>
                    {/* Filters and Actions */}
                    <div className='bg-card shadow-lg rounded-lg'>
                        <div className='p-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
                            <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
                                <FormControl size='small' sx={{ minWidth: 300 }}>
                                    <CustomTextField
                                        placeholder='Search orders...'
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
                                </FormControl>

                                <FormControl size='small' sx={{ minWidth: 200 }}>
                                    <CustomSelectField
                                        placeholder='Select status...'
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

                        <Paper sx={{ width: '100%' }}>
                            <TableContainer sx={{ maxHeight: '500px' }} className='table-container'>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='table-header-cell dark:table-header-cell'>
                                                <div className='flex items-center gap-2'>
                                                    Order
                                                </div>
                                            </TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell'>
                                                <div className='flex items-center gap-2'>
                                                    Order From
                                                </div>
                                            </TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell'>
                                                <div className='flex items-center gap-2'>
                                                    Area
                                                </div>
                                            </TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell'>
                                                <div className='flex items-center gap-2'>
                                                    Date
                                                </div>
                                            </TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell'>
                                                <div className='flex items-center gap-2'>
                                                    Status
                                                </div>
                                            </TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell'>Items</TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell'>Total</TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell !text-center'>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedOrders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className='table-body-cell dark:table-body-cell text-center py-8'>
                                                    <Typography variant='body2' className='text-muted-foreground'>
                                                        No orders found
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedOrders.map(order => {
                                                const StatusIcon = statusConfig[order.status].icon
                                                return (
                                                    <TableRow key={order.id} hover>
                                                        <TableCell className='table-body-cell dark:table-body-cell'>
                                                            <div className='flex items-center gap-3'>
                                                                <div className='w-12 h-12 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center'>
                                                                    <Package className='w-6 h-6 text-muted-foreground' />
                                                                </div>
                                                                <div className='min-w-0'>
                                                                    <Typography variant='body2' className='font-medium text-foreground truncate'>
                                                                        {order.order_number}
                                                                    </Typography>
                                                                    {/* <Typography variant='caption' className='text-muted-foreground'>
                                                                        {order.payment_method}
                                                                    </Typography> */}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className='table-body-cell dark:table-body-cell'>
                                                            <div>
                                                                <Typography variant='body2' className='font-medium text-foreground'>
                                                                    {order.shipping_address.full_name}
                                                                </Typography>
                                                                <Typography variant='caption' className='text-muted-foreground'>
                                                                    {order.shipping_address.email}
                                                                </Typography><br />
                                                                <Typography variant='caption' className='text-muted-foreground'>
                                                                    {order.shipping_address.address_line}
                                                                </Typography>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className='table-body-cell dark:table-body-cell'>
                                                            <Typography variant='body2' className='text-foreground'>
                                                                {order.shipping_address.area === 'inside_dhaka' ? 'Inside Dhaka' : order.shipping_address.area === 'outside_dhaka' ? 'Outside Dhaka' : 'N/A'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell className='table-body-cell dark:table-body-cell'>
                                                            <Typography variant='body2' className='text-foreground'>
                                                                {new Date(order.date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell className='table-body-cell dark:table-body-cell'>
                                                            <Chip
                                                                label={statusConfig[order.status].label}
                                                                size='small'
                                                                icon={<StatusIcon className='w-3.5 h-3.5' />}
                                                                sx={{
                                                                    bgcolor: statusConfig[order.status].color.includes('yellow') ? 'rgba(245, 158, 11, 0.1)' : statusConfig[order.status].color.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : statusConfig[order.status].color.includes('purple') ? 'rgba(147, 51, 234, 0.1)' : statusConfig[order.status].color.includes('emerald') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',

                                                                    color: statusConfig[order.status].color.includes('yellow') ? '#F59E0B' : statusConfig[order.status].color.includes('blue') ? '#3B82F6' : statusConfig[order.status].color.includes('purple') ? '#9333EA' : statusConfig[order.status].color.includes('emerald') ? '#10B981' : '#EF4444',
                                                                    border: 'none',
                                                                    '&:hover':
                                                                    {
                                                                        bgcolor: statusConfig[order.status].color.includes('yellow') ? 'rgba(245, 158, 11, 0.2)' : statusConfig[order.status].color.includes('blue') ? 'rgba(59, 130, 246, 0.2)' : statusConfig[order.status].color.includes('purple') ? 'rgba(147, 51, 234, 0.2)' : statusConfig[order.status].color.includes('emerald') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                                                                    }
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell className='table-body-cell dark:table-body-cell'>
                                                            <Typography variant='body2' className='text-foreground'>
                                                                {order.items_count} items
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell className='table-body-cell dark:table-body-cell'>
                                                            {/* <Typography variant='body2' className='font-semibold text-foreground'>
                                                                ${order.total.toFixed(2)}
                                                            </Typography> */}
                                                            <div className='flex items-center gap-1'>
                                                                <Taka className='text-sm' />{(Number(order.total).toFixed(2) || 0)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className='table-body-cell dark:table-body-cell'>
                                                            <div className='flex items-center justify-center gap-2'>
                                                                <IconButton size='small' className='h-8 w-8' onClick={e => handleMenuOpen(e, order.id)}>
                                                                    <MoreVertical className='w-4 h-4' />
                                                                </IconButton>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                className='table-pagination dark:table-pagination'
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                component='div'
                                count={filteredOrders.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10))
                                    setPage(0) // Reset to first page when changing rows per page
                                }}
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
                            />
                        </Paper>
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

                    {/* Cancel Order Dialog */}
                    <CancelOrderDialog
                        open={cancelDialogOpen}
                        onClose={() => setCancelDialogOpen(false)}
                        orderId={selectedOrderId}
                        onSuccess={handleCancelOrderSuccess}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
