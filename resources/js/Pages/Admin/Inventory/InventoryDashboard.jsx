'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  Minus,
  Edit,
  Trash2,
  Download,
  Upload,
  ShoppingCart,
  DollarSign,
  Archive
} from 'lucide-react'
// import { Card } from "@/Components/ui/card"
// import { Button } from "@/Components/ui/button"
import { Card, Button } from '@mui/material'

export function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])

  const inventoryStats = [
    {
      title: 'Total Products',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      description: 'Active items'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '+5',
      trend: 'up',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      description: 'Need restock'
    },
    {
      title: 'Out of Stock',
      value: '8',
      change: '-2',
      trend: 'down',
      icon: Archive,
      color: 'from-red-500 to-pink-500',
      description: 'Urgent action'
    },
    {
      title: 'Total Value',
      value: '$234.5K',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      description: 'Inventory worth'
    }
  ]

  const inventoryData = [
    {
      id: '1',
      name: 'Wireless Headphones Pro',
      sku: 'WHP-001',
      category: 'Electronics',
      stock: 145,
      minStock: 50,
      maxStock: 500,
      price: 89.99,
      status: 'in-stock',
      lastUpdated: '2 hours ago',
      supplier: 'TechCorp'
    },
    {
      id: '2',
      name: 'Smart Watch Series 5',
      sku: 'SWS-005',
      category: 'Electronics',
      stock: 23,
      minStock: 30,
      maxStock: 200,
      price: 299.99,
      status: 'low-stock',
      lastUpdated: '5 hours ago',
      supplier: 'SmartTech'
    },
    {
      id: '3',
      name: 'USB-C Cable 2m',
      sku: 'USC-002',
      category: 'Accessories',
      stock: 0,
      minStock: 100,
      maxStock: 1000,
      price: 12.99,
      status: 'out-of-stock',
      lastUpdated: '1 day ago',
      supplier: 'CableWorld'
    },
    {
      id: '4',
      name: 'Laptop Stand Aluminum',
      sku: 'LPS-003',
      category: 'Accessories',
      stock: 67,
      minStock: 20,
      maxStock: 150,
      price: 45.99,
      status: 'in-stock',
      lastUpdated: '3 hours ago',
      supplier: 'OfficeSupply'
    },
    {
      id: '5',
      name: 'Mechanical Keyboard RGB',
      sku: 'MKR-004',
      category: 'Electronics',
      stock: 18,
      minStock: 25,
      maxStock: 100,
      price: 129.99,
      status: 'low-stock',
      lastUpdated: '6 hours ago',
      supplier: 'KeyMaster'
    }
  ]

  const categories = ['all', 'Electronics', 'Accessories', 'Clothing', 'Food', 'Books']
  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock']

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const toggleSelectItem = id => {
    setSelectedItems(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map(item => item.id))
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'in-stock':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'low-stock':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      case 'out-of-stock':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStockPercentage = (current, max) => {
    return (current / max) * 100
  }

  return (
    <div className='space-y-6'>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {inventoryStats.map((stat, index) => (
          <Card
            key={index}
            className='bg-[#1C252E] border-white/5 p-6 hover:border-emerald-500/30 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden relative'
            style={{ animationDelay: `${index * 100}ms` }}>
            <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500' />

            <div className='relative flex items-start justify-between'>
              <div className='flex-1'>
                <p className='text-sm text-gray-500 mb-2 group-hover:text-gray-400 transition-colors'>{stat.title}</p>
                <h3 className='text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors'>{stat.value}</h3>
                <div className='flex items-center gap-1'>
                  {stat.trend === 'up' ? (
                    <TrendingUp className='w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
                  ) : (
                    <TrendingDown className='w-4 h-4 text-red-500' />
                  )}
                  <span className={cn('text-sm font-medium', stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>{stat.change}</span>
                  <span className='text-sm text-gray-500'>{stat.description}</span>
                </div>
              </div>
              <div className='relative'>
                <div
                  className={cn(
                    'absolute inset-0 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 bg-gradient-to-br',
                    stat.color
                  )}
                />
                <div
                  className={cn(
                    'relative w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg',
                    stat.color
                  )}>
                  <stat.icon className='w-6 h-6 text-white' />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Low Stock Alerts */}
      <Card className='bg-[#1C252E] border-white/5 p-6 animate-in fade-in slide-in-from-bottom-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <div className='absolute inset-0 bg-orange-500 rounded-lg blur-md opacity-50 animate-pulse' />
              <div className='relative w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center'>
                <AlertTriangle className='w-5 h-5 text-white' />
              </div>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-white'>Low Stock Alerts</h3>
              <p className='text-sm text-gray-500'>Items requiring immediate attention</p>
            </div>
          </div>
          <Button className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300'>
            <ShoppingCart className='w-4 h-4 mr-2' />
            Restock All
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {inventoryData
            .filter(item => item.status === 'low-stock' || item.status === 'out-of-stock')
            .map((item, index) => (
              <div
                key={item.id}
                className='p-4 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 group cursor-pointer'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1'>
                    <h4 className='text-sm font-medium text-white group-hover:text-emerald-400 transition-colors'>{item.name}</h4>
                    <p className='text-xs text-gray-500 mt-1'>SKU: {item.sku}</p>
                  </div>
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full border', getStatusColor(item.status))}>
                    {item.status === 'out-of-stock' ? 'Out' : 'Low'}
                  </span>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-gray-500'>Current Stock</span>
                    <span className='text-white font-medium'>{item.stock} units</span>
                  </div>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-gray-500'>Min Required</span>
                    <span className='text-orange-400 font-medium'>{item.minStock} units</span>
                  </div>
                  <div className='h-2 bg-white/5 rounded-full overflow-hidden'>
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        item.status === 'out-of-stock' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                      )}
                      style={{ width: `${Math.min(getStockPercentage(item.stock, item.minStock), 100)}%` }}
                    />
                  </div>
                </div>

                <Button className='w-full mt-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300'>
                  <Plus className='w-3 h-3 mr-1' />
                  Restock Now
                </Button>
              </div>
            ))}
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className='bg-[#1C252E] border-white/5 p-6 animate-in fade-in slide-in-from-bottom-4'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-white'>Inventory Management</h3>
            <p className='text-sm text-gray-500 mt-1'>Manage stock levels and adjustments</p>
          </div>

          <div className='flex items-center gap-2'>
            <Button className='bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-emerald-500/30 transition-all duration-300'>
              <Download className='w-4 h-4 mr-2' />
              Export
            </Button>
            <Button className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300'>
              <Upload className='w-4 h-4 mr-2' />
              Import
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='flex-1 relative group'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors' />
            <input
              type='text'
              placeholder='Search by name or SKU...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300'
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className='px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 cursor-pointer hover:bg-white/10'>
            {categories.map(category => (
              <option key={category} value={category} className='bg-[#1C252E]'>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className='px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 cursor-pointer hover:bg-white/10'>
            {statuses.map(status => (
              <option key={status} value={status} className='bg-[#1C252E]'>
                {status === 'all' ? 'All Status' : status.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className='mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2'>
            <span className='text-sm text-emerald-400 font-medium'>{selectedItems.length} items selected</span>
            <div className='flex items-center gap-2'>
              <Button className='bg-white/5 hover:bg-white/10 text-white text-sm'>
                <Edit className='w-3 h-3 mr-1' />
                Bulk Edit
              </Button>
              <Button className='bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm'>
                <Trash2 className='w-3 h-3 mr-1' />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className='overflow-x-auto rounded-xl border border-white/5'>
          <table className='w-full'>
            <thead>
              <tr className='bg-white/5 border-b border-white/5'>
                <th className='px-4 py-3 text-left'>
                  <input
                    type='checkbox'
                    checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                    onChange={toggleSelectAll}
                    className='w-4 h-4 rounded border-gray-600 bg-white/5 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 cursor-pointer'
                  />
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Product</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>SKU</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Category</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Stock</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Status</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Price</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/5'>
              {filteredData.map((item, index) => (
                <tr key={item.id} className='hover:bg-white/5 transition-colors duration-200 group' style={{ animationDelay: `${index * 50}ms` }}>
                  <td className='px-4 py-4'>
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className='w-4 h-4 rounded border-gray-600 bg-white/5 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 cursor-pointer'
                    />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <Package className='w-5 h-5 text-white' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-white group-hover:text-emerald-400 transition-colors'>{item.name}</p>
                        <p className='text-xs text-gray-500'>{item.supplier}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <span className='text-sm text-gray-400 font-mono'>{item.sku}</span>
                  </td>
                  <td className='px-4 py-4'>
                    <span className='px-2 py-1 text-xs font-medium text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20'>
                      {item.category}
                    </span>
                  </td>
                  <td className='px-4 py-4'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-white'>{item.stock}</span>
                        <span className='text-xs text-gray-500'>/ {item.maxStock}</span>
                      </div>
                      <div className='w-24 h-1.5 bg-white/5 rounded-full overflow-hidden'>
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            item.status === 'in-stock' && 'bg-gradient-to-r from-emerald-500 to-teal-500',
                            item.status === 'low-stock' && 'bg-gradient-to-r from-orange-500 to-red-500',
                            item.status === 'out-of-stock' && 'bg-gradient-to-r from-red-500 to-pink-500'
                          )}
                          style={{ width: `${getStockPercentage(item.stock, item.maxStock)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <span className={cn('px-2 py-1 text-xs font-medium rounded-full border', getStatusColor(item.status))}>
                      {item.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className='px-4 py-4'>
                    <span className='text-sm font-medium text-white'>${item.price.toFixed(2)}</span>
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-2'>
                      {/* <button className="p-2 hover:bg-emerald-500/10 rounded-lg transition-all duration-300 group/btn">
                        <Plus className="w-4 h-4 text-gray-400 group-hover/btn:text-emerald-400 transition-colors" />
                      </button>
                      <button className="p-2 hover:bg-orange-500/10 rounded-lg transition-all duration-300 group/btn">
                        <Minus className="w-4 h-4 text-gray-400 group-hover/btn:text-orange-400 transition-colors" />
                      </button>*/}
                      <button className='p-2 hover:bg-blue-500/10 rounded-lg transition-all duration-300 group/btn'>
                        <Edit className='w-4 h-4 text-gray-400 group-hover/btn:text-blue-400 transition-colors' />
                      </button>
                      {/* <button className="p-2 hover:bg-red-500/10 rounded-lg transition-all duration-300 group/btn">
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover/btn:text-red-400 transition-colors" />
                      </button>*/}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className='text-center py-12'>
            <Package className='w-12 h-12 text-gray-600 mx-auto mb-3' />
            <p className='text-gray-500'>No inventory items found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
