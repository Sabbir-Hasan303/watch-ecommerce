import React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Edit, Trash2, FolderOpen, Save, X, ImageIcon, Upload, ArrowUpDown } from 'lucide-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Button, InputAdornment } from '@mui/material'
import { Search } from '@mui/icons-material'
import Badge from '@mui/material/Badge'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and accessories',
      productCount: 45,
      status: 'active'
    },
    {
      id: '2',
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing, shoes, and accessories',
      productCount: 128,
      status: 'active'
    },
    {
      id: '3',
      name: 'Sports',
      slug: 'sports',
      description: 'Sports equipment and fitness gear',
      productCount: 67,
      status: 'active'
    },
    {
      id: '4',
      name: 'Furniture',
      slug: 'furniture',
      description: 'Home and office furniture',
      productCount: 34,
      status: 'active'
    },
    {
      id: '5',
      name: 'Books',
      slug: 'books',
      description: 'Books and educational materials',
      productCount: 89,
      status: 'inactive'
    }
  ])

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    status: 'active'
  })

  const handleEdit = category => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image || '',
      status: category.status
    })
    setShowModal(true)
  }

  const handleDelete = id => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id))
    }
  }

  const handleSubmit = () => {
    if (editingCategory) {
      // Update existing category
      setCategories(
        categories.map(cat =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                image: formData.image,
                status: formData.status
              }
            : cat
        )
      )
    } else {
      // Create new category
      const newCategory = {
        id: Date.now().toString(),
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: formData.image,
        productCount: 0,
        status: formData.status
      }
      setCategories([...categories, newCategory])
    }

    // Reset form
    setShowModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      status: 'active'
    })
  }

  const handleCancel = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
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
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>Description</th>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>
                      <div className='flex items-center gap-2'>
                        Products
                        <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
                      </div>
                    </th>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>Status</th>
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
                        <p className='text-sm text-foreground line-clamp-2 max-w-md'>{category.description}</p>
                      </td>
                      <td className='p-4'>
                        <span className='text-sm font-semibold text-foreground'>{category.productCount}</span>
                      </td>
                      <td className='p-4'>
                        <Badge
                          className={cn(
                            'text-xs',
                            category.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-1 rounded-lg'
                              : 'bg-gray-500/10 text-gray-400 border-gray-500/20 px-2 py-1 rounded-lg'
                          )}>
                          {category.status}
                        </Badge>
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
              {/* Category Image */}
              <div className='space-y-2'>
                <div>Category Image</div>
                <div className='border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-emerald-500/50 transition-colors'>
                  <div className='flex flex-col items-center gap-3'>
                    <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                      <Upload className='w-8 h-8 text-muted-foreground' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-foreground'>Upload category image</p>
                      <p className='text-xs text-muted-foreground'>PNG, JPG up to 5MB</p>
                    </div>
                    <Button variant='outline' size='sm' className='gap-2 bg-transparent'>
                      <ImageIcon className='w-4 h-4' />
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Name */}
              <div className='space-y-2'>
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

              {/* Slug */}
              <div className='space-y-2'>
                <CustomTextField
                  label='Slug'
                  placeholder='Enter category slug'
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className='font-mono'
                />
                <CustomTextField
                  placeholder='category-slug'
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className='font-mono'
                />
                <p className='text-xs text-muted-foreground'>URL-friendly version of the name</p>
              </div>

              {/* Description */}
              <div className='space-y-2'>
                <CustomTextField
                  label='Description'
                  placeholder='Enter category description'
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className='resize-none'
                />
                <CustomTextField
                  placeholder='Enter category description'
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className='resize-none'
                />
              </div>

              {/* Status */}
              <div className='space-y-2'>
                <CustomSelectField
                  label='Status'
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' }
                  ]}
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                />
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    type='button'
                    onClick={() => setFormData({ ...formData, status: 'active' })}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                      formData.status === 'active' ? 'border-emerald-500 bg-emerald-500/10' : 'border-border hover:border-emerald-500/50'
                    )}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                          formData.status === 'active' ? 'border-emerald-500' : 'border-muted-foreground'
                        )}>
                        {formData.status === 'active' && <div className='w-2 h-2 rounded-full bg-emerald-500' />}
                      </div>
                      <div>
                        <p className='font-medium text-foreground'>Active</p>
                        <p className='text-xs text-muted-foreground'>Category is visible</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type='button'
                    onClick={() => setFormData({ ...formData, status: 'inactive' })}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                      formData.status === 'inactive' ? 'border-gray-500 bg-gray-500/10' : 'border-border hover:border-gray-500/50'
                    )}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                          formData.status === 'inactive' ? 'border-gray-500' : 'border-muted-foreground'
                        )}>
                        {formData.status === 'inactive' && <div className='w-2 h-2 rounded-full bg-gray-500' />}
                      </div>
                      <div>
                        <p className='font-medium text-foreground'>Inactive</p>
                        <p className='text-xs text-muted-foreground'>Category is hidden</p>
                      </div>
                    </div>
                  </button>
                </div>
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
                variant='contained'
                size='md'
                className='!bg-text-primary !text-primary-foreground'
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
