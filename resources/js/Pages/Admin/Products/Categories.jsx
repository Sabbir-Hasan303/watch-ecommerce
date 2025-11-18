import React from 'react'
import { useState } from 'react'
import { Plus, Edit, Trash2, FolderOpen, Save, X, ImageIcon, Upload, ArrowUpDown } from 'lucide-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {
    Button,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Typography,
    TablePagination,
    FormControl
} from '@mui/material'
import { Search } from '@mui/icons-material'
import CustomTextField from '@/Components/CustomTextField'
import { Head, router } from '@inertiajs/react'

export default function Categories({ categories = [] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [errors, setErrors] = useState({})
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [formData, setFormData] = useState({
        name: '',
        image: '',
        status: 'active'
    })

    const [selectedImage, setSelectedImage] = useState(null)

    // Filter categories
    const filteredCategories = categories.filter(category =>
        category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.slug?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Pagination
    const startIndex = page * rowsPerPage
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + rowsPerPage)

    const handleEdit = category => {
        setEditingCategory(category)
        setErrors({})
        setFormData({
            name: category.name,
            image: category.image_url || '',
            status: 'active'
        })

        // Set selected image if category has an existing image
        if (category.image_url) {
            setSelectedImage({
                file: null, // Existing images don't have file objects
                url: category.image_url
            })
        } else {
            setSelectedImage(null)
        }

        setShowModal(true)
    }

    const handleDelete = id => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.products.categories.destroy', id))
        }
    }

    const handleSubmit = () => {
        setErrors({})

        if (editingCategory) {
            // Update existing category
            router.post(
                route('admin.products.categories.update', editingCategory.id),
                {
                    _method: 'PUT',
                    name: formData.name,
                    image: selectedImage && selectedImage.file ? selectedImage.file : null
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        handleCancel()
                    },
                    onError: (errors) => {
                        setErrors(errors)
                        console.error('Validation errors:', errors)
                    }
                }
            )
        } else {
            // Create new category
            router.post(
                route('admin.products.categories.store'),
                {
                    name: formData.name,
                    image: selectedImage && selectedImage.file ? selectedImage.file : null
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        handleCancel()
                    },
                    onError: (errors) => {
                        setErrors(errors)
                        console.error('Validation errors:', errors)
                    }
                }
            )
        }
    }

    const handleCancel = () => {
        // Clean up image URL if it was created for preview
        if (selectedImage && selectedImage.file) {
            URL.revokeObjectURL(selectedImage.url)
        }

        setShowModal(false)
        setEditingCategory(null)
        setSelectedImage(null)
        setErrors({})
        setFormData({
            name: '',
            image: '',
            status: 'active'
        })
    }


    const handleImageUpload = event => {
        const file = event.target.files[0]
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/ico']
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, WEBP, or ICO)')
                return
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024 // 5MB in bytes
            if (file.size > maxSize) {
                alert('File size must be less than 5MB')
                return
            }

            // Create preview URL
            const imageUrl = URL.createObjectURL(file)
            setSelectedImage({
                file,
                url: imageUrl
            })

            // Update form data
            setFormData(prev => ({ ...prev, image: imageUrl }))
        }
    }

    const handleRemoveImage = () => {
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage.url)
        }
        setSelectedImage(null)
        setFormData(prev => ({ ...prev, image: '' }))
    }

    const handleFileSelect = () => {
        document.getElementById('category-image-upload')?.click()
    }

    return (
        <AuthenticatedLayout>
            <Head title='Product Categories' />
            <div className='py-4 custom-container mx-auto md:px-[40px] md:py-[18px]'>
                <div className='space-y-6'>
                    <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Product Categories</h2>
                    {/* Filters and Actions */}
                    <div className='bg-card shadow-lg rounded-lg'>
                        <div className='p-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
                            <FormControl size='small' sx={{ minWidth: 300 }}>
                                <CustomTextField
                                    placeholder='Search categories...'
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <Search color='action' className='!text-text-secondary dark:text-dark-text-primary' />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </FormControl>

                            <Button onClick={() => setShowModal(true)} variant='outlined' size='md' startIcon={<Plus className='w-4 h-4' />}>
                                Add Category
                            </Button>
                        </div>

                        <Paper sx={{ width: '100%' }}>
                            <TableContainer sx={{ maxHeight: '500px' }} className='table-container'>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='table-header-cell dark:table-header-cell' sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                                <div className='flex items-center gap-2'>
                                                    Category
                                                </div>
                                            </TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell' sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                                Slug
                                            </TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell' sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                                <div className='flex items-center gap-2'>
                                                    Products
                                                </div>
                                            </TableCell>
                                            <TableCell className='table-header-cell dark:table-header-cell !text-center' sx={{ position: 'sticky', top: 0, zIndex: 10 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedCategories.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className='table-body-cell dark:table-body-cell text-center py-8'>
                                                    <Typography variant='body2' className='text-muted-foreground'>
                                                        No categories found
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedCategories.map(category => (
                                                <TableRow key={category.id} hover>
                                                    <TableCell className='table-body-cell dark:table-body-cell'>
                                                        <div className='flex items-center gap-3'>
                                                            {category.image_url ? (
                                                                <img
                                                                    src={category.image_url}
                                                                    alt={category.name}
                                                                    className='w-10 h-10 rounded-lg object-cover flex-shrink-0'
                                                                />
                                                            ) : (
                                                                <div className='w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                                                                    <FolderOpen className='w-5 h-5 text-white' />
                                                                </div>
                                                            )}
                                                            <div className='min-w-0'>
                                                                <Typography variant='body2' className='font-medium text-foreground'>
                                                                    {category.name}
                                                                </Typography>
                                                                <Typography variant='caption' className='text-muted-foreground'>
                                                                    ID: {category.id}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='table-body-cell dark:table-body-cell'>
                                                        <Typography variant='body2' className='text-muted-foreground font-mono'>
                                                            {category.slug}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell className='table-body-cell dark:table-body-cell'>
                                                        <Typography variant='body2' className='font-semibold text-foreground'>
                                                            {category.products_count || 0}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell className='table-body-cell dark:table-body-cell'>
                                                        <div className='flex items-center justify-center gap-2'>
                                                            <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => handleEdit(category)}>
                                                                <Edit className='w-4 h-4' />
                                                            </Button>
                                                            <Button variant='ghost' size='icon' className='h-8 w-8 text-destructive' onClick={() => handleDelete(category.id)}>
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
                                count={filteredCategories.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10))
                                    setPage(0)
                                }}
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
                            />
                        </Paper>
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200'>
                            <div className='bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-200'>
                                <div className='p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10'>
                                    <div>
                                        <h2 className='text-xl font-bold text-foreground'>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                                        <p className='text-sm text-muted-foreground'>{editingCategory ? 'Update category information' : 'Create a new product category'}</p>
                                    </div>
                                    <Button variant='ghost' size='icon' onClick={handleCancel}>
                                        <X className='w-5 h-5' />
                                    </Button>
                                </div>

                                <div className='p-6 space-y-6'>
                                    {/* Category Name */}
                                    <div>
                                        <CustomTextField
                                            label='Category Name'
                                            placeholder='Enter category name'
                                            value={formData.name}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            onChange={e => {
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value
                                                })
                                                if (errors.name) setErrors({ ...errors, name: '' })
                                            }}
                                        />
                                    </div>
                                    {/* Category Image Error */}
                                    {errors.image && (
                                        <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                                            {errors.image}
                                        </div>
                                    )}

                                    {/* Category Image */}
                                    <div className='space-y-2'>
                                        <div>Category Image</div>

                                        {selectedImage ? (
                                            <div className='relative'>
                                                <div className='border-2 border-border rounded-lg p-4'>
                                                    <img src={selectedImage.url} alt='Category preview' className='w-full h-32 object-cover rounded-lg' />
                                                </div>
                                                <Button variant='destructive' size='small' onClick={handleRemoveImage} className='absolute top-2 right-2 h-8 w-8 p-0'>
                                                    <X className='w-4 h-4' />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className='border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-emerald-500/50 transition-colors'>
                                                <div className='flex flex-col items-center gap-3'>
                                                    <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                                                        <Upload className='w-8 h-8 text-muted-foreground' />
                                                    </div>
                                                    <div>
                                                        <p className='text-sm font-medium text-foreground'>Upload category image</p>
                                                        <p className='text-xs text-muted-foreground'>PNG, JPG, WEBP, ICO up to 5MB</p>
                                                    </div>
                                                    <Button variant='outline' size='sm' className='gap-2 bg-transparent' onClick={handleFileSelect}>
                                                        <ImageIcon className='w-4 h-4' />
                                                        Choose File
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <input
                                            id='category-image-upload'
                                            type='file'
                                            accept='image/jpeg,image/jpg,image/png,image/webp,image/ico'
                                            className='hidden'
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>

                                <div className='p-6 border-t border-border flex flex-col flex-col-reverse md:flex-row gap-3 justify-end'>
                                    <Button
                                        variant='outline'
                                        onClick={handleCancel}
                                        // size='md'
                                        sx={{
                                            color: '#9CA3AF',
                                            borderColor: '#374151',
                                            '&:hover': {
                                                bgcolor: 'rgba(55, 65, 81, 0.3)',
                                                borderColor: '#6B7280'
                                            }
                                        }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        variant='outlined'
                                        size='md'
                                        startIcon={<Save className='w-4 h-4' />}>
                                        {editingCategory ? 'Update Category' : 'Create Category'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
