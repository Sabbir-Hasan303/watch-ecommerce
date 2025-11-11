import { React, useState } from 'react'
import {
    Card,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Box,
    FormControl,
    InputAdornment
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { Plus, Edit, Trash2, Eye, EyeOff, ImageIcon, X, Upload } from 'lucide-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'
import { useThemeContext } from '@/contexts/ThemeContext'
import { router } from '@inertiajs/react'

export default function BannerList({ banners = [] }) {

    const [searchQuery, setSearchQuery] = useState('')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newBanner, setNewBanner] = useState({
        status: true,
        position: 'Homepage Hero'
    })
    const [editingBanner, setEditingBanner] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [errors, setErrors] = useState({})

    const { isDark } = useThemeContext()

    const filteredBanners = banners.filter(banner => banner.title.toLowerCase().includes(searchQuery.toLowerCase()))

    const resetDialogState = () => {
        if (selectedImage && selectedImage.file && selectedImage.url) {
            URL.revokeObjectURL(selectedImage.url)
        }
        setSelectedImage(null)
        setNewBanner({ status: true, position: 'Homepage Hero' })
        setEditingBanner(null)
        setErrors({})
    }

    const handleAddBanner = () => {
        setErrors({})

        router.post(
            route('admin.contents.banners.store'),
            {
                title: newBanner.title,
                position: newBanner.position,
                status: newBanner.status,
                image: selectedImage && selectedImage.file ? selectedImage.file : null
            },
            {
                forceFormData: true,
                onSuccess: () => {
                    resetDialogState()
                    setIsAddDialogOpen(false)
                },
                onError: (errors) => {
                    setErrors(errors)
                }
            }
        )
    }

    const handleDeleteBanner = id => {
        router.delete(route('admin.contents.banners.destroy', id), {
            onSuccess: () => {
                setConfirmDeleteId(null)
            }
        })
    }

    const toggleStatus = id => {
        router.post(route('admin.contents.banners.toggle-status', id))
    }

    const handleEditOpen = banner => {
        setEditingBanner(banner)
        setNewBanner({
            title: banner.title,
            position: banner.position,
            status: banner.status
        })
        if (banner.image_url) {
            setSelectedImage({ file: null, url: banner.image_url })
        } else {
            setSelectedImage(null)
        }
        setIsAddDialogOpen(true)
    }

    const handleSaveEdit = () => {
        if (!editingBanner) return
        setErrors({})

        router.post(
            route('admin.contents.banners.update', editingBanner.id),
            {
                _method: 'PUT',
                title: newBanner.title,
                position: newBanner.position,
                status: newBanner.status,
                image: selectedImage && selectedImage.file ? selectedImage.file : null
            },
            {
                forceFormData: true,
                onSuccess: () => {
                    resetDialogState()
                    setIsAddDialogOpen(false)
                },
                onError: (errors) => {
                    setErrors(errors)
                }
            }
        )
    }

    const handleFileSelect = () => {
        document.getElementById('banner-image-upload')?.click()
    }

    const handleImageUpload = event => {
        const file = event.target.files?.[0]
        if (!file) return
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image (JPG, PNG, WEBP)')
            return
        }
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            alert('File size must be less than 5MB')
            return
        }
        const previewUrl = URL.createObjectURL(file)
        if (selectedImage && selectedImage.file && selectedImage.url) {
            URL.revokeObjectURL(selectedImage.url)
        }
        setSelectedImage({ file, url: previewUrl })
    }

    const handleRemoveImage = () => {
        if (selectedImage && selectedImage.file && selectedImage.url) {
            URL.revokeObjectURL(selectedImage.url)
        }
        setSelectedImage(null)
    }

    return (
        <AuthenticatedLayout>
            <div className='py-4'>
                <div className='space-y-6'>
                    <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                        <div>
                            <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Banners</h2>
                            <p className='text-sm text-text-secondary mt-1'>Upload and manage simple banner placements</p>
                        </div>
                        <div>
                            <Button variant='outlined' onClick={() => setIsAddDialogOpen(true)}>
                                <Plus className='w-4 h-4 mr-2' />
                                Add Banner
                            </Button>
                        </div>
                    </div>

                    <FormControl size='small' sx={{ minWidth: 200 }}>
                        <CustomTextField
                            placeholder='Search banners...'
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

                    <div>
                        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                            {filteredBanners.map(banner => (
                                <Card key={banner.id} className='bg-[#1C252E] border-white/10 overflow-hidden'>
                                    <div className='relative h-32 bg-gradient-to-r from-gray-800 to-gray-700'>
                                        {banner.image_url ? (
                                            <img src={banner.image_url} alt={banner.title} className='w-full h-full object-cover opacity-90' />
                                        ) : null}
                                        <div className='absolute top-3 right-3 flex gap-2'>
                                            <Button size='small' variant='contained' className='!bg-white !text-black' onClick={() => toggleStatus(banner.id)}>
                                                {banner.status ? <Eye className='w-4 h-4' /> : <EyeOff className='w-4 h-4' />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='p-4'>
                                        <div className='flex items-start justify-between mb-3'>
                                            <div className='flex-1'>
                                                <h3 className='text-lg font-semibold text-text-primary mb-1'>{banner.title}</h3>
                                                <p className='text-sm text-text-secondary'>{banner.position}</p>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${banner.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                {banner.status ? 'active' : 'inactive'}
                                            </span>
                                        </div>
                                        <div className='space-y-2 mb-4' />
                                        <div className='flex gap-2'>
                                            <Button
                                                variant='outlined'
                                                size='small'
                                                startIcon={<Edit className='w-4 h-4' />}
                                                onClick={() => handleEditOpen(banner)}
                                                sx={{
                                                    flex: 1,
                                                    borderColor: '#374151',
                                                    color: isDark ? '#9CA3AF' : '#1c252e',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(55, 65, 81, 0.3)',
                                                        borderColor: '#6B7280'
                                                    }
                                                }}>
                                                Edit
                                            </Button>
                                            <Button
                                                variant='outlined'
                                                size='small'
                                                onClick={() => setConfirmDeleteId(banner.id)}
                                                sx={{
                                                    borderColor: 'rgba(239, 68, 68, 0.2)',
                                                    color: '#EF4444',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                        borderColor: '#EF4444'
                                                    }
                                                }}>
                                                <Trash2 className='w-4 h-4' />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {filteredBanners.length === 0 && (
                            <div className='flex flex-col items-center justify-center py-12'>
                                <ImageIcon className='w-16 h-16 text-text-secondary mb-4' />
                                <h3 className='text-lg font-semibold text-text-secondary mb-2'>No banners found</h3>
                                <p className='text-sm text-text-secondary'>
                                    {searchQuery ? 'Try adjusting your search' : 'Add your first banner to get started'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Banner Dialog */}
            <Dialog
                open={isAddDialogOpen}
                onClose={() => {
                    setIsAddDialogOpen(false)
                    resetDialogState()
                }}
                maxWidth='md'
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1C252E',
                        border: '1px solid #374151'
                    }
                }}>
                <DialogTitle className='text-text-primary font-medium'>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#9CA3AF', mb: 2 }}>
                        Create a new banner. Only Homepage Hero position is available for now.
                    </DialogContentText>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <CustomTextField
                            label='Banner Name'
                            placeholder='Enter banner name'
                            value={newBanner.title || ''}
                            onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                            error={!!errors.title}
                            helperText={errors.title}
                            fullWidth
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <CustomSelectField
                                label='Position'
                                value={newBanner.position}
                                onChange={e => setNewBanner({ ...newBanner, position: e.target.value })}
                                options={[
                                    { value: 'Homepage Hero', label: 'Homepage Hero' },
                                    { value: 'Category Page', label: 'Category Page', disabled: true },
                                    { value: 'Product Page', label: 'Product Page', disabled: true },
                                    { value: 'Sidebar', label: 'Sidebar', disabled: true }
                                ]}
                            />
                            <CustomSelectField
                                label='Status'
                                value={newBanner.status}
                                onChange={e => setNewBanner({ ...newBanner, status: e.target.value === 'true' || e.target.value === true })}
                                options={[
                                    { value: true, label: 'Active' },
                                    { value: false, label: 'Inactive' }
                                ]}
                            />
                        </Box>
                        {errors.image && (
                            <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                                {errors.image}
                            </div>
                        )}
                        <div className='space-y-2'>
                            <div>Banner Image <span className='text-red-500'>*</span></div>
                            {selectedImage ? (
                                <div className='relative'>
                                    <div className='border-2 border-[#374151] rounded-lg p-4'>
                                        <img src={selectedImage.url} alt='Banner preview' className='w-full h-32 object-cover rounded-lg' />
                                    </div>
                                    <Button variant='contained' size='small' onClick={handleRemoveImage} className='!absolute !top-2 !right-2 !h-8 !w-8 !min-w-0 !p-0 !bg-red-600'>
                                        <X className='w-4 h-4' />
                                    </Button>
                                </div>
                            ) : (
                                <div className='border-2 border-dashed border-[#374151] rounded-lg p-8 text-center hover:border-emerald-500/50 transition-colors'>
                                    <div className='flex flex-col items-center gap-3'>
                                        <div className='w-16 h-16 bg-[#2a3440] rounded-full flex items-center justify-center'>
                                            <Upload className='w-8 h-8 text-[#9CA3AF]' />
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium text-text-primary'>Upload banner image (Required)</p>
                                            <p className='text-xs text-text-secondary'>PNG, JPG, WEBP up to 5MB</p>
                                        </div>
                                        <Button variant='outlined' size='small' className='gap-2' onClick={handleFileSelect}>
                                            <ImageIcon className='w-4 h-4' />
                                            Choose File
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <input
                                id='banner-image-upload'
                                type='file'
                                accept='image/jpeg,image/jpg,image/png,image/webp'
                                className='hidden'
                                onChange={handleImageUpload}
                            />
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            setIsAddDialogOpen(false)
                            resetDialogState()
                        }}
                        sx={{
                            //   color: '#9CA3AF',
                            color: isDark ? '#9CA3AF' : '#1c252e',
                            borderColor: '#374151',
                            '&:hover': {
                                bgcolor: 'rgba(55, 65, 81, 0.3)',
                                borderColor: '#6B7280'
                            }
                        }}>
                        Cancel
                    </Button>
                    {editingBanner ? (
                        <Button variant='outlined' onClick={handleSaveEdit}>
                            Save Changes
                        </Button>
                    ) : (
                        <Button variant='outlined' onClick={handleAddBanner}>
                            Add Banner
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
            {confirmDeleteId && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
                    <div className='bg-background border border-[#374151] rounded-xl max-w-md w-full overflow-hidden'>
                        <div className='p-6 flex items-center justify-between'>
                            <div>
                                <h2 className='text-xl font-bold text-text-primary'>Delete Banner</h2>
                                <p className='text-sm text-text-secondary'>Are you sure you want to delete this banner?</p>
                            </div>
                        </div>
                        <div className='p-6 flex flex-col md:flex-row gap-3 justify-end'>
                            <Button
                                variant='outlined'
                                onClick={() => setConfirmDeleteId(null)}
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
                                variant='outlined'
                                onClick={() => handleDeleteBanner(confirmDeleteId)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    )
}
