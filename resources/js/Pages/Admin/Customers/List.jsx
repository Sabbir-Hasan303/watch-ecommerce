import { React, useState } from 'react'
import { Search, UserCheck, TrendingUp, Star, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Button, Badge, InputAdornment, FormControl, Pagination, Box, Typography } from '@mui/material'
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
    averageRating: 4.8,
    reviewsCount: 18,
    status: 'vip'
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
    averageRating: 4.5,
    reviewsCount: 12,
    status: 'active'
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
    averageRating: 4.2,
    reviewsCount: 6,
    status: 'active'
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
    averageRating: 4.9,
    reviewsCount: 25,
    status: 'vip'
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
    averageRating: 4.0,
    reviewsCount: 3,
    status: 'active'
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
    averageRating: 3.5,
    reviewsCount: 1,
    status: 'inactive'
  }
]

export default function CustomerList() {
  const [customers] = useState(mockCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active' || c.status === 'vip').length
  const vipCustomers = customers.filter(c => c.status === 'vip').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  const getStatusColor = status => {
    switch (status) {
      case 'vip':
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30'
      case 'active':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
      case 'inactive':
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30'
      default:
        return ''
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

            <Card className='p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Active Customers</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{activeCustomers}</p>
                  <p className='text-xs text-text-primary mt-1 flex items-center gap-1'>
                    <TrendingUp className='w-3 h-3' />
                    +8% this month
                  </p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <UserCheck className='h-7 w-7 text-emerald-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>VIP Customers</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{vipCustomers}</p>
                  <p className='text-xs text-text-primary mt-1 flex items-center gap-1'>
                    <Star className='w-3 h-3 fill-amber-400' />
                    Premium tier
                  </p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <Star className='h-7 w-7 text-amber-400 fill-amber-400' />
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

          {/* Search and Filters */}
          <Card className='p-6'>
            <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
              <div className='flex-1 w-full md:max-w-md'>
                <div className='relative'>
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
                </div>
              </div>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl size='small' sx={{ minWidth: 200 }}>
                  <CustomSelectField
                    placeholder='Filter by status...'
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
                      { value: 'all', label: 'All Customers' },
                      { value: 'vip', label: 'VIP' },
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' }
                    ]}
                  />
                </FormControl>
              </Box>
            </div>
          </Card>

          {/* Customers Table */}
          <div className=''>
            <TableContainer component={Paper} sx={{ maxHeight: '500px' }} className='table-container'>
              <Table sx={{ minWidth: 650 }} aria-label='customers table'>
                <TableHead>
                  <TableRow className='table-header-cell dark:table-header-cell' sx={{ minWidth: 150 }}>
                    <TableCell className='table-header-cell dark:table-header-cell'>Customer</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Contact</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Location</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Orders</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Spent</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Rating</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Status</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCustomers.map(customer => (
                    <TableRow
                      key={customer.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { bgcolor: 'rgba(55, 65, 81, 0.3)' },
                        borderColor: '#374151'
                      }}>
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
                          <div>
                            <p className='font-medium'>{customer.name}</p>
                            <p className='text-xs text-muted-foreground'>Joined {new Date(customer.joinDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <div className='space-y-1'>
                          <p className='text-sm'>{customer.email}</p>
                          <p className='text-xs text-muted-foreground'>{customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='text-sm'>{customer.location}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='font-medium'>{customer.totalOrders}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='font-medium text-emerald-400'>${customer.totalSpent.toFixed(2)}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <div className='flex items-center gap-1'>
                          <Star className='h-4 w-4 text-amber-400 fill-amber-400' />
                          <span className='font-medium'>{customer.averageRating.toFixed(1)}</span>
                          <span className='text-xs text-muted-foreground'>({customer.reviewsCount})</span>
                        </div>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Badge
                          label={customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          size='small'
                          sx={{
                            bgcolor:
                              customer.status === 'vip'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : customer.status === 'active'
                                ? 'rgba(34, 197, 94, 0.1)'
                                : 'rgba(107, 114, 128, 0.1)',
                            color: customer.status === 'vip' ? '#F59E0B' : customer.status === 'active' ? '#22C55E' : '#6B7280',
                            border: 'none',
                            '&:hover': {
                              bgcolor:
                                customer.status === 'vip'
                                  ? 'rgba(245, 158, 11, 0.2)'
                                  : customer.status === 'active'
                                  ? 'rgba(34, 197, 94, 0.2)'
                                  : 'rgba(107, 114, 128, 0.2)'
                            }
                          }}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Button
                          variant='outlined'
                          size='small'
                          startIcon={<Eye size={16} />}
                          onClick={() => setSelectedCustomer(customer)}
                          sx={{
                            color: '#10B981',
                            borderColor: '#10B981',
                            '&:hover': {
                              bgcolor: 'rgba(16, 185, 129, 0.1)',
                              borderColor: '#059669'
                            }
                          }}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-4'>
              <p className='text-sm text-muted-foreground'>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
              </p>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-muted-foreground'>Show:</span>
                <FormControl size='small' sx={{ minWidth: 80 }}>
                  <CustomSelectField
                    value={itemsPerPage}
                    onChange={e => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    options={[
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 20, label: '20' },
                      { value: 50, label: '50' }
                    ]}
                  />
                </FormControl>
              </div>
            </div>
            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                color='primary'
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#9CA3AF',
                    '&.Mui-selected': {
                      backgroundColor: '#10B981',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#059669'
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(16, 185, 129, 0.1)'
                    }
                  }
                }}
              />
            )}
          </div>
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
                  {selectedCustomer.status === 'vip' && (
                    <div className='absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg'>
                      <Star className='h-3 w-3 text-text-primary fill-white' />
                    </div>
                  )}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-xl font-bold text-text-primary'>{selectedCustomer.name}</h3>
                    <Badge
                      label={selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                      size='small'
                      sx={{
                        bgcolor:
                          selectedCustomer.status === 'vip'
                            ? 'rgba(245, 158, 11, 0.1)'
                            : selectedCustomer.status === 'active'
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(107, 114, 128, 0.1)',
                        color: selectedCustomer.status === 'vip' ? '#F59E0B' : selectedCustomer.status === 'active' ? '#22C55E' : '#6B7280',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                      {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                    </Badge>
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
                      Location
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
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(245, 158, 11, 0.05)',
                      borderRadius: 1,
                      border: '1px solid rgba(245, 158, 11, 0.1)',
                      textAlign: 'center'
                    }}>
                    <Typography variant='body2' sx={{ color: '#9CA3AF', mb: 0.5, fontWeight: 500 }}>
                      Average Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Star size={16} className='text-amber-400 fill-amber-400' />
                      <Typography variant='h5' sx={{ color: '#F59E0B', fontWeight: 700 }}>
                        {selectedCustomer.averageRating.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(59, 130, 246, 0.05)',
                      borderRadius: 1,
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                      textAlign: 'center'
                    }}>
                    <Typography variant='body2' sx={{ color: '#9CA3AF', mb: 0.5, fontWeight: 500 }}>
                      Reviews
                    </Typography>
                    <Typography variant='h5' sx={{ color: '#3B82F6', fontWeight: 700 }}>
                      {selectedCustomer.reviewsCount}
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
              startIcon={<Eye size={16} />}
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
