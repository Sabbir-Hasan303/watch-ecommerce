import React, { useState, useCallback } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { Badge, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { ArrowLeft, Upload, X, Save, ImageIcon, Trash2, Plus, Edit } from 'lucide-react'
import { useThemeContext } from '@/contexts/ThemeContext'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'
import CustomMultiSelect from '@/Components/CustomMultiSelect'
// Constants
const STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Draft', value: 'draft' }
]

const MODEL_FEATURE_CATEGORIES = [
    { label: 'Primary Features', value: 'primary' },
    { label: 'Additional Features', value: 'additional' }
]

const INITIAL_FEATURE_FORM = {
    name: '',
    type: '',
    icon: ''
}

const INITIAL_SPEC_FORM = {
    key: '',
    value: ''
}

const INITIAL_MODEL_FEATURE_FORM = {
    name: '',
    category: ''
}

const INITIAL_VARIANT_FORM = {
    title: '',
    sku: '',
    size: '',
    color: '',
    material: '',
    image: null,
    price: '',
    compare_at_price: '',
    quantity: '',
    status: 'active'
}

// Utility functions
let idCounter = 0
const generateId = () => ++idCounter


// Custom hooks
const useFormState = initialState => {
    const [state, setState] = useState(initialState)
    const updateField = useCallback((field, value) => {
        setState(prev => ({ ...prev, [field]: value }))
    }, [])

    const resetForm = useCallback(() => {
        setState(initialState)
    }, [initialState])

    return [state, setState, updateField, resetForm]
}

// Components
const StatusSelector = ({ status, onStatusChange }) => (
    <div className='space-y-3'>
        {STATUS_OPTIONS.map(option => (
            <button
                key={option.value}
                type='button'
                onClick={() => onStatusChange(option.value)}
                className={cn(
                    'w-full p-4 rounded-lg border-2 transition-all duration-200 text-left',
                    status === option.value
                        ? `border-${option.value === 'active' ? 'emerald' : 'amber'}-500 bg-${option.value === 'active' ? 'emerald' : 'amber'}-500/10`
                        : 'border-border hover:border-emerald-500/50'
                )}>
                <div className='flex items-center gap-3'>
                    <div
                        className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                            status === option.value ? `border-${option.value === 'active' ? 'emerald' : 'amber'}-500` : 'border-muted-foreground'
                        )}>
                        {status === option.value && <div className={`w-2 h-2 rounded-full bg-${option.value === 'active' ? 'emerald' : 'amber'}-500`} />}
                    </div>
                    <div>
                        <p className='font-medium text-text-primary capitalize'>{option.label}</p>
                        <p className='text-xs text-muted-foreground'>{option.value === 'active' ? 'Product is live and visible' : 'Product is hidden'}</p>
                    </div>
                </div>
            </button>
        ))}
    </div>
)

const ImageUploadArea = ({ dragActive, onDrag, onDrop, onFileSelect }) => (
    <div
        className={cn(
            'border-2 border-dashed rounded-xl p-8 transition-all duration-200',
            dragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-border hover:border-emerald-500/50 hover:bg-muted/50'
        )}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}>
        <div className='flex flex-col items-center justify-center gap-4 text-center'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                <Upload className='w-8 h-8 text-muted-foreground' />
            </div>
            <div>
                <p className='text-sm font-medium text-foreground mb-1'>Drag and drop images here, or click to browse</p>
                <p className='text-xs text-muted-foreground'>PNG, JPG, GIF up to 10MB</p>
            </div>
            <Button type='button' variant='outline' onClick={() => onFileSelect()} className='gap-2'>
                <ImageIcon className='w-4 h-4' />
                Choose Files
            </Button>
            <input id='file-upload' type='file' multiple accept='image/*' className='hidden' onChange={e => onFileSelect(e.target.files)} />
        </div>
    </div>
)


const FeatureItem = ({ feature, onRemove }) => (
    <div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border'>
        <div>
            <p className='font-medium text-foreground'>{feature.name}</p>
            <p className='text-sm text-muted-foreground'>{feature.type}</p>
            {feature.icon && <p className='text-xs text-muted-foreground'>Icon: {feature.icon}</p>}
        </div>
        <Button size='small' variant='destructive' onClick={() => onRemove(feature.id)} className='h-8 w-8 p-0'>
            <X className='w-3 h-3' />
        </Button>
    </div>
)

const SpecItem = ({ spec, onRemove }) => (
    <div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border'>
        <div className='flex items-center gap-4'>
            <span className='font-medium text-foreground min-w-[120px]'>{spec.key}:</span>
            <span className='text-foreground'>{spec.value}</span>
        </div>
        <Button size='small' variant='destructive' onClick={() => onRemove(spec.id)} className='h-8 w-8 p-0'>
            <X className='w-3 h-3' />
        </Button>
    </div>
)

const ModelFeatureItem = ({ feature, onRemove }) => (
    <div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border'>
        <span className='text-foreground'>{feature.name}</span>
        <Button size='small' variant='destructive' onClick={() => onRemove(feature.id)} className='h-8 w-8 p-0'>
            <X className='w-3 h-3' />
        </Button>
    </div>
)


const VariantTable = ({ variants, onEdit, onRemove }) => (
    <TableContainer component={Paper} className='bg-card border border-border'>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Compare Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {variants.map(variant => (
                    <TableRow key={variant.id}>
                        <TableCell>
                            {variant.image ? (
                                <img src={URL.createObjectURL(variant.image)} alt={variant.title} className='w-12 h-12 object-cover rounded border' />
                            ) : (
                                <div className='w-12 h-12 bg-muted rounded border flex items-center justify-center'>
                                    <ImageIcon className='w-4 h-4 text-muted-foreground' />
                                </div>
                            )}
                        </TableCell>
                        <TableCell>{variant.title}</TableCell>
                        <TableCell>{variant.sku}</TableCell>
                        <TableCell>{variant.size || '-'}</TableCell>
                        <TableCell>{variant.color || '-'}</TableCell>
                        <TableCell>{variant.material || '-'}</TableCell>
                        <TableCell>${variant.price}</TableCell>
                        <TableCell>{variant.compare_at_price ? `$${variant.compare_at_price}` : '-'}</TableCell>
                        <TableCell>{variant.quantity}</TableCell>
                        <TableCell>
                            <Badge className={cn('text-xs', variant.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500')}>{variant.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className='flex gap-1'>
                                <Button size='small' variant='outline' onClick={() => onEdit(variant)} className='h-8 w-8 p-0'>
                                    <Edit className='w-3 h-3' />
                                </Button>
                                <Button size='small' variant='destructive' onClick={() => onRemove(variant.id)} className='h-8 w-8 p-0'>
                                    <Trash2 className='w-3 h-3' />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
)

function ProductCreateFields({ categories }) {
    const { isDark } = useThemeContext()

    // Main form state using Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        short_description: '',
        categories: [],
        sku: '',
        status: 'draft',
        features: [],
        technical_specs: [],
        model_features: [],
        variants: [],
        images: []
    })

    // Feature forms
    const [featureForm, setFeatureForm] = useFormState(INITIAL_FEATURE_FORM)
    const [specForm, setSpecForm] = useFormState(INITIAL_SPEC_FORM)
    const [modelFeatureForm, setModelFeatureForm] = useFormState(INITIAL_MODEL_FEATURE_FORM)

    // Variant state
    const [showVariantForm, setShowVariantForm] = useState(false)
    const [variantForm, setVariantForm] = useFormState(INITIAL_VARIANT_FORM)

    // Image upload state
    const [dragActive, setDragActive] = useState(false)

    // Handle image upload for product images
    const handleImageUpload = useCallback(
        files => {
            if (!files) return
            const newImages = Array.from(files)
            setData('images', [...data.images, ...newImages])
        },
        [data.images, setData]
    )

    const removeImage = useCallback(
        index => {
            const newImages = data.images.filter((_, i) => i !== index)
            setData('images', newImages)
        },
        [data.images, setData]
    )

    // Drag and drop handlers
    const handleDrag = useCallback(e => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback(
        e => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleImageUpload(e.dataTransfer.files)
            }
        },
        [handleImageUpload]
    )

    // Feature handlers
    const addFeature = useCallback(() => {
        if (!featureForm.name || !featureForm.type) {
            alert('Please fill in feature name and type')
            return
        }

        const newFeature = {
            id: generateId(),
            name: featureForm.name,
            type: featureForm.type,
            icon: featureForm.icon
        }

        setData('features', [...data.features, newFeature])
        setFeatureForm(INITIAL_FEATURE_FORM)
    }, [featureForm, data.features, setData, setFeatureForm])

    const removeFeature = useCallback(
        id => {
            setData(
                'features',
                data.features.filter(feature => feature.id !== id)
            )
        },
        [data.features, setData]
    )

    // Technical specs handlers
    const addTechnicalSpec = useCallback(() => {
        if (!specForm.key || !specForm.value) {
            alert('Please fill in both key and value')
            return
        }

        const newSpec = {
            id: generateId(),
            key: specForm.key,
            value: specForm.value
        }

        setData('technical_specs', [...data.technical_specs, newSpec])
        setSpecForm(INITIAL_SPEC_FORM)
    }, [specForm, data.technical_specs, setData, setSpecForm])

    const removeTechnicalSpec = useCallback(
        id => {
            setData(
                'technical_specs',
                data.technical_specs.filter(spec => spec.id !== id)
            )
        },
        [data.technical_specs, setData]
    )

    // Model features handlers
    const addModelFeature = useCallback(() => {
        if (!modelFeatureForm.name) {
            alert('Please fill in feature name')
            return
        }

        const newModelFeature = {
            id: generateId(),
            name: modelFeatureForm.name,
            category: modelFeatureForm.category
        }

        setData('model_features', [...data.model_features, newModelFeature])
        setModelFeatureForm(prev => ({ ...prev, name: '' }))
    }, [modelFeatureForm, data.model_features, setData, setModelFeatureForm])

    const removeModelFeature = useCallback(
        id => {
            setData(
                'model_features',
                data.model_features.filter(feature => feature.id !== id)
            )
        },
        [data.model_features, setData]
    )

    // Variant handlers
    const handleVariantImageUpload = useCallback(
        file => {
            if (!file) return
            setVariantForm(prev => ({ ...prev, image: file }))
        },
        [setVariantForm]
    )

    const addVariant = useCallback(() => {
        if (!variantForm.title || !variantForm.sku || !variantForm.price || !variantForm.quantity) {
            alert('Please fill in required fields: Title, SKU, Price, and Quantity')
            return
        }

        const newVariant = { id: generateId(), ...variantForm }
        setData('variants', [...data.variants, newVariant])
        setVariantForm(INITIAL_VARIANT_FORM)
        setShowVariantForm(false)
    }, [variantForm, data.variants, setData, setVariantForm])

    const removeVariant = useCallback(
        id => {
            setData(
                'variants',
                data.variants.filter(variant => variant.id !== id)
            )
        },
        [data.variants, setData]
    )

    const editVariant = useCallback(
        variant => {
            setVariantForm(variant)
            setShowVariantForm(true)
            removeVariant(variant.id)
        },
        [setVariantForm, removeVariant]
    )

    // Event handlers
    const handleFileSelect = useCallback(
        files => {
            if (files) {
                handleImageUpload(files)
            } else {
                document.getElementById('file-upload')?.click()
            }
        },
        [handleImageUpload]
    )

    const handleVariantFileSelect = useCallback(() => {
        document.getElementById('variant-image-upload')?.click()
    }, [])

    const handleVariantCancel = useCallback(() => {
        setShowVariantForm(false)
        setVariantForm(INITIAL_VARIANT_FORM)
    }, [setVariantForm])

    const handleVariantImageRemove = useCallback(() => {
        setVariantForm(prev => ({ ...prev, image: null }))
    }, [setVariantForm])

    // Filter model features by category
    const primaryFeatures = data.model_features.filter(f => f.category === 'primary')
    const additionalFeatures = data.model_features.filter(f => f.category === 'additional')

    return (
        <div className='py-4'>
            <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
                <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Create Product</h2>
                <div>
                    <Link href='/products'>
                        <Button variant='ghost' size='sm' className='gap-2 text-gray-400 hover:text-white'>
                            <ArrowLeft className='w-4 h-4' />
                            Back to Products
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='flex-1 overflow-auto'>
                <div className='max-w-6xl mx-auto space-y-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        {/* Main Form - Left Column */}
                        <div className='lg:col-span-2 space-y-6'>
                            {/* Basic Product Information */}
                            <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                                <h2 className='text-lg font-semibold text-foreground'>Basic Product Information</h2>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <CustomTextField
                                        id='name'
                                        label='Product Name'
                                        placeholder='Enter product name'
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                    />

                                    <CustomTextField
                                        id='sku'
                                        label='SKU'
                                        placeholder='Enter SKU'
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        error={!!errors.sku}
                                        helperText={errors.sku}
                                    />

                                    <CustomMultiSelect
                                        id='categories'
                                        label='Categories'
                                        placeholder='Select categories'
                                        options={categories.map(category => ({ label: category.name, value: category.id }))}
                                        value={data.categories}
                                        onChange={values => setData('categories', values)}
                                    />

                                    <CustomTextField
                                        id='short_description'
                                        label='Short Description'
                                        placeholder='Enter short description'
                                        value={data.short_description}
                                        onChange={e => setData('short_description', e.target.value)}
                                        error={!!errors.short_description}
                                        helperText={errors.short_description}
                                    />
                                </div>

                                <CustomTextField
                                    id='description'
                                    label='Description'
                                    placeholder='Enter product description'
                                    multiline
                                    rows={4}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    error={!!errors.description}
                                    helperText={errors.description}
                                />
                            </div>

                            {/* Product Features */}
                            <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                                <h2 className='text-lg font-semibold text-foreground'>Product Features</h2>

                                <div className='space-y-4'>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        <CustomTextField
                                            id='feature-name'
                                            label='Feature Name *'
                                            placeholder='e.g., Digital Display'
                                            value={featureForm.name}
                                            onChange={e => setFeatureForm(prev => ({ ...prev, name: e.target.value }))}
                                        />

                                        <CustomTextField
                                            id='feature-type'
                                            label='Type *'
                                            placeholder='e.g., Display Type'
                                            value={featureForm.type}
                                            onChange={e => setFeatureForm(prev => ({ ...prev, type: e.target.value }))}
                                        />

                                        <CustomTextField
                                            id='feature-icon'
                                            label='Icon *'
                                            placeholder='e.g., Clock, Battery, Water'
                                            value={featureForm.icon}
                                            onChange={e => setFeatureForm(prev => ({ ...prev, icon: e.target.value }))}
                                        />
                                    </div>

                                    <Button variant='outlined' onClick={addFeature}
                                        sx={{
                                            color: isDark ? '#9CA3AF' : '#6B7280',
                                            borderColor: isDark ? '#374151' : '#6B7280',
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(55, 65, 81, 0.3)',
                                                borderColor: isDark ? '#6B7280' : '#6B7280'
                                            }
                                        }}>
                                        <Plus className='w-4 h-4' />
                                        Add Feature
                                    </Button>

                                    {data.features.length > 0 && (
                                        <div className='space-y-2'>
                                            <h3 className='text-md font-medium text-foreground'>Added Features</h3>
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                                {data.features.map(feature => (
                                                    <FeatureItem key={feature.id} feature={feature} onRemove={removeFeature} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Technical Specifications */}
                            <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                                <h2 className='text-lg font-semibold text-foreground'>Technical Specifications</h2>

                                <div className='space-y-4'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <CustomTextField
                                            id='spec-key'
                                            label='Specification Key *'
                                            value={specForm.key}
                                            onChange={e => setSpecForm(prev => ({ ...prev, key: e.target.value }))}
                                        />

                                        <CustomTextField
                                            id='spec-value'
                                            label='Specification Value *'
                                            value={specForm.value}
                                            onChange={e => setSpecForm(prev => ({ ...prev, value: e.target.value }))}
                                        />
                                    </div>

                                    <Button variant='outlined' onClick={addTechnicalSpec}
                                        sx={{
                                            color: isDark ? '#9CA3AF' : '#6B7280',
                                            borderColor: isDark ? '#374151' : '#6B7280',
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(55, 65, 81, 0.3)',
                                                borderColor: isDark ? '#6B7280' : '#6B7280'
                                            }
                                        }}>
                                        <Plus className='w-4 h-4' />
                                        Add Specification
                                    </Button>

                                    {data.technical_specs.length > 0 && (
                                        <div className='space-y-2'>
                                            <h3 className='text-md font-medium text-foreground'>Added Specifications</h3>
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                                {data.technical_specs.map(spec => (
                                                    <SpecItem key={spec.id} spec={spec} onRemove={removeTechnicalSpec} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Model Features */}
                            <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                                <h2 className='text-lg font-semibold text-foreground'>Model Features</h2>

                                <div className='space-y-4'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <CustomTextField
                                            id='model-feature-name'
                                            label='Feature Name *'
                                            placeholder='e.g., 19-inch wheels, LED headlights'
                                            value={modelFeatureForm.name}
                                            onChange={e => setModelFeatureForm(prev => ({ ...prev, name: e.target.value }))}
                                        />

                                        <CustomSelectField
                                            id='model-feature-category'
                                            label='Feature Category *'
                                            placeholder='Select category'
                                            options={MODEL_FEATURE_CATEGORIES}
                                            value={modelFeatureForm.category}
                                            onChange={e => setModelFeatureForm(prev => ({ ...prev, category: e.target.value }))}
                                        />
                                    </div>

                                    <Button variant='outlined' onClick={addModelFeature}
                                        sx={{
                                            color: isDark ? '#9CA3AF' : '#6B7280',
                                            borderColor: isDark ? '#374151' : '#6B7280',
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(55, 65, 81, 0.3)',
                                                borderColor: isDark ? '#6B7280' : '#6B7280'
                                            }
                                        }}>
                                        <Plus className='w-4 h-4' />
                                        Add Model Feature
                                    </Button>

                                    {data.model_features.length > 0 && (
                                        <div className='space-y-4'>
                                            <h3 className='text-md font-medium text-foreground'>Added Model Features</h3>

                                            {primaryFeatures.length > 0 && (
                                                <div className='space-y-2'>
                                                    <h4 className='text-sm font-medium text-foreground'>Primary Features</h4>
                                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                                        {primaryFeatures.map(feature => (
                                                            <ModelFeatureItem key={feature.id} feature={feature} onRemove={removeModelFeature} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {additionalFeatures.length > 0 && (
                                                <div className='space-y-2'>
                                                    <h4 className='text-sm font-medium text-foreground'>Additional Features</h4>
                                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                                        {additionalFeatures.map(feature => (
                                                            <ModelFeatureItem key={feature.id} feature={feature} onRemove={removeModelFeature} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Images */}
                            <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                                <h2 className='text-lg font-semibold text-foreground'>Product Images</h2>

                                <ImageUploadArea dragActive={dragActive} onDrag={handleDrag} onDrop={handleDrop} onFileSelect={handleFileSelect} />

                                {data.images.length > 0 && (
                                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                                        {data.images.map((image, index) => (
                                            <div key={index} className='relative group'>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Product ${index + 1}`}
                                                    className='w-full h-32 object-cover rounded-lg border border-border'
                                                />
                                                {index === 0 && <Badge className='absolute top-2 left-2 bg-emerald-500 text-white'>Primary</Badge>}
                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    size='icon'
                                                    className='absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity'
                                                    onClick={() => removeImage(index)}>
                                                    <X className='w-4 h-4' />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Variants */}
                            <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h2 className='text-lg font-semibold text-foreground'>Product Variants</h2>
                                        <p className='text-sm text-muted-foreground'>Create different variations of your product</p>
                                    </div>
                                    <Button variant='outlined' onClick={() => setShowVariantForm(!showVariantForm)}
                                        sx={{
                                            color: isDark ? '#9CA3AF' : '#6B7280',
                                            borderColor: isDark ? '#374151' : '#6B7280',
                                            '&:hover': {
                                                bgcolor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(55, 65, 81, 0.3)',
                                                borderColor: isDark ? '#6B7280' : '#6B7280'
                                            }
                                        }}>
                                        <Plus className='w-4 h-4' />
                                        Add Variant
                                    </Button>
                                </div>

                                {/* Variant Creation Form */}
                                {showVariantForm && (
                                    <div className='border border-border rounded-lg p-4 space-y-4 bg-muted/20'>
                                        <h3 className='text-md font-medium text-foreground'>Create New Variant</h3>

                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                            <CustomTextField
                                                id='variant-title'
                                                label='Title *'
                                                placeholder='e.g., Large Black Leather'
                                                value={variantForm.title}
                                                onChange={e => setVariantForm(prev => ({ ...prev, title: e.target.value }))}
                                            />

                                            <CustomTextField
                                                id='variant-sku'
                                                label='SKU *'
                                                placeholder='e.g., SKU-001'
                                                value={variantForm.sku}
                                                onChange={e => setVariantForm(prev => ({ ...prev, sku: e.target.value }))}
                                            />

                                            <CustomTextField
                                                id='variant-size'
                                                label='Size'
                                                placeholder='e.g., Large, XL'
                                                value={variantForm.size}
                                                onChange={e => setVariantForm(prev => ({ ...prev, size: e.target.value }))}
                                            />

                                            <CustomTextField
                                                id='variant-color'
                                                label='Color'
                                                placeholder='e.g., Black, Red'
                                                value={variantForm.color}
                                                onChange={e => setVariantForm(prev => ({ ...prev, color: e.target.value }))}
                                            />

                                            <CustomTextField
                                                id='variant-material'
                                                label='Material'
                                                placeholder='e.g., Leather, Steel'
                                                value={variantForm.material}
                                                onChange={e => setVariantForm(prev => ({ ...prev, material: e.target.value }))}
                                            />

                                            <CustomTextField
                                                id='variant-price'
                                                label='Price *'
                                                type='number'
                                                placeholder='0.00'
                                                value={variantForm.price}
                                                onChange={e => setVariantForm(prev => ({ ...prev, price: e.target.value }))}
                                                InputProps={{
                                                    startAdornment: <span className='text-muted-foreground mr-2'>$</span>
                                                }}
                                            />

                                            <CustomTextField
                                                id='variant-compare-price'
                                                label='Compare at Price'
                                                type='number'
                                                placeholder='0.00'
                                                value={variantForm.compare_at_price}
                                                onChange={e => setVariantForm(prev => ({ ...prev, compare_at_price: e.target.value }))}
                                                InputProps={{
                                                    startAdornment: <span className='text-muted-foreground mr-2'>$</span>
                                                }}
                                            />

                                            <CustomTextField
                                                id='variant-quantity'
                                                label='Quantity *'
                                                type='number'
                                                placeholder='0'
                                                value={variantForm.quantity}
                                                onChange={e => setVariantForm(prev => ({ ...prev, quantity: e.target.value }))}
                                            />

                                            <CustomSelectField
                                                id='variant-status'
                                                label='Status *'
                                                placeholder='Select status'
                                                options={STATUS_OPTIONS}
                                                value={variantForm.status}
                                                onChange={e => setVariantForm(prev => ({ ...prev, status: e.target.value }))}
                                            />

                                            <div className='space-y-2'>
                                                <div className='flex items-center gap-2'>
                                                    <input
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={e => handleVariantImageUpload(e.target.files[0])}
                                                        className='hidden'
                                                        id='variant-image-upload'
                                                    />
                                                    <Button type='button' variant='outline' onClick={handleVariantFileSelect} className='gap-2'>
                                                        <ImageIcon className='w-4 h-4' />
                                                        Upload Image
                                                    </Button>
                                                </div>
                                                {variantForm.image && (
                                                    <div className='relative w-20 h-20'>
                                                        <img
                                                            src={URL.createObjectURL(variantForm.image)}
                                                            alt='Variant preview'
                                                            className='w-full h-full object-cover rounded border'
                                                        />
                                                        <Button
                                                            type='button'
                                                            variant='destructive'
                                                            size='icon'
                                                            className='absolute -top-2 -right-2 h-6 w-6'
                                                            onClick={handleVariantImageRemove}>
                                                            <X className='w-3 h-3' />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className='flex gap-2'>
                                            <Button variant='contained' onClick={addVariant} className='!bg-text-primary !text-primary-foreground'>
                                                Add
                                            </Button>
                                            <Button variant='outlined' onClick={handleVariantCancel}
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
                                        </div>
                                    </div>
                                )}

                                {/* Variants Table */}
                                {data.variants.length > 0 && (
                                    <div className='space-y-4'>
                                        <h3 className='text-md font-medium text-foreground'>Created Variants</h3>
                                        <VariantTable variants={data.variants} onEdit={editVariant} onRemove={removeVariant} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Status & Actions */}
                        <div className='space-y-6'>
                            {/* Status */}
                            <div className='bg-card border border-border rounded-xl p-6 space-y-4'>
                                <h2 className='text-lg font-semibold text-text-primary'>Product Status</h2>
                                <StatusSelector status={data.status} onStatusChange={status => setData('status', status)} />
                            </div>

                            {/* Actions */}
                            <div className='bg-card border border-border rounded-xl p-6 space-y-3'>
                                <h2 className='text-lg font-semibold text-text-primary'>Actions</h2>
                                <Button
                                    className={cn(
                                        'w-full gap-2',
                                        data.variants.length === 0 ? '!bg-gray-500 cursor-not-allowed' : '!bg-black dark:!bg-white !text-white dark:!text-black'
                                    )}
                                    variant='primary'
                                    size='md'
                                    disabled={data.variants.length === 0 || processing}
                                    onClick={() => {
                                        const formData = new FormData()

                                        // Add basic fields
                                        formData.append('name', data.name)
                                        formData.append('description', data.description)
                                        formData.append('short_description', data.short_description)
                                        formData.append('sku', data.sku)
                                        formData.append('status', data.status)

                                        // Add categories
                                        data.categories.forEach(categoryId => {
                                            formData.append('categories[]', categoryId)
                                        })

                                        // Add features as individual items
                                        data.features.forEach((feature, index) => {
                                            formData.append(`features[${index}][name]`, feature.name)
                                            formData.append(`features[${index}][type]`, feature.type)
                                            formData.append(`features[${index}][icon]`, feature.icon)
                                        })

                                        // Add technical specs as individual items
                                        data.technical_specs.forEach((spec, index) => {
                                            formData.append(`technical_specs[${index}][key]`, spec.key)
                                            formData.append(`technical_specs[${index}][value]`, spec.value)
                                        })

                                        // Add model features as individual items
                                        data.model_features.forEach((feature, index) => {
                                            formData.append(`model_features[${index}][name]`, feature.name)
                                            formData.append(`model_features[${index}][category]`, feature.category || '')
                                        })

                                        // Add images
                                        data.images.forEach(image => {
                                            formData.append('images[]', image)
                                        })

                                        // Add variants
                                        data.variants.forEach((variant, index) => {
                                            formData.append(`variants[${index}][title]`, variant.title)
                                            formData.append(`variants[${index}][sku]`, variant.sku)
                                            formData.append(`variants[${index}][size]`, variant.size || '')
                                            formData.append(`variants[${index}][color]`, variant.color || '')
                                            formData.append(`variants[${index}][material]`, variant.material || '')
                                            formData.append(`variants[${index}][price]`, variant.price)
                                            formData.append(`variants[${index}][compare_at_price]`, variant.compare_at_price || '')
                                            formData.append(`variants[${index}][quantity]`, variant.quantity)
                                            formData.append(`variants[${index}][status]`, variant.status)

                                            if (variant.image) {
                                                formData.append(`variants[${index}][image]`, variant.image)
                                            }
                                        })

                                        post(route('admin.products.store'), {
                                            data: formData,
                                            forceFormData: true
                                        })
                                    }}
                                    startIcon={<Save className='w-4 h-4' />}>
                                    {data.variants.length === 0
                                        ? 'Create at least one variant first'
                                        : processing
                                            ? 'Creating Product...'
                                            : `Create Product with ${data.variants.length} Variant${data.variants.length !== 1 ? 's' : ''}`}
                                </Button>
                                {data.variants.length === 0 && (
                                    <p className='text-xs text-muted-foreground text-center'>You must create at least one variant before creating the product</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ProductCreate({ categories }) {
    return (
        <AuthenticatedLayout>
            <ProductCreateFields categories={categories} />
        </AuthenticatedLayout>
    )
}
