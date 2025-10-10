import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Filter, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { Button, Badge, FormControl, InputAdornment } from '@mui/material'
import { Link } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import { useThemeContext } from '@/contexts/ThemeContext'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'

export default function ProductList() {
  const { theme, setTheme } = useThemeContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock product data
  const allProducts = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      category: 'Electronics',
      price: 299.99,
      stock: 45,
      status: 'active',
      image: '/placeholder.svg?height=80&width=80',
      variants: 3
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      category: 'Electronics',
      price: 399.99,
      stock: 23,
      status: 'active',
      image: '/placeholder.svg?height=80&width=80',
      variants: 5
    },
    {
      id: '3',
      name: 'Leather Messenger Bag',
      category: 'Fashion',
      price: 149.99,
      stock: 67,
      status: 'active',
      image: '/placeholder.svg?height=80&width=80',
      variants: 2
    },
    {
      id: '4',
      name: 'Organic Cotton T-Shirt',
      category: 'Fashion',
      price: 29.99,
      stock: 0,
      status: 'active',
      image: '/placeholder.svg?height=80&width=80',
      variants: 8
    },
    {
      id: '5',
      name: 'Yoga Mat Premium',
      category: 'Sports',
      price: 59.99,
      stock: 89,
      status: 'active',
      image: '/placeholder.svg?height=80&width=80',
      variants: 4
    },
    {
      id: '6',
      name: 'Stainless Steel Water Bottle',
      category: 'Sports',
      price: 24.99,
      stock: 156,
      status: 'draft',
      image: '/placeholder.svg?height=80&width=80',
      variants: 6
    },
    {
      id: '7',
      name: 'Ergonomic Office Chair',
      category: 'Furniture',
      price: 449.99,
      stock: 12,
      status: 'active',
      image: '/placeholder.svg?height=80&width=80',
      variants: 3
    },
    {
      id: '8',
      name: 'Standing Desk Converter',
      category: 'Furniture',
      price: 199.99,
      stock: 34,
      status: 'active',
      image: '/placeholder.svg?height=80&width=80',
      variants: 2
    },
    {
      id: '9',
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      price: 79.99,
      stock: 91,
      status: 'active',
      image: '/placeholder.svg?height=80&width=80',
      variants: 4
    },
    {
      id: '10',
      name: 'Running Shoes',
      category: 'Sports',
      price: 129.99,
      stock: 45,
      status: 'draft',
      image: '/placeholder.svg?height=80&width=80',
      variants: 12
    }
  ]

  const categories = ['all', 'Electronics', 'Fashion', 'Sports', 'Furniture']
  const statuses = ['all', 'active', 'draft', 'archived']

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'draft':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'archived':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const handleEdit = productId => {
    router.visit(`/products/edit/${productId}`)
  }

  return (
    <AuthenticatedLayout>
      <div className='py-4'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
          <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Product Management</h2>
          <div>
            <Link href='/products/create'>
              <Button variant='primary' size='md' startIcon={<Plus className='w-4 h-4' />}>
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Filters and Actions */}
          <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
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
                  options={categories.map(category => ({ label: category.charAt(0).toUpperCase() + category.slice(1) }))}
                />
              </FormControl>

              <FormControl size='small' sx={{ minWidth: 200 }}>
                <CustomSelectField
                  placeholder='Select status...'
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  label='Status'
                  startAdornment={<Filter className='w-4 h-4 mr-2' />}
                  options={statuses.map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))}
                />
              </FormControl>
            </div>
          </div>

          <div className='bg-card border border-border rounded-xl overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-muted/50 border-b border-border'>
                  <tr>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>
                      <div className='flex items-center gap-2'>
                        Product
                        <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
                      </div>
                    </th>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>
                      <div className='flex items-center gap-2'>
                        Category
                        <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
                      </div>
                    </th>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>
                      <div className='flex items-center gap-2'>
                        Price
                        <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
                      </div>
                    </th>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>
                      <div className='flex items-center gap-2'>
                        Stock
                        <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
                      </div>
                    </th>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>Variants</th>
                    <th className='text-left p-4 text-sm font-semibold text-foreground'>Status</th>
                    <th className='text-right p-4 text-sm font-semibold text-foreground'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {paginatedProducts.map(product => (
                    <tr key={product.id} className='hover:bg-muted/30 transition-colors group'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={product.image || '/placeholder.svg'}
                            alt={product.name}
                            className='w-12 h-12 rounded-lg object-cover bg-muted flex-shrink-0'
                          />
                          <div className='min-w-0'>
                            <p className='font-medium text-foreground truncate'>{product.name}</p>
                            <p className='text-sm text-muted-foreground'>ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className='p-4'>
                        <span className='text-sm text-foreground'>{product.category}</span>
                      </td>
                      <td className='p-4'>
                        <span className='text-sm font-semibold text-foreground'>${product.price.toFixed(2)}</span>
                      </td>
                      <td className='p-4'>
                        <span
                          className={cn(
                            'text-sm font-medium',
                            product.stock === 0 ? 'text-red-400' : product.stock < 20 ? 'text-amber-400' : 'text-emerald-400'
                          )}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className='p-4'>
                        <Badge variant='outline' className='text-xs'>
                          {product.variants} variants
                        </Badge>
                      </td>
                      <td className='p-4'>
                        <Badge className={cn('text-xs', getStatusColor(product.status))}>{product.status}</Badge>
                      </td>
                      <td className='p-4'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button variant='ghost' size='icon' className='h-8 w-8'>
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => handleEdit(product.id)}>
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button variant='ghost' size='icon' className='h-8 w-8 text-destructive'>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex items-center justify-between pt-4'>
              <p className='text-sm text-muted-foreground'>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </p>

              <div className='flex items-center gap-2'>
                <Button variant='outline' size='icon' onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className='w-4 h-4' />
                </Button>

                <div className='flex gap-1'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size='icon'
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        currentPage === page && 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                      )}>
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}>
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
