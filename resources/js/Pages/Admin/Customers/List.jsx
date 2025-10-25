import { React, useState } from 'react'
import { Search, UserCheck, TrendingUp, Star, Eye, MoreVertical } from 'lucide-react'
import { Button, InputAdornment, FormControl, Box, Typography, IconButton, Menu, MenuItem, Divider, TablePagination } from '@mui/material'
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material'
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'
import { Head, router } from '@inertiajs/react'
import { Card } from '@/Components/ui/card'

const mockCustomers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    joinDate: '2024-01-15',
    totalOrders: 24,
    totalSpent: 4850.0,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, USA',
    joinDate: '2024-02-20',
    totalOrders: 15,
    totalSpent: 3200.5,
  },
  {
    id: '3',
    name: 'Emma Williams',
    email: 'emma.w@example.com',
    phone: '+1 (555) 345-6789',
    location: 'Los Angeles, USA',
    joinDate: '2024-03-10',
    totalOrders: 8,
    totalSpent: 1580.0,
  },
  {
    id: '4',
    name: 'James Rodriguez',
    email: 'james.r@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Miami, USA',
    joinDate: '2024-01-25',
    totalOrders: 32,
    totalSpent: 6750.75,
  },
  {
    id: '5',
    name: 'Olivia Brown',
    email: 'olivia.b@example.com',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, USA',
    joinDate: '2024-04-05',
    totalOrders: 5,
    totalSpent: 890.0,
  },
  {
    id: '6',
    name: 'David Kim',
    email: 'david.k@example.com',
    phone: '+1 (555) 678-9012',
    location: 'Seattle, USA',
    joinDate: '2023-12-10',
    totalOrders: 2,
    totalSpent: 250.0,
  }
]

export default function CustomerList() {
  const [customers] = useState(mockCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const startIndex = page * rowsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + rowsPerPage)

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  const handleMenuOpen = (event, customerId) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedCustomerId(customerId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedCustomerId(null)
  }

  const handleMenuItemClick = (action, customerId) => {
    handleMenuClose()
    switch (action) {
      case 'view':
        const customer = customers.find(c => c.id === customerId)
        setSelectedCustomer(customer)
        break
      case 'orders':
        router.visit(`/customers/${customerId}/orders`)
        break
      default:
        break
    }
  }

  return (
    <AuthenticatedLayout>
      <Head title='Customer Management' />
      <div className='py-4'>
        <div className='mb-6'>
          <div>
            <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Customer Management</h2>
            <p className='text-sm text-muted-foreground'>Manage customers, reviews, and ratings</p>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card className='p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Total Customers</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{totalCustomers}</p>
                  <p className='text-xs text-text-primary mt-1 flex items-center gap-1'>
                    <TrendingUp className='w-3 h-3' />
                    +12% this month
                  </p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <UserCheck className='h-7 w-7 text-blue-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Total Revenue</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>${totalRevenue.toFixed(0)}</p>
                  <p className='text-xs text-text-primary mt-1 flex items-center gap-1'>
                    <TrendingUp className='w-3 h-3' />
                    +15% this month
                  </p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <TrendingUp className='h-7 w-7 text-purple-400' />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters and Actions */}
          <div className='bg-card shadow-lg rounded-lg'>
            <div className='p-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
              <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
                <FormControl size='small' sx={{ minWidth: 300 }}>
                  <CustomTextField
                    placeholder='Search customers...'
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
              </div>
            </div>

            <Paper sx={{ width: '100%' }}>
              <TableContainer sx={{ maxHeight: '500px' }} className='table-container'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className='table-header-cell dark:table-header-cell'>
                        <div className='flex items-center gap-2'>
                          Customer
                        </div>
                      </TableCell>
                      <TableCell className='table-header-cell dark:table-header-cell'>
                        <div className='flex items-center gap-2'>
                          Contact
                        </div>
                      </TableCell>
                      <TableCell className='table-header-cell dark:table-header-cell'>
                        <div className='flex items-center gap-2'>
                          Location
                        </div>
                      </TableCell>
                      <TableCell className='table-header-cell dark:table-header-cell'>
                        <div className='flex items-center gap-2'>
                          Orders
                        </div>
                      </TableCell>
                      <TableCell className='table-header-cell dark:table-header-cell'>
                        <div className='flex items-center gap-2'>
                          Total Spent
                        </div>
                      </TableCell>
                      <TableCell className='table-header-cell dark:table-header-cell !text-center'>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className='table-body-cell dark:table-body-cell text-center py-8'>
                          <Typography variant='body2' className='text-muted-foreground'>
                            No customers found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedCustomers.map(customer => (
                        <TableRow key={customer.id} hover>
                          <TableCell className='table-body-cell dark:table-body-cell'>
                            <div className='flex items-center gap-3'>
                              <div className='relative'>
                                <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-text-primary font-semibold shadow-lg shadow-emerald-500/30'>
                                  {customer.name.charAt(0)}
                                </div>
                                {customer.status === 'vip' && (
                                  <div className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center'>
                                    <Star className='h-2.5 w-2.5 text-text-primary fill-white' />
                                  </div>
                                )}
                              </div>
                              <div className='min-w-0'>
                                <Typography variant='body2' className='font-medium text-foreground truncate'>
                                  {customer.name}
                                </Typography>
                                <Typography variant='caption' className='text-muted-foreground'>
                                  Joined {new Date(customer.joinDate).toLocaleDateString()}
                                </Typography>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className='table-body-cell dark:table-body-cell'>
                            <div>
                              <Typography variant='body2' className='font-medium text-foreground'>
                                {customer.email}
                              </Typography>
                              <Typography variant='caption' className='text-muted-foreground'>
                                {customer.phone}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell className='table-body-cell dark:table-body-cell'>
                            <Typography variant='body2' className='text-foreground'>
                              {customer.location}
                            </Typography>
                          </TableCell>
                          <TableCell className='table-body-cell dark:table-body-cell'>
                            <Typography variant='body2' className='text-foreground'>
                              {customer.totalOrders} orders
                            </Typography>
                          </TableCell>
                          <TableCell className='table-body-cell dark:table-body-cell'>
                            <Typography variant='body2' className='font-semibold text-foreground'>
                              ${customer.totalSpent.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell className='table-body-cell dark:table-body-cell'>
                            <div className='flex items-center justify-center gap-2'>
                              <IconButton size='small' className='h-8 w-8' onClick={e => handleMenuOpen(e, customer.id)}>
                                <MoreVertical className='w-4 h-4' />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                className='table-pagination dark:table-pagination'
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component='div'
                count={filteredCustomers.length}
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
              onClick={() => handleMenuItemClick('view', selectedCustomerId)}
              sx={{
                fontSize: '0.875rem',
                py: 1.5,
                px: 2
              }}>
              <Eye className='w-4 h-4 mr-2' />
              View Details
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick('orders', selectedCustomerId)}
              sx={{
                fontSize: '0.875rem',
                py: 1.5,
                px: 2
              }}>
              <UserCheck className='w-4 h-4 mr-2' />
              View Orders
            </MenuItem>
          </Menu>
        </div>

        {/* Customer Details Dialog */}
        <Dialog
          open={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          maxWidth='sm'
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#1C252E',
              border: '1px solid #374151',
              borderRadius: '12px'
            }
          }}>
          <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600, pb: 1 }} className='text-text-primary'>
            Customer Details
          </DialogTitle>
          {selectedCustomer && (
            <DialogContent className='text-text-primary' sx={{ pt: 2 }}>
              {/* Customer Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  mb: 3,
                  p: 2,
                  bgcolor: 'rgba(16, 185, 129, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(16, 185, 129, 0.1)'
                }}>
                <div className='relative'>
                  <div className='h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-text-primary font-semibold text-2xl shadow-lg shadow-emerald-500/30'>
                    {selectedCustomer.name.charAt(0)}
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-xl font-bold text-text-primary'>{selectedCustomer.name}</h3>
                  </div>
                  <p className='text-muted-foreground text-sm'>Member since {new Date(selectedCustomer.joinDate).toLocaleDateString()}</p>
                </div>
              </Box>

              {/* Contact Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' sx={{ mb: 2, color: '#10B981', fontWeight: 600 }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(59, 130, 246, 0.05)', borderRadius: 1, border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <Typography variant='body2' sx={{ color: '#9CA3AF', mb: 0.5, fontWeight: 500 }}>
                      Email
                    </Typography>
                    <Typography variant='body2' className='text-text-primary'>
                      {selectedCustomer.email}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.05)', borderRadius: 1, border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <Typography variant='body2' sx={{ color: '#9CA3AF', mb: 0.5, fontWeight: 500 }}>
                      Phone
                    </Typography>
                    <Typography variant='body2' className='text-text-primary'>
                      {selectedCustomer.phone}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(168, 85, 247, 0.05)',
                      borderRadius: 1,
                      border: '1px solid rgba(168, 85, 247, 0.1)',
                      gridColumn: '1 / -1'
                    }}>
                    <Typography variant='body2' sx={{ color: '#9CA3AF', mb: 0.5, fontWeight: 500 }}>
                      Address
                    </Typography>
                    <Typography variant='body2' className='text-text-primary'>
                      {selectedCustomer.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Business Statistics */}
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle1' sx={{ mb: 2, color: '#10B981', fontWeight: 600 }}>
                  Business Statistics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(245, 158, 11, 0.05)',
                      borderRadius: 1,
                      border: '1px solid rgba(245, 158, 11, 0.1)',
                      textAlign: 'center'
                    }}>
                    <Typography variant='body2' sx={{ color: '#9CA3AF', mb: 0.5, fontWeight: 500 }}>
                      Total Orders
                    </Typography>
                    <Typography variant='h5' sx={{ color: '#F59E0B', fontWeight: 700 }}>
                      {selectedCustomer.totalOrders}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(34, 197, 94, 0.05)',
                      borderRadius: 1,
                      border: '1px solid rgba(34, 197, 94, 0.1)',
                      textAlign: 'center'
                    }}>
                    <Typography variant='body2' sx={{ color: '#9CA3AF', mb: 0.5, fontWeight: 500 }}>
                      Total Spent
                    </Typography>
                    <Typography variant='h5' sx={{ color: '#22C55E', fontWeight: 700 }}>
                      ${selectedCustomer.totalSpent.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          )}
          <DialogActions sx={{ p: 2, gap: 1, borderTop: '1px solid #374151' }}>
            <Button
              variant='outlined'
              onClick={() => setSelectedCustomer(null)}
              sx={{
                color: '#9CA3AF',
                borderColor: '#374151',
                px: 2,
                py: 1,
                '&:hover': {
                  bgcolor: 'rgba(55, 65, 81, 0.3)',
                  borderColor: '#6B7280'
                }
              }}>
              Close
            </Button>
            <Button
              variant='contained'
              //   startIcon={<Eye size={16} />}
              className='!bg-text-primary !text-primary-foreground'
              onClick={() => {
                router.visit(`/customers/${selectedCustomer.id}/orders`)
                setSelectedCustomer(null)
              }}>
              View Orders
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}
