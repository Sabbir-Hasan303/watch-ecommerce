import React from 'react'
import { cn } from '@/lib/utils'
import { Badge, Button } from '@mui/material'
import { ArrowLeft, Upload, X, Save, ImageIcon, Trash2, Package } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { useState } from 'react'
import CustomTextField from '@/Components/CustomTextField'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function ProductForm() {
  const [images, setImages] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    comparePrice: '',
    costPerItem: '',
    sku: '',
    barcode: '',
    stock: '',
    weight: '',
    status: 'draft'
  })

  const handleImageUpload = files => {
    if (!files) return

    const newImages = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file
    }))

    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = id => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const handleDrag = e => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AuthenticatedLayout>
      <div className='py-4'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
          <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Create Product</h2>
          {/* Back button bar */}
          <div className=''>
            <Link href='/products'>
              <Button variant='ghost' size='sm' className='gap-2 text-gray-400 hover:text-white'>
                <ArrowLeft className='w-4 h-4' />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-auto'>
          <div className='max-w-5xl mx-auto space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Form - Left Column */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Basic Information */}
                <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                  <h2 className='text-lg font-semibold text-foreground'>Basic Information</h2>

                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <CustomTextField
                        id='name'
                        label='Product Name'
                        placeholder='Enter product name'
                        value={formData.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                      />
                    </div>

                    <div className='space-y-2'>
                      <CustomTextField
                        id='description'
                        label='Description'
                        placeholder='Enter product description'
                        multiline
                        rows={5}
                        value={formData.description}
                        onChange={e => handleInputChange('description', e.target.value)}
                      />
                    </div>

                    <div className='space-y-2'>
                      <CustomTextField
                        id='category'
                        label='Category'
                        placeholder='Enter category'
                        value={formData.category}
                        onChange={e => handleInputChange('category', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                  <h2 className='text-lg font-semibold text-foreground'>Product Images</h2>

                  <div
                    className={cn(
                      'border-2 border-dashed rounded-xl p-8 transition-all duration-200',
                      dragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-border hover:border-emerald-500/50 hover:bg-muted/50'
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}>
                    <div className='flex flex-col items-center justify-center gap-4 text-center'>
                      <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                        <Upload className='w-8 h-8 text-muted-foreground' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-foreground mb-1'>Drag and drop images here, or click to browse</p>
                        <p className='text-xs text-muted-foreground'>PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <Button type='button' variant='outline' onClick={() => document.getElementById('file-upload')?.click()} className='gap-2'>
                        <ImageIcon className='w-4 h-4' />
                        Choose Files
                      </Button>
                      <input
                        id='file-upload'
                        type='file'
                        multiple
                        accept='image/*'
                        className='hidden'
                        onChange={e => handleImageUpload(e.target.files)}
                      />
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                      {images.map((image, index) => (
                        <div key={image.id} className='relative group'>
                          <img
                            src={image.url || '/placeholder.svg'}
                            alt={`Product ${index + 1}`}
                            className='w-full h-32 object-cover rounded-lg border border-border'
                          />
                          {index === 0 && <Badge className='absolute top-2 left-2 bg-emerald-500 text-white'>Primary</Badge>}
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity'
                            onClick={() => removeImage(image.id)}>
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                  <h2 className='text-lg font-semibold text-foreground'>Pricing</h2>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <CustomTextField
                        id='price'
                        label='Price'
                        type='number'
                        placeholder='0.00'
                        value={formData.price}
                        onChange={e => handleInputChange('price', e.target.value)}
                        InputProps={{
                          startAdornment: <span className='text-muted-foreground mr-2'>$</span>
                        }}
                      />
                    </div>

                    <div className='space-y-2'>
                      <CustomTextField
                        id='comparePrice'
                        label='Compare at Price'
                        type='number'
                        placeholder='0.00'
                        value={formData.comparePrice}
                        onChange={e => handleInputChange('comparePrice', e.target.value)}
                        InputProps={{
                          startAdornment: <span className='text-muted-foreground mr-2'>$</span>
                        }}
                      />
                    </div>

                    <div className='space-y-2'>
                      <CustomTextField
                        id='costPerItem'
                        label='Cost per Item'
                        type='number'
                        placeholder='0.00'
                        value={formData.costPerItem}
                        onChange={e => handleInputChange('costPerItem', e.target.value)}
                        InputProps={{
                          startAdornment: <span className='text-muted-foreground mr-2'>$</span>
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                  <h2 className='text-lg font-semibold text-foreground'>Inventory</h2>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <CustomTextField
                        id='sku'
                        label='SKU'
                        placeholder='Enter SKU'
                        value={formData.sku}
                        onChange={e => handleInputChange('sku', e.target.value)}
                      />
                    </div>

                    <div className='space-y-2'>
                      <CustomTextField
                        id='barcode'
                        label='Barcode'
                        placeholder='Enter barcode'
                        value={formData.barcode}
                        onChange={e => handleInputChange('barcode', e.target.value)}
                      />
                    </div>

                    <div className='space-y-2'>
                      <CustomTextField
                        id='stock'
                        label='Stock Quantity'
                        type='number'
                        placeholder='0'
                        value={formData.stock}
                        onChange={e => handleInputChange('stock', e.target.value)}
                      />
                    </div>

                    <div className='space-y-2'>
                      <CustomTextField
                        id='weight'
                        label='Weight (kg)'
                        type='number'
                        placeholder='0.0'
                        value={formData.weight}
                        onChange={e => handleInputChange('weight', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Variants - Only available after product creation */}
                <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h2 className='text-lg font-semibold text-foreground'>Product Variants</h2>
                      <p className='text-sm text-muted-foreground'>Manage sizes, colors, and other variations</p>
                    </div>
                    <Button disabled className='gap-2 bg-gray-500 cursor-not-allowed'>
                      <Package className='w-4 h-4' />
                      Manage Variants
                    </Button>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Product variants can be managed after the product is created. You'll be able to add different options like sizes, colors, or
                    materials for this product. Each variant can have its own SKU, price, and stock level.
                  </p>
                </div>
              </div>

              {/* Right Column - Status & Actions */}
              <div className='space-y-6'>
                {/* Status */}
                <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                  <h2 className='text-lg font-semibold text-text-primary'>Status</h2>

                  <div className='space-y-3'>
                    <button
                      type='button'
                      onClick={() => handleInputChange('status', 'active')}
                      className={cn(
                        'w-full p-4 rounded-lg border-2 transition-all duration-200 text-left',
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
                          <p className='font-medium text-text-primary'>Active</p>
                          <p className='text-xs text-muted-foreground'>Product is live and visible</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type='button'
                      onClick={() => handleInputChange('status', 'draft')}
                      className={cn(
                        'w-full p-4 rounded-lg border-2 transition-all duration-200 text-left',
                        formData.status === 'draft' ? 'border-amber-500 bg-amber-500/10' : 'border-border hover:border-amber-500/50'
                      )}>
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                            formData.status === 'draft' ? 'border-amber-500' : 'border-muted-foreground'
                          )}>
                          {formData.status === 'draft' && <div className='w-2 h-2 rounded-full bg-amber-500' />}
                        </div>
                        <div>
                          <p className='font-medium text-text-primary'>Draft</p>
                          <p className='text-xs text-muted-foreground'>Product is hidden</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type='button'
                      onClick={() => handleInputChange('status', 'archived')}
                      className={cn(
                        'w-full p-4 rounded-lg border-2 transition-all duration-200 text-left',
                        formData.status === 'archived' ? 'border-gray-500 bg-gray-500/10' : 'border-border hover:border-gray-500/50'
                      )}>
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                            formData.status === 'archived' ? 'border-gray-500' : 'border-muted-foreground'
                          )}>
                          {formData.status === 'archived' && <div className='w-2 h-2 rounded-full bg-gray-500' />}
                        </div>
                        <div>
                          <p className='font-medium text-foreground'>Archived</p>
                          <p className='text-xs text-muted-foreground'>Product is archived</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className='bg-card border border-border rounded-xl p-6 space-y-3'>
                  <Button
                    className='w-full gap-2 !bg-black dark:!bg-white !text-white dark:!text-black'
                    variant='primary'
                    size='md'
                    startIcon={<Save className='w-4 h-4' />}>
                    Create Product
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
