import { React, useState } from 'react'
import { Search, Star, ThumbsUp, MessageSquare, CheckCircle, XCircle, Clock, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Button, InputAdornment, FormControl, Box, Typography } from '@mui/material'
import { Badge } from '@/Components/ui/badge'
import { Card } from '@/Components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'

const mockReviews = [
  {
    id: '1',
    customer: { name: 'Sarah Johnson' },
    product: { name: 'Premium Wireless Headphones' },
    rating: 5,
    title: 'Excellent sound quality!',
    content:
      'These headphones exceeded my expectations. The sound quality is crystal clear, and the noise cancellation works perfectly. Highly recommend for anyone looking for premium audio experience.',
    date: '2024-01-15',
    status: 'approved',
    helpful: 24,
    verified: true
  },
  {
    id: '2',
    customer: { name: 'Michael Chen' },
    product: { name: 'Smart Fitness Watch' },
    rating: 4,
    title: 'Great features, minor issues',
    content:
      'The watch has amazing features and tracks everything accurately. Battery life is good. Only complaint is the app could be more intuitive.',
    date: '2024-01-16',
    status: 'approved',
    helpful: 18,
    verified: true
  },
  {
    id: '3',
    customer: { name: 'Emma Williams' },
    product: { name: 'Organic Skincare Set' },
    rating: 5,
    title: 'My skin has never looked better!',
    content:
      'After using this skincare set for a month, I can see a visible difference. My skin is smoother, more radiant, and the products smell amazing. Worth every penny!',
    date: '2024-01-17',
    status: 'pending',
    helpful: 0,
    verified: true
  },
  {
    id: '4',
    customer: { name: 'James Rodriguez' },
    product: { name: 'Professional Camera Lens' },
    rating: 5,
    title: 'Professional quality at a great price',
    content:
      "As a professional photographer, I'm very picky about my equipment. This lens delivers sharp, clear images with beautiful bokeh. The build quality is solid and it's surprisingly lightweight.",
    date: '2024-01-18',
    status: 'approved',
    helpful: 42,
    verified: true
  },
  {
    id: '5',
    customer: { name: 'Olivia Brown' },
    product: { name: 'Ergonomic Office Chair' },
    rating: 3,
    title: 'Decent but not perfect',
    content:
      'The chair is comfortable for short periods, but after sitting for 6+ hours, I start to feel some discomfort. The lumbar support could be better.',
    date: '2024-01-19',
    status: 'approved',
    helpful: 12,
    verified: false
  },
  {
    id: '6',
    customer: { name: 'David Kim' },
    product: { name: 'Gaming Keyboard' },
    rating: 2,
    title: 'Not worth the price',
    content: 'Keys feel cheap and the RGB lighting is inconsistent. Expected better quality for this price point.',
    date: '2024-01-20',
    status: 'pending',
    helpful: 0,
    verified: true
  }
]

export default function Reviews() {
  const [reviews, setReviews] = useState(mockReviews)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReview, setSelectedReview] = useState(null)
  const itemsPerPage = 10

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    const matchesRating = ratingFilter === 'all' || review.rating === Number.parseInt(ratingFilter)

    return matchesSearch && matchesStatus && matchesRating
  })

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage)

  const totalReviews = reviews.length
  const approvedReviews = reviews.filter(r => r.status === 'approved').length
  const pendingReviews = reviews.filter(r => r.status === 'pending').length
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  const handleApprove = id => {
    setReviews(reviews.map(r => (r.id === id ? { ...r, status: 'approved' } : r)))
  }

  const handleReject = id => {
    setReviews(reviews.map(r => (r.id === id ? { ...r, status: 'rejected' } : r)))
  }

  const renderStars = rating => {
    return (
      <div className='flex items-center gap-1'>
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} transition-colors`} />
        ))}
      </div>
    )
  }

  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return ''
    }
  }

  return (
    <AuthenticatedLayout>
      <Head title='Customer Reviews' />
      <div className='py-4'>
        <div className='mb-6'>
          <div>
            <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Customer Reviews</h2>
            <p className='text-sm text-muted-foreground'>Manage and moderate customer reviews</p>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card className='p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Total Reviews</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{totalReviews}</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <MessageSquare className='h-7 w-7 text-blue-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Approved</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{approvedReviews}</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <CheckCircle className='h-7 w-7 text-emerald-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Pending</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{pendingReviews}</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <Clock className='h-7 w-7 text-amber-400' />
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-primary'>Average Rating</p>
                  <p className='text-3xl font-bold mt-1 text-text-primary'>{averageRating}</p>
                </div>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm'>
                  <Star className='h-7 w-7 text-amber-400 fill-amber-400' />
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
                    placeholder='Search reviews by customer, product, or content...'
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
                    placeholder='Select status...'
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    label='Status'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Filter className='w-4 h-4 mr-2' />
                        </InputAdornment>
                      )
                    }}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'rejected', label: 'Rejected' }
                    ]}
                  />
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 200 }}>
                  <CustomSelectField
                    placeholder='Select rating...'
                    value={ratingFilter}
                    onChange={e => setRatingFilter(e.target.value)}
                    label='Rating'
                    options={[
                      { value: 'all', label: 'All Ratings' },
                      { value: '5', label: '5 Stars' },
                      { value: '4', label: '4 Stars' },
                      { value: '3', label: '3 Stars' },
                      { value: '2', label: '2 Stars' },
                      { value: '1', label: '1 Star' }
                    ]}
                  />
                </FormControl>
              </Box>
            </div>
          </Card>

          {/* Reviews Table */}
          <div className=''>
            <TableContainer component={Paper} sx={{ maxHeight: '500px' }} className='table-container'>
              <Table sx={{ minWidth: 650 }} aria-label='reviews table'>
                <TableHead>
                  <TableRow className='table-header-cell dark:table-header-cell' sx={{ minWidth: 150 }}>
                    <TableCell className='table-header-cell dark:table-header-cell'>Customer</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Product</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Rating</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Title</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Date</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Helpful</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Status</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReviews.map(review => (
                    <TableRow
                      key={review.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { bgcolor: 'rgba(55, 65, 81, 0.3)' },
                        borderColor: '#374151'
                      }}>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <div className='flex items-center gap-3'>
                          <div className='relative'>
                            <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-text-primary font-semibold shadow-lg shadow-amber-500/30'>
                              {review.customer.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <p className='font-medium'>{review.customer.name}</p>
                            {review.verified && (
                              <Badge variant='outline' className='bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs mt-1'>
                                <CheckCircle className='h-3 w-3 mr-1' />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='text-sm max-w-[200px] truncate'>{review.product.name}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>{renderStars(review.rating)}</TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='font-medium max-w-[250px] truncate'>{review.title}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <p className='text-sm text-muted-foreground'>{new Date(review.date).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <div className='flex items-center gap-1'>
                          <ThumbsUp className='h-4 w-4 text-muted-foreground' />
                          <span className='text-sm'>{review.helpful}</span>
                        </div>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Badge variant='outline' className={getStatusColor(review.status)}>
                          {review.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outlined'
                            size='small'
                            startIcon={<Eye size={16} />}
                            onClick={() => setSelectedReview(review)}
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
                          {review.status === 'pending' && (
                            <>
                              <Button
                                variant='outlined'
                                size='small'
                                startIcon={<CheckCircle size={16} />}
                                onClick={() => handleApprove(review.id)}
                                sx={{
                                  color: '#22C55E',
                                  borderColor: '#22C55E',
                                  '&:hover': {
                                    bgcolor: 'rgba(34, 197, 94, 0.1)',
                                    borderColor: '#16A34A'
                                  }
                                }}>
                                Approve
                              </Button>
                              <Button
                                variant='outlined'
                                size='small'
                                startIcon={<XCircle size={16} />}
                                onClick={() => handleReject(review.id)}
                                sx={{
                                  color: '#EF4444',
                                  borderColor: '#EF4444',
                                  '&:hover': {
                                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                                    borderColor: '#DC2626'
                                  }
                                }}>
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
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

        {/* Review Details Modal */}
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className='max-w-3xl border-border/50'>
            <DialogHeader>
              <DialogTitle className='text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent'>
                Review Details
              </DialogTitle>
            </DialogHeader>
            {selectedReview && (
              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white font-semibold text-2xl shadow-lg shadow-amber-500/30'>
                    {selectedReview.customer.name.charAt(0)}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h3 className='text-xl font-bold'>{selectedReview.customer.name}</h3>
                      {selectedReview.verified && (
                        <Badge variant='outline' className='bg-emerald-500/20 text-emerald-400 border-emerald-500/30'>
                          <CheckCircle className='h-3 w-3 mr-1' />
                          Verified Purchase
                        </Badge>
                      )}
                      <Badge variant='outline' className={getStatusColor(selectedReview.status)}>
                        {selectedReview.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className='text-muted-foreground'>{selectedReview.product.name}</p>
                    <p className='text-sm text-muted-foreground mt-1'>{new Date(selectedReview.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  {renderStars(selectedReview.rating)}
                  <h4 className='font-bold text-xl mt-3 mb-2'>{selectedReview.title}</h4>
                  <p className='text-muted-foreground leading-relaxed'>{selectedReview.content}</p>
                </div>

                <div className='flex items-center gap-4 pt-4 border-t border-border/50'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <ThumbsUp className='h-5 w-5' />
                    <span>{selectedReview.helpful} people found this helpful</span>
                  </div>
                </div>

                {selectedReview.status === 'pending' && (
                  <div className='flex items-center gap-3 pt-4 border-t border-border/50'>
                    <Button
                      onClick={() => {
                        handleApprove(selectedReview.id)
                        setSelectedReview(null)
                      }}
                      className='flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'>
                      <CheckCircle className='h-4 w-4 mr-2' />
                      Approve Review
                    </Button>
                    <Button
                      onClick={() => {
                        handleReject(selectedReview.id)
                        setSelectedReview(null)
                      }}
                      variant='outline'
                      className='flex-1 bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400'>
                      <XCircle className='h-4 w-4 mr-2' />
                      Reject Review
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}
