'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Search, Filter, TrendingUp } from 'lucide-react'
import {
    Card,
    Input,
    Button,
    InputAdornment,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Checkbox,
    Chip,
    TablePagination
} from '@mui/material'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'
import { router } from '@inertiajs/react'

const formatStatusOptions = (statusOptions) => {
    const statusLabels = {
        'trending': 'Trending Product',
        // 'featured': 'Featured Product',
        // 'new-arrival': 'New Arrival',
        // 'best-seller': 'Best Seller',
        // 'hot-deal': 'Hot Deal',
        'none': 'None'
    }

    return statusOptions.map(status => ({
        value: status,
        label: statusLabels[status] || status
    }))
}

export function FeaturedProducts({ featuredProducts: initialProducts = [], categories: initialCategories = [], statusOptions: initialStatusOptions = [] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedProducts, setSelectedProducts] = useState(new Set())
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [bulkStatus, setBulkStatus] = useState('trending')

    const products = initialProducts || []
    const categories = ['all', ...initialCategories]
    // Only use 'trending' and 'none' status options, ignore others from backend
    const filteredStatusOptions = initialStatusOptions.filter(status => status === 'trending' || status === 'none')
    const statusOptionsFormatted = formatStatusOptions(filteredStatusOptions)

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Pagination
    const startIndex = page * rowsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage)

    const toggleProductSelection = id => {
        const newSelected = new Set(selectedProducts)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedProducts(newSelected)
    }

    const toggleAllProducts = () => {
        if (selectedProducts.size === filteredProducts.length) {
            setSelectedProducts(new Set())
        } else {
            setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
        }
    }

    const updateProductStatus = (productId, status) => {
        router.put(route('admin.products.featured.update'),
            {
                product_id: productId,
                status: status
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        )
    }

    const handleBulkUpdate = (status) => {
        if (selectedProducts.size === 0) return

        const productIds = Array.from(selectedProducts)

        router.post(route('admin.products.featured.bulk-update'),
            {
                product_ids: productIds,
                status: status
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSelectedProducts(new Set())
                }
            }
        )
    }

    const getStatusConfig = status => {
        return statusOptionsFormatted.find(opt => opt.value === status) || statusOptionsFormatted[0]
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Trending Products</h2>
            </div>

            {/* Filters and Actions */}
            <div className='bg-card shadow-lg rounded-lg'>
                <div className='p-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
                    <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
                        <FormControl size='small' sx={{ minWidth: 300 }}>
                            <CustomTextField
                                placeholder='Search products...'
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
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
                                placeholder='Select category...'
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                label='Category'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Filter className='w-4 h-4 mr-2' />
                                        </InputAdornment>
                                    )
                                }}
                                options={categories.map(category => ({ value: category, label: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ') }))}
                            />
                        </FormControl>
                    </div>
                </div>

                <Paper sx={{ width: '100%' }}>
                    <TableContainer sx={{ maxHeight: '500px' }} className='table-container'>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='table-header-cell dark:table-header-cell'>
                                        <Checkbox
                                            checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                                            indeterminate={selectedProducts.size > 0 && selectedProducts.size < filteredProducts.length}
                                            onChange={toggleAllProducts}
                                            sx={{
                                                color: '#10B981',
                                                '&.Mui-checked': {
                                                    color: '#10B981'
                                                },
                                                '&.MuiCheckbox-indeterminate': {
                                                    color: '#10B981'
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className='table-header-cell dark:table-header-cell'>
                                        <div className='flex items-center gap-2'>
                                            Product
                                        </div>
                                    </TableCell>
                                    <TableCell className='table-header-cell dark:table-header-cell'>
                                        <div className='flex items-center gap-2'>
                                            Category
                                        </div>
                                    </TableCell>
                                    <TableCell className='table-header-cell dark:table-header-cell'>
                                        <div className='flex items-center gap-2'>
                                            Price
                                        </div>
                                    </TableCell>
                                    <TableCell className='table-header-cell dark:table-header-cell'>
                                        <div className='flex items-center gap-2'>
                                            Stock
                                        </div>
                                    </TableCell>
                                    <TableCell className='table-header-cell dark:table-header-cell'>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className='table-body-cell dark:table-body-cell text-center py-8'>
                                            <p className='text-gray-400 text-sm'>No products found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedProducts.map(product => {
                                        const statusConfig = getStatusConfig(product.status)
                                        return (
                                            <TableRow key={product.id} hover>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <Checkbox
                                                        checked={selectedProducts.has(product.id)}
                                                        onChange={() => toggleProductSelection(product.id)}
                                                        sx={{
                                                            color: '#10B981',
                                                            '&.Mui-checked': {
                                                                color: '#10B981'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <div className='flex items-center gap-3'>
                                                        <img
                                                            src={product.image ? `/storage/${product.image}` : '/placeholder.svg'}
                                                            alt={product.name}
                                                            className='w-12 h-12 rounded-lg object-cover bg-muted flex-shrink-0'
                                                        />
                                                        <div className='min-w-0'>
                                                            <p className='font-medium text-foreground truncate'>{product.name}</p>
                                                            <p className='text-xs text-muted-foreground'>
                                                                SKU: {product.sku || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <Chip label={product.category} variant='outlined' size='small' />
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <p className='font-semibold text-foreground'>${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}</p>
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <p className={cn(
                                                        'font-medium',
                                                        product.stock === 0 ? 'text-red-400' : product.stock < 20 ? 'text-amber-400' : 'text-emerald-400'
                                                    )}>
                                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                    </p>
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <CustomSelectField
                                                        value={product.status}
                                                        onChange={e => updateProductStatus(product.id, e.target.value)}
                                                        options={statusOptionsFormatted}
                                                        size='small'
                                                        sx={{ minWidth: 150 }}
                                                    />
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
                        count={filteredProducts.length}
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

            {/* Footer Actions */}
            {selectedProducts.size > 0 && (
                <div className='flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20'>
                    <span className='text-sm text-text-primary font-medium'>{selectedProducts.size} products selected</span>
                    <div className='flex-1' />
                    <FormControl size='small' sx={{ minWidth: 180 }}>
                        <CustomSelectField
                            value={bulkStatus}
                            onChange={e => setBulkStatus(e.target.value)}
                            options={statusOptionsFormatted}
                            size='small'
                            label='Select Status'
                        />
                    </FormControl>
                    <Button onClick={() => handleBulkUpdate(bulkStatus)} className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-text-primary shadow-lg hover:shadow-emerald-500/50 transition-all duration-300'>
                        Update Status
                    </Button>
                    <Button variant='outline' onClick={() => setSelectedProducts(new Set())} className='border-white/20 text-text-primary hover:bg-white/5'>
                        Clear Selection
                    </Button>
                </div>
            )}
        </div>
    )
}
