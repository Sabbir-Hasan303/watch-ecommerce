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
  Typography,
  FormControl,
  InputAdornment
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { Plus, Edit, Trash2, Eye, EyeOff, ImageIcon } from 'lucide-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'
import { useThemeContext } from '@/contexts/ThemeContext'

export default function BannerList() {
  const [banners, setBanners] = useState([
    {
      id: '1',
      title: 'Summer Sale 2024',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQdwJC_0cga_pfMbcCAdfTq_vCvtD3NYDESw&s',
      link: '/products/sale',
      position: 'Homepage Hero',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-08-31'
    },
    {
      id: '2',
      title: 'New Arrivals',
      image: 'https://i.pinimg.com/originals/02/87/d3/0287d3ba8b3330fca99f69e2001d3168.gif',
      link: '/products/new',
      position: 'Category Page',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newBanner, setNewBanner] = useState({
    status: 'active',
    position: 'Homepage Hero'
  })

  const { isDark } = useThemeContext()

  const filteredBanners = banners.filter(banner => banner.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddBanner = () => {
    if (newBanner.title && newBanner.image && newBanner.link) {
      setBanners([
        ...banners,
        {
          id: Date.now().toString(),
          title: newBanner.title,
          image: newBanner.image,
          link: newBanner.link,
          position: newBanner.position || 'Homepage Hero',
          status: newBanner.status || 'active',
          startDate: newBanner.startDate || new Date().toISOString().split('T')[0],
          endDate: newBanner.endDate || new Date().toISOString().split('T')[0]
        }
      ])
      setNewBanner({ status: 'active', position: 'Homepage Hero' })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteBanner = id => {
    setBanners(banners.filter(banner => banner.id !== id))
  }

  const toggleStatus = id => {
    setBanners(banners.map(banner => (banner.id === id ? { ...banner, status: banner.status === 'active' ? 'inactive' : 'active' } : banner)))
  }

  return (
    <AuthenticatedLayout>
      <div className='py-4'>
        <div className='space-y-6'>
          <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
            <div>
              <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Banners</h2>
              <p className='text-sm text-text-secondary mt-1'>Manage promotional banners and hero images</p>
            </div>
            <div>
              <Button variant='contained' onClick={() => setIsAddDialogOpen(true)} className='!bg-text-primary !text-primary-foreground'>
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
                  <div className='relative h-48 bg-gray-800'>
                    <img src={banner.image || '/placeholder.svg'} alt={banner.title} className='w-full h-full object-cover' />
                    <div className='absolute top-3 right-3 flex gap-2'>
                      <Button size='small' variant='contained' className='!bg-white !text-black' onClick={() => toggleStatus(banner.id)}>
                        {banner.status === 'active' ? <Eye className='w-4 h-4' /> : <EyeOff className='w-4 h-4' />}
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
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          banner.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                        {banner.status}
                      </span>
                    </div>
                    <div className='space-y-2 mb-4'>
                      <div className='flex items-center text-sm text-text-secondary'>
                        <span className='font-medium mr-2'>Link:</span>
                        <span className='truncate'>{banner.link}</span>
                      </div>
                      <div className='flex items-center text-sm text-text-secondary'>
                        <span className='font-medium mr-2'>Duration:</span>
                        <span>
                          {banner.startDate} to {banner.endDate}
                        </span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<Edit className='w-4 h-4' />}
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
                        onClick={() => handleDeleteBanner(banner.id)}
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
                <p className='text-sm text-text-secondary'>{searchQuery ? 'Try adjusting your search' : 'Add your first banner to get started'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Banner Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1C252E',
            border: '1px solid #374151'
          }
        }}>
        <DialogTitle className='text-text-primary font-medium'>Add New Banner</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#9CA3AF', mb: 2 }}>Create a new promotional banner for your site</DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CustomTextField
              label='Banner Title'
              placeholder='Enter banner title'
              value={newBanner.title || ''}
              onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
              fullWidth
            />
            <CustomTextField
              label='Image URL'
              placeholder='Enter image URL'
              value={newBanner.image || ''}
              onChange={e => setNewBanner({ ...newBanner, image: e.target.value })}
              fullWidth
            />
            <CustomTextField
              label='Link URL'
              placeholder='Enter destination URL'
              value={newBanner.link || ''}
              onChange={e => setNewBanner({ ...newBanner, link: e.target.value })}
              fullWidth
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <CustomSelectField
                label='Position'
                value={newBanner.position}
                onChange={e => setNewBanner({ ...newBanner, position: e.target.value })}
                options={[
                  { value: 'Homepage Hero', label: 'Homepage Hero' },
                  { value: 'Category Page', label: 'Category Page' },
                  { value: 'Product Page', label: 'Product Page' },
                  { value: 'Sidebar', label: 'Sidebar' }
                ]}
              />
              <CustomSelectField
                label='Status'
                value={newBanner.status}
                onChange={e => setNewBanner({ ...newBanner, status: e.target.value })}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ]}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <CustomTextField
                label='Start Date'
                type='date'
                value={newBanner.startDate || ''}
                onChange={e => setNewBanner({ ...newBanner, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <CustomTextField
                label='End Date'
                type='date'
                value={newBanner.endDate || ''}
                onChange={e => setNewBanner({ ...newBanner, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            variant='outlined'
            onClick={() => setIsAddDialogOpen(false)}
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
          <Button variant='contained' onClick={handleAddBanner} className='!bg-text-primary !text-primary-foreground'>
            Add Banner
          </Button>
        </DialogActions>
      </Dialog>
    </AuthenticatedLayout>
  )
}
