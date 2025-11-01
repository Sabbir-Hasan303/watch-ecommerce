import React from 'react'
import { useState } from 'react'
import { Plus, Edit, Trash2, FolderOpen, Save, X, ImageIcon, Upload, ArrowUpDown } from 'lucide-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Button, InputAdornment } from '@mui/material'
import { Search } from '@mui/icons-material'
import CustomTextField from '@/Components/CustomTextField'
import { router } from '@inertiajs/react'

export default function Categories({ categories = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    status: 'active'
  })

  const [selectedImage, setSelectedImage] = useState(null)

  const handleEdit = category => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image_url || '',
      status: 'active' // Default status since we removed it from the form
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
    const formDataToSubmit = new FormData()
    formDataToSubmit.append('name', formData.name)
    formDataToSubmit.append('slug', formData.slug)

    if (selectedImage && selectedImage.file) {
      formDataToSubmit.append('image', selectedImage.file)
    }

    if (editingCategory) {
      // Update existing category
      router.post(
        route('admin.products.categories.update', editingCategory.id),
        {
          _method: 'PUT',
          name: formData.name,
          slug: formData.slug,
          image: selectedImage && selectedImage.file ? selectedImage.file : null
        },
        {
          forceFormData: true,
          onSuccess: () => {
            handleCancel()
          }
        }
      )
    } else {
      // Create new category
      router.post(
        route('admin.products.categories.store'),
        {
          name: formData.name,
          slug: formData.slug,
          image: selectedImage && selectedImage.file ? selectedImage.file : null
        },
        {
          forceFormData: true,
          onSuccess: () => {
            handleCancel()
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
    setFormData({
      name: '',
      slug: '',
      image: '',
      status: 'active'
    })
  }

  const generateSlug = name => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleImageUpload = event => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/ico']
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, or ICO)')
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
      {/* Content */}
      <div className='py-4'>
        <div className='space-y-6'>
          <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Product Categories</h2>
          {/* Search and Add */}
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
            <div className='relative flex-1 max-w-md'>
              {/* <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' /> */}
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
            </div>

            <Button onClick={() => setShowModal(true)} variant='primary' size='md' startIcon={<Plus className='w-4 h-4' />}>
              Add Category
            </Button>
          </div>

          <div className='bg-card border border-border rounded-xl overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-muted/50 border-b border-border'>
                  <tr>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>
                      <div className='flex items-center gap-2'>
                        Category
                        <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
                      </div>
                    </th>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>Slug</th>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>
                      <div className='flex items-center gap-2'>
                        Products
                        <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
                      </div>
                    </th>
                    <th className='text-right p-4 text-sm font-semibold text-foreground'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {categories.map(category => (
                    <tr key={category.id} className='hover:bg-muted/30 transition-colors group'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                            <FolderOpen className='w-5 h-5 text-white' />
                          </div>
                          <div className='min-w-0'>
                            <p className='font-medium text-foreground'>{category.name}</p>
                            <p className='text-sm text-muted-foreground'>ID: {category.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className='p-4'>
                        <span className='text-sm font-mono text-muted-foreground'>{category.slug}</span>
                      </td>
                      <td className='p-4'>
                        <span className='text-sm font-semibold text-foreground'>{category.products_count || 0}</span>
                      </td>
                      <td className='p-4'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => handleEdit(category)}>
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon' className='h-8 w-8 text-destructive' onClick={() => handleDelete(category.id)}>
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {categories.length === 0 && (
            <div className='text-center py-12'>
              <FolderOpen className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>No categories found</h3>
              <p className='text-sm text-muted-foreground'>Try adjusting your search or create a new category</p>
            </div>
          )}
        </div>
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
              <div className=''>
                <div>
                  <CustomTextField
                    label='Category Name'
                    placeholder='Enter category name'
                    value={formData.name}
                    onChange={e => {
                      const name = e.target.value
                      setFormData({
                        ...formData,
                        name,
                        slug: generateSlug(name)
                      })
                    }}
                  />
                </div>

                <div className='mt-6'>
                  <CustomTextField
                    label='Slug'
                    placeholder='Enter category slug'
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>
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
                        <p className='text-xs text-muted-foreground'>PNG, JPG, ICO up to 5MB</p>
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
                  accept='image/jpeg,image/jpg,image/png,image/ico'
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
    </AuthenticatedLayout>
  )
}
