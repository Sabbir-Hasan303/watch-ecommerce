import { React, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { Plus, Edit, Trash2, ArrowLeft, Save, GripVertical, ImageIcon, Eye, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react'
import { Button, InputAdornment, FormControl, Box, Typography } from '@mui/material'
import { Badge } from '@/Components/ui/badge'
import { Card } from '@/Components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'

export default function VariantList({ productId }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const itemsPerPage = 10

  const [variants] = useState([
    {
      id: '1',
      name: 'Black / S',
      sku: 'TSH-BLK-S',
      price: 29.99,
      stock: 45,
      options: { Size: 'S', Color: 'Black' },
      status: 'active'
    },
    {
      id: '2',
      name: 'Black / M',
      sku: 'TSH-BLK-M',
      price: 29.99,
      stock: 67,
      options: { Size: 'M', Color: 'Black' },
      status: 'active'
    },
    {
      id: '3',
      name: 'White / S',
      sku: 'TSH-WHT-S',
      price: 29.99,
      stock: 23,
      options: { Size: 'S', Color: 'White' },
      status: 'active'
    },
    {
      id: '4',
      name: 'Blue / L',
      sku: 'TSH-BLU-L',
      price: 32.99,
      stock: 12,
      options: { Size: 'L', Color: 'Blue' },
      status: 'active'
    }
  ])

  const filteredVariants = variants.filter(variant => {
    const matchesSearch =
      variant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variant.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(variant.options).some(value => value.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVariants = filteredVariants.slice(startIndex, startIndex + itemsPerPage)

  const totalVariants = variants.length
  const activeVariants = variants.filter(v => v.status === 'active').length
  const lowStockVariants = variants.filter(v => v.stock < 10).length
  const totalValue = variants.reduce((sum, v) => sum + v.price * v.stock, 0)

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return ''
    }
  }

  return (
    <AuthenticatedLayout>
      <Head title='Product Variant List' />
      <div className='py-4'>
        <div className='mb-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div>
              <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Product Variant List</h2>
              <p className='text-sm text-muted-foreground'>Manage product variants and inventory</p>
            </div>
            <Link href={`/products/edit/${productId}`}>
              <Button variant='ghost' size='sm' className='gap-2 text-gray-400 hover:text-white'>
                <ArrowLeft className='w-4 h-4' />
                Back to Product
              </Button>
            </Link>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card className='p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Total Variants</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{totalVariants}</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <GripVertical className='h-7 w-7 text-blue-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Active Variants</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{activeVariants}</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <Plus className='h-7 w-7 text-emerald-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Low Stock</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{lowStockVariants}</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <Trash2 className='h-7 w-7 text-amber-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Total Value</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>${totalValue.toFixed(0)}</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <Save className='h-7 w-7 text-purple-400' />
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
                    placeholder='Search variants...'
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
                <Link href={`/products/edit/${productId}/variants/create`}>
                  <Button className='gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'>
                    <Plus className='w-4 h-4' />
                    Add Variant
                  </Button>
                </Link>
              </Box>
            </div>
          </Card>
          {/* Variants Table */}
          <div className=''>
            <TableContainer component={Paper} sx={{ maxHeight: '500px' }} className='table-container'>
              <Table sx={{ minWidth: 650 }} aria-label='variants table'>
                <TableHead>
                  <TableRow className='table-header-cell dark:table-header-cell' sx={{ minWidth: 150 }}>
                    <TableCell className='table-header-cell dark:table-header-cell'>Variant</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>SKU</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Price</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Stock</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Status</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedVariants.map(variant => (
                    <TableRow
                      key={variant.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { bgcolor: 'rgba(55, 65, 81, 0.3)' },
                        borderColor: '#374151'
                      }}>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <div className='flex items-center gap-3'>
                          <div className='relative'>
                            <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-text-primary font-semibold shadow-lg shadow-blue-500/30'>
                              {variant.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <p className='font-medium'>{variant.name}</p>
                            <div className='flex gap-2 mt-1'>
                              {Object.entries(variant.options).map(([key, value]) => (
                                <Badge key={key} variant='outline' className='text-xs'>
                                  {value}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='font-medium'>{variant.sku}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='font-medium text-emerald-400'>${variant.price.toFixed(2)}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='font-medium'>{variant.stock}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Badge variant='outline' className={getStatusColor(variant.status)}>
                          {variant.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outlined'
                            size='small'
                            startIcon={<Eye size={16} />}
                            onClick={() => setSelectedVariant(variant)}
                            sx={{
                              padding: '7px 11px',
                              minWidth: '0px',
                              '& .MuiButton-startIcon': {
                                marginRight: 0,
                                marginLeft: 0
                              }
                            }}></Button>
                          <Button
                            variant='outlined'
                            size='small'
                            startIcon={<Edit size={16} />}
                            sx={{
                              padding: '7px 11px',
                              minWidth: '0px',
                              '& .MuiButton-startIcon': {
                                marginRight: 0,
                                marginLeft: 0
                              }
                            }}></Button>
                        </div>
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVariants.length)} of {filteredVariants.length} variants
              </p>
            </div>
            {totalPages > 1 && (
              <div className='flex items-center gap-2'>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  sx={{
                    color: '#9CA3AF',
                    borderColor: '#374151',
                    '&:hover': {
                      bgcolor: 'rgba(55, 65, 81, 0.3)',
                      borderColor: '#6B7280'
                    }
                  }}>
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <div className='flex items-center gap-1'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'contained' : 'outlined'}
                      size='small'
                      onClick={() => setCurrentPage(page)}
                      sx={{
                        color: currentPage === page ? 'white' : '#9CA3AF',
                        borderColor: '#374151',
                        backgroundColor: currentPage === page ? '#10B981' : 'transparent',
                        '&:hover': {
                          bgcolor: currentPage === page ? '#059669' : 'rgba(16, 185, 129, 0.1)',
                          borderColor: currentPage === page ? '#059669' : '#10B981'
                        }
                      }}>
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  sx={{
                    color: '#9CA3AF',
                    borderColor: '#374151',
                    '&:hover': {
                      bgcolor: 'rgba(55, 65, 81, 0.3)',
                      borderColor: '#6B7280'
                    }
                  }}>
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
