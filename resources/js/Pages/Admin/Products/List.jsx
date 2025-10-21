import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import {
    Button,
    FormControl,
    InputAdornment,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Typography,
    Chip,
    TablePagination
} from '@mui/material'
import { Link } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'
import { Head } from '@inertiajs/react'

export default function ProductList({ products = [], categories = [], statuses = [], flash }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Prepare categories and statuses for dropdowns
    const categoryOptions = ['all', ...categories]
    const statusOptions = ['all', ...statuses]

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                             (product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
        const matchesCategory = selectedCategory === 'all' || product.primary_category === selectedCategory
        const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
        return matchesSearch && matchesCategory && matchesStatus
    })

    // Pagination
    const startIndex = page * rowsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage)

    const handleDelete = productId => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            router.delete(`/products/${productId}`)
        }
    }

    const handleEdit = productId => {
        router.visit(`/products/edit/${productId}`)
    }

    const formatPrice = (minPrice, maxPrice) => {
        if (minPrice === null || maxPrice === null || minPrice === undefined || maxPrice === undefined) {
            return 'No price set'
        }

        const min = Number(minPrice)
        const max = Number(maxPrice)

        if (isNaN(min) || isNaN(max)) {
            return 'No price set'
        }

        if (min === max) {
            return `$${min.toFixed(2)}`
        }

        return `$${min.toFixed(2)} - $${max.toFixed(2)}`
    }

    return (
        <AuthenticatedLayout flash={flash}>
            <Head title='Product Management' />

            <div className='py-4 custom-container mx-auto md:px-[40px] md:py-[18px]'>
                <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                    <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Product Management</h2>
                    <div>
                        <Link href='/products/create'>
                            <Button variant='outlined' size='md' startIcon={<Plus className='w-4 h-4' />}>
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className='space-y-6'>
                    {/* Filters and Actions */}
                    <div className='bg-card shadow-lg rounded-lg'>
                        <div className='p-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
                            <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
                                <FormControl size='small' sx={{ minWidth: 300 }}>
                                    <CustomTextField
                                        placeholder='Search products...'
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className='pl-10'
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
                                        options={categoryOptions.map(category => ({ value: category, label: category.charAt(0).toUpperCase() + category.slice(1) }))}
                                    />
                                </FormControl>

                                <FormControl size='small' sx={{ minWidth: 200 }}>
                                    <CustomSelectField
                                        placeholder='Select status...'
                                        value={selectedStatus}
                                        onChange={e => setSelectedStatus(e.target.value)}
                                        label='Status'
                                        startAdornment={<Filter className='w-4 h-4 mr-2' />}
                                        options={statusOptions.map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))}
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
                                            <TableCell className='table-header-cell dark:table-header-cell'>Variants</TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell'>Status</TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell !text-center'>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedProducts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className='table-body-cell dark:table-body-cell text-center py-8'>
                                                    <Typography variant='body2' className='text-muted-foreground'>
                                                        No products found
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedProducts.map(product => (
                                            <TableRow key={product.id} hover>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <div className='flex items-center gap-3'>
                                                        <img
                                                            src={product.primary_image ? `/storage/${product.primary_image}` : '/placeholder.svg'}
                                                            alt={product.name}
                                                            className='w-12 h-12 rounded-lg object-cover bg-muted flex-shrink-0'
                                                        />
                                                        <div className='min-w-0'>
                                                            <Typography variant='body2' className='font-medium text-foreground truncate'>
                                                                {product.name}
                                                            </Typography>
                                                            <Typography variant='caption' className='text-muted-foreground'>
                                                                SKU: {product.sku}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <Chip label={product.primary_category} variant='outlined' size='small' />
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <Typography variant='body2' className='font-semibold text-foreground'>
                                                        {formatPrice(product.min_price, product.max_price)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <Typography
                                                        variant='body2'
                                                        className={cn(
                                                            'font-medium',
                                                            (product.total_stock || 0) === 0 ? 'text-red-400' : (product.total_stock || 0) < 20 ? 'text-amber-400' : 'text-emerald-400'
                                                        )}>
                                                        {(product.total_stock || 0) > 0 ? `${product.total_stock} in stock` : 'Out of stock'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <Chip
                                                        label={`${product.variants_count || 0} variants`}
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{
                                                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                            color: '#10B981',
                                                            border: 'none',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(16, 185, 129, 0.2)'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <Chip
                                                        label={product.status}
                                                        size='small'
                                                        sx={{
                                                            bgcolor: product.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                            color: product.status === 'active' ? '#22C55E' : '#F59E0B',
                                                            border: 'none',
                                                            '&:hover': {
                                                                bgcolor: product.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className='table-body-cell dark:table-body-cell'>
                                                    <div className='flex items-center'>
                                                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                                                            <Eye className='w-4 h-4' />
                                                        </Button>
                                                        <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => handleEdit(product.id)}>
                                                            <Edit className='w-4 h-4' />
                                                        </Button>
                                                        <Button variant='ghost' size='icon' className='h-8 w-8 text-destructive' onClick={() => handleDelete(product.id)}>
                                                            <Trash2 className='w-4 h-4' />
                                                        </Button>
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

                </div>
            </div>
        </AuthenticatedLayout>
    )
}
