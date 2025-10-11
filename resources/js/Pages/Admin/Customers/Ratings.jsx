import { React, useState } from 'react'
import { Search, Star, TrendingUp, TrendingDown, BarChart3, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { InputAdornment, Button, FormControl, Box, Typography } from '@mui/material'
import { Card } from '@/Components/ui/card'
import { Progress } from '@/Components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'

const mockRatings = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    category: 'Electronics',
    averageRating: 4.8,
    totalRatings: 342,
    ratingDistribution: { 5: 280, 4: 45, 3: 12, 2: 3, 1: 2 },
    trend: 'up',
    trendValue: 0.3
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    category: 'Wearables',
    averageRating: 4.5,
    totalRatings: 256,
    ratingDistribution: { 5: 180, 4: 60, 3: 10, 2: 4, 1: 2 },
    trend: 'up',
    trendValue: 0.2
  },
  {
    id: '3',
    name: 'Organic Skincare Set',
    category: 'Beauty',
    averageRating: 4.9,
    totalRatings: 428,
    ratingDistribution: { 5: 390, 4: 30, 3: 5, 2: 2, 1: 1 },
    trend: 'stable',
    trendValue: 0
  },
  {
    id: '4',
    name: 'Professional Camera Lens',
    category: 'Photography',
    averageRating: 4.7,
    totalRatings: 189,
    ratingDistribution: { 5: 145, 4: 35, 3: 6, 2: 2, 1: 1 },
    trend: 'up',
    trendValue: 0.4
  },
  {
    id: '5',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    averageRating: 3.8,
    totalRatings: 167,
    ratingDistribution: { 5: 60, 4: 45, 3: 40, 2: 15, 1: 7 },
    trend: 'down',
    trendValue: 0.3
  },
  {
    id: '6',
    name: 'Gaming Keyboard',
    category: 'Electronics',
    averageRating: 3.2,
    totalRatings: 234,
    ratingDistribution: { 5: 45, 4: 50, 3: 60, 2: 50, 1: 29 },
    trend: 'down',
    trendValue: 0.5
  }
]

export default function RatingsManagement() {
  const [ratings] = useState(mockRatings)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRating, setSelectedRating] = useState(null)
  const itemsPerPage = 10

  const filteredRatings = ratings
    .filter(rating => {
      const matchesSearch =
        rating.name.toLowerCase().includes(searchQuery.toLowerCase()) || rating.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || rating.category === categoryFilter

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.averageRating - a.averageRating
      if (sortBy === 'reviews') return b.totalRatings - a.totalRatings
      return 0
    })

  const totalPages = Math.ceil(filteredRatings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRatings = filteredRatings.slice(startIndex, startIndex + itemsPerPage)

  const totalRatings = ratings.reduce((sum, r) => sum + r.totalRatings, 0)
  const averageRating = (ratings.reduce((sum, r) => sum + r.averageRating * r.totalRatings, 0) / totalRatings).toFixed(1)
  const topRatedProducts = ratings.filter(r => r.averageRating >= 4.5).length
  const needsAttention = ratings.filter(r => r.averageRating < 3.5).length

  const renderStars = rating => {
    return (
      <div className='flex items-center gap-1'>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= Math.floor(rating)
                ? 'text-amber-400 fill-amber-400'
                : star - 0.5 <= rating
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-gray-600'
            } transition-colors`}
          />
        ))}
      </div>
    )
  }

  const getTrendIcon = trend => {
    if (trend === 'up') return <TrendingUp className='h-4 w-4 text-emerald-400' />
    if (trend === 'down') return <TrendingDown className='h-4 w-4 text-red-400' />
    return null
  }

  const getTrendColor = trend => {
    if (trend === 'up') return 'text-emerald-400'
    if (trend === 'down') return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <AuthenticatedLayout>
      <Head title='Ratings Management' />
      <div className='py-4'>
        <div className='mb-6'>
          <div>
            <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Ratings Management</h2>
            <p className='text-sm text-muted-foreground'>Track and analyze product ratings</p>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card className='p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Average Rating</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{averageRating}</p>
                  <div className='flex items-center gap-1 mt-2'>{renderStars(Number.parseFloat(averageRating))}</div>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <Star className='h-7 w-7 text-amber-400 fill-amber-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Total Ratings</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{totalRatings}</p>
                  <p className='text-xs text-text-primary mt-1 flex items-center gap-1'>
                    <TrendingUp className='w-3 h-3' />
                    +18% this month
                  </p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <BarChart3 className='h-7 w-7 text-blue-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Top Rated</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{topRatedProducts}</p>
                  <p className='text-xs text-text-primary mt-1'>4.5+ stars</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <TrendingUp className='h-7 w-7 text-emerald-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Needs Attention</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{needsAttention}</p>
                  <p className='text-xs text-text-primary mt-1'>Below 3.5 stars</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <TrendingDown className='h-7 w-7 text-red-400' />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className='p-6'>
            <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
              <div className='flex-1 w-full md:max-w-md'>
                <div className='relative'>
                  <CustomTextField
                    placeholder='Search products...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className='pl-10'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Search className='w-4 h-4 mr-2' />
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
              </div>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl size='small' sx={{ minWidth: 200 }}>
                  <CustomSelectField
                    placeholder='Select category...'
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    label='Category'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Filter className='w-4 h-4 mr-2' />
                        </InputAdornment>
                      )
                    }}
                    options={[
                      { value: 'all', label: 'All Categories' },
                      { value: 'Electronics', label: 'Electronics' },
                      { value: 'Wearables', label: 'Wearables' },
                      { value: 'Beauty', label: 'Beauty' },
                      { value: 'Photography', label: 'Photography' },
                      { value: 'Furniture', label: 'Furniture' }
                    ]}
                  />
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 200 }}>
                  <CustomSelectField
                    placeholder='Select sort by...'
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    label='Sort by'
                    options={[
                      { value: 'rating', label: 'Highest Rating' },
                      { value: 'reviews', label: 'Most Reviews' }
                    ]}
                  />
                </FormControl>
              </Box>
            </div>
          </Card>

          {/* Ratings Table */}
          <div className=''>
            <TableContainer component={Paper} sx={{ maxHeight: '500px' }} className='table-container'>
              <Table sx={{ minWidth: 650 }} aria-label='ratings table'>
                <TableHead>
                  <TableRow className='table-header-cell dark:table-header-cell' sx={{ minWidth: 150 }}>
                    <TableCell className='table-header-cell dark:table-header-cell'>Product</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Category</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Rating</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Total Ratings</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Trend</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRatings.map(rating => (
                    <TableRow
                      key={rating.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { bgcolor: 'rgba(55, 65, 81, 0.3)' },
                        borderColor: '#374151'
                      }}>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <div className='flex items-center gap-3'>
                          <div className='relative'>
                            <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-text-primary font-semibold shadow-lg shadow-purple-500/30'>
                              {rating.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <p className='font-medium'>{rating.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <span className='text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted/50'>{rating.category}</span>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <div className='flex items-center gap-2'>
                          {renderStars(rating.averageRating)}
                          <span className='text-lg font-bold'>{rating.averageRating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='font-medium'>{rating.totalRatings}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        {rating.trend !== 'stable' && (
                          <div className={`flex items-center gap-1 ${getTrendColor(rating.trend)}`}>
                            {getTrendIcon(rating.trend)}
                            <span className='font-medium'>{rating.trendValue.toFixed(1)}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Button
                          variant='outlined'
                          size='small'
                          startIcon={<Eye size={16} />}
                          onClick={() => setSelectedRating(rating)}
                          sx={{
                            color: '#10B981',
                            borderColor: '#10B981',
                            '&:hover': {
                              bgcolor: 'rgba(16, 185, 129, 0.1)',
                              borderColor: '#059669'
                            }
                          }}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-4'>
              <p className='text-sm text-muted-foreground'>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRatings.length)} of {filteredRatings.length} products
              </p>
            </div>
            {totalPages > 1 && (
              <div className='flex items-center gap-2'>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  sx={{
                    color: '#9CA3AF',
                    borderColor: '#374151',
                    '&:hover': {
                      bgcolor: 'rgba(55, 65, 81, 0.3)',
                      borderColor: '#6B7280'
                    }
                  }}>
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <div className='flex items-center gap-1'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'contained' : 'outlined'}
                      size='small'
                      onClick={() => setCurrentPage(page)}
                      sx={{
                        color: currentPage === page ? 'white' : '#9CA3AF',
                        borderColor: '#374151',
                        backgroundColor: currentPage === page ? '#10B981' : 'transparent',
                        '&:hover': {
                          bgcolor: currentPage === page ? '#059669' : 'rgba(16, 185, 129, 0.1)',
                          borderColor: currentPage === page ? '#059669' : '#10B981'
                        }
                      }}>
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  sx={{
                    color: '#9CA3AF',
                    borderColor: '#374151',
                    '&:hover': {
                      bgcolor: 'rgba(55, 65, 81, 0.3)',
                      borderColor: '#6B7280'
                    }
                  }}>
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Rating Details Modal */}
        <Dialog open={!!selectedRating} onOpenChange={() => setSelectedRating(null)}>
          <DialogContent className='max-w-3xl border-border/50'>
            <DialogHeader>
              <DialogTitle className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                Rating Details
              </DialogTitle>
            </DialogHeader>
            {selectedRating && (
              <div className='space-y-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='text-2xl font-bold mb-2'>{selectedRating.name}</h3>
                    <span className='text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted/50'>{selectedRating.category}</span>
                  </div>
                  {selectedRating.trend !== 'stable' && (
                    <div className={`flex items-center gap-2 text-lg ${getTrendColor(selectedRating.trend)}`}>
                      {getTrendIcon(selectedRating.trend)}
                      <span className='font-bold'>{selectedRating.trendValue.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <Card className='p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20'>
                    <p className='text-sm text-muted-foreground mb-2'>Average Rating</p>
                    <div className='flex items-center gap-3'>
                      {renderStars(selectedRating.averageRating)}
                      <span className='text-3xl font-bold'>{selectedRating.averageRating.toFixed(1)}</span>
                    </div>
                  </Card>
                  <Card className='p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20'>
                    <p className='text-sm text-muted-foreground mb-2'>Total Ratings</p>
                    <p className='text-3xl font-bold'>{selectedRating.totalRatings}</p>
                  </Card>
                </div>

                <div>
                  <h4 className='font-semibold mb-4'>Rating Distribution</h4>
                  <div className='space-y-3'>
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = selectedRating.ratingDistribution[star]
                      const percentage = (count / selectedRating.totalRatings) * 100

                      return (
                        <div key={star} className='flex items-center gap-4'>
                          <div className='flex items-center gap-2 w-20'>
                            <span className='text-sm font-medium'>{star}</span>
                            <Star className='h-4 w-4 text-amber-400 fill-amber-400' />
                          </div>
                          <div className='flex-1'>
                            <Progress value={percentage} className='h-3' />
                          </div>
                          <span className='text-sm font-medium w-24 text-right'>
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}
