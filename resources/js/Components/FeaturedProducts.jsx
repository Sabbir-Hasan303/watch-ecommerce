'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Search, Filter, Star, TrendingUp, Flame, Sparkles, Upload, ImageIcon, Check, ChevronDown } from 'lucide-react'
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
import { Card, Input, Button, InputAdornment, FormControl } from '@mui/material'
import CustomTextField from '@/Components/CustomTextField'

const statusOptions = [
  { value: 'featured', label: 'Featured Product', icon: Star, color: 'from-yellow-500 to-orange-500' },
  { value: 'new-arrival', label: 'New Arrival', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
  { value: 'best-seller', label: 'Best Seller', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
  { value: 'hot-deal', label: 'Hot Deal', icon: Flame, color: 'from-red-500 to-pink-500' },
  { value: 'none', label: 'None', icon: null, color: '' }
]

const categories = ['All Categories', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books']

export function FeaturedProducts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Wireless Headphones Pro',
      category: 'Electronics',
      price: 299.99,
      stock: 45,
      status: 'featured',
      image: '/placeholder.svg?height=40&width=40'
    },
    {
      id: '2',
      name: 'Smart Watch Ultra',
      category: 'Electronics',
      price: 499.99,
      stock: 23,
      status: 'best-seller',
      image: '/placeholder.svg?height=40&width=40'
    },
    {
      id: '3',
      name: 'Premium Yoga Mat',
      category: 'Sports',
      price: 79.99,
      stock: 67,
      status: 'new-arrival',
      image: '/placeholder.svg?height=40&width=40'
    },
    {
      id: '4',
      name: 'Designer Backpack',
      category: 'Clothing',
      price: 149.99,
      stock: 34,
      status: 'hot-deal',
      image: '/placeholder.svg?height=40&width=40'
    },
    {
      id: '5',
      name: 'LED Desk Lamp',
      category: 'Home & Garden',
      price: 59.99,
      stock: 89,
      status: 'none',
      image: '/placeholder.svg?height=40&width=40'
    },
    {
      id: '6',
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      price: 129.99,
      stock: 56,
      status: 'featured',
      image: '/placeholder.svg?height=40&width=40'
    }
  ])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  const updateProductStatus = (id, status) => {
    setProducts(products.map(p => (p.id === id ? { ...p, status } : p)))
  }

  const handleIconUpload = id => {
    // Simulate icon upload
    console.log('[v0] Icon upload for product:', id)
  }

  const getStatusConfig = status => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[4]
  }

  return (
    <Card className='bg-[#1C252E] border-white/5 p-6 animate-in fade-in slide-in-from-bottom-4 hover:border-emerald-500/20 transition-all duration-500'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
        <div>
          <h3 className='text-xl font-bold text-white bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
            Featured Products Management
          </h3>
          <p className='text-sm text-gray-500 mt-1'>Manage product highlights and promotions</p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-gray-500'>
            {selectedProducts.size} of {filteredProducts.length} selected
          </span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className='flex flex-col sm:flex-row justify-between gap-3 mb-6'>
        {/* Search Input */}
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

        {/* Category Filter */}
        <div className='relative'>
          <Button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className='w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 group'>
            <Filter className='w-4 h-4 mr-2 group-hover:rotate-12 transition-transform' />
            {selectedCategory}
            <ChevronDown className={cn('w-4 h-4 ml-2 transition-transform duration-300', showCategoryDropdown && 'rotate-180')} />
          </Button>

          {showCategoryDropdown && (
            <div className='absolute top-full right-0 w-48 bg-[#1C252E] border border-white/10 rounded-lg shadow-2xl shadow-black/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2'>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setShowCategoryDropdown(false)
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10',
                    selectedCategory === category ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300 hover:text-white'
                  )}>
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto rounded-xl border border-white/5'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-white/5 bg-white/5'>
              <th className='p-4 text-left'>
                <button
                  onClick={toggleAllProducts}
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300',
                    selectedProducts.size === filteredProducts.length && filteredProducts.length > 0
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500'
                      : 'border-white/20 hover:border-emerald-500/50'
                  )}>
                  {selectedProducts.size === filteredProducts.length && filteredProducts.length > 0 && <Check className='w-3 h-3 text-white' />}
                </button>
              </th>
              <th className='p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Product</th>
              <th className='p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Category</th>
              <th className='p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Price</th>
              <th className='p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Stock</th>
              <th className='p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Status</th>
              <th className='p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Icon</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => {
              const statusConfig = getStatusConfig(product.status)
              const StatusIcon = statusConfig.icon

              return (
                <tr
                  key={product.id}
                  className='border-b border-white/5 hover:bg-gradient-to-r hover:from-emerald-500/5 hover:to-teal-500/5 transition-all duration-300 group animate-in fade-in'
                  style={{ animationDelay: `${index * 50}ms` }}>
                  {/* Checkbox */}
                  <td className='p-4'>
                    <button
                      onClick={() => toggleProductSelection(product.id)}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300',
                        selectedProducts.has(product.id)
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 scale-110'
                          : 'border-white/20 hover:border-emerald-500/50 group-hover:scale-110'
                      )}>
                      {selectedProducts.has(product.id) && <Check className='w-3 h-3 text-white' />}
                    </button>
                  </td>

                  {/* Product Info */}
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='relative group/img'>
                        <div className='absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg blur-md opacity-0 group-hover/img:opacity-50 transition-opacity' />
                        <img
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          className='relative w-10 h-10 rounded-lg object-cover border border-white/10 group-hover/img:scale-110 transition-transform duration-300'
                        />
                      </div>
                      <span className='text-sm font-medium text-white group-hover:text-emerald-400 transition-colors'>{product.name}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className='p-4'>
                    <span className='text-sm text-gray-400'>{product.category}</span>
                  </td>

                  {/* Price */}
                  <td className='p-4'>
                    <span className='text-sm font-semibold text-white'>${product.price.toFixed(2)}</span>
                  </td>

                  {/* Stock */}
                  <td className='p-4'>
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                        product.stock > 50
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : product.stock > 20
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'bg-red-500/10 text-red-400'
                      )}>
                      {product.stock} units
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className='p-4'>
                    <div className='relative group/status'>
                      <select
                        value={product.status}
                        onChange={e => updateProductStatus(product.id, e.target.value)}
                        className={cn(
                          'appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-8 text-xs font-medium cursor-pointer transition-all duration-300 hover:border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none',
                          product.status !== 'none' ? 'text-white' : 'text-gray-500'
                        )}>
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value} className='bg-[#1C252E]'>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none' />

                      {/* Status Badge */}
                      {product.status !== 'none' && StatusIcon && (
                        <div className='absolute -top-1 -right-1 pointer-events-none'>
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg animate-pulse',
                              statusConfig.color
                            )}>
                            <StatusIcon className='w-3 h-3 text-white' />
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Icon Upload */}
                  <td className='p-4'>
                    <button
                      onClick={() => handleIconUpload(product.id)}
                      className='relative group/upload flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-300'>
                      {product.icon ? (
                        <ImageIcon className='w-4 h-4 text-emerald-400' />
                      ) : (
                        <Upload className='w-4 h-4 text-gray-500 group-hover/upload:text-emerald-400 group-hover/upload:scale-110 transition-all' />
                      )}

                      {/* Tooltip */}
                      <div className='absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1C252E] border border-white/10 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover/upload:opacity-100 transition-opacity pointer-events-none shadow-xl'>
                        Upload Icon
                      </div>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className='text-center py-12'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4'>
            <Search className='w-8 h-8 text-gray-500' />
          </div>
          <p className='text-gray-400 text-sm'>No products found matching your criteria</p>
        </div>
      )}

      {/* Footer Actions */}
      {selectedProducts.size > 0 && (
        <div className='mt-6 flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-2'>
          <span className='text-sm text-white font-medium'>{selectedProducts.size} products selected</span>
          <div className='flex-1' />
          <Button className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-500/50 transition-all duration-300'>
            Bulk Update Status
          </Button>
          <Button variant='outline' onClick={() => setSelectedProducts(new Set())} className='border-white/20 text-white hover:bg-white/5'>
            Clear Selection
          </Button>
        </div>
      )}
    </Card>
  )
}
