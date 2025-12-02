import { React, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Box,
  Typography,
  Chip,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { Download, Mail, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import CustomTextField from '@/Components/CustomTextField'

const mockSubscribers = [
  {
    id: '1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    subscribedDate: '2024-01-15',
    status: 'active',
    source: 'Homepage'
  },
  {
    id: '2',
    email: 'bob@example.com',
    name: 'Bob Smith',
    subscribedDate: '2024-01-20',
    status: 'active',
    source: 'Blog'
  },
  {
    id: '3',
    email: 'charlie@example.com',
    name: 'Charlie Brown',
    subscribedDate: '2024-02-01',
    status: 'unsubscribed',
    source: 'Popup'
  },
  {
    id: '4',
    email: 'diana@example.com',
    name: 'Diana Prince',
    subscribedDate: '2024-02-10',
    status: 'active',
    source: 'Footer'
  },
  {
    id: '5',
    email: 'edward@example.com',
    name: 'Edward Norton',
    subscribedDate: '2024-02-15',
    status: 'active',
    source: 'Checkout'
  }
]

export default function Newsletters() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(0) // Changed to use tab index

  const filteredSubscribers = mockSubscribers.filter(subscriber => {
    const matchesSearch =
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) || subscriber.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Map tab indices to status values
    const statusMap = ['', 'active', 'unsubscribed']
    const selectedStatus = statusMap[statusFilter]
    const matchesStatus = selectedStatus === '' || subscriber.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const activeCount = mockSubscribers.filter(s => s.status === 'active').length
  const unsubscribedCount = mockSubscribers.filter(s => s.status === 'unsubscribed').length

  return (
    <AuthenticatedLayout>
      <div className='py-4'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
          <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Newsletter List</h2>
        </div>
        <div className='space-y-6'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-secondary mb-1'>Total Subscribers</p>
                  <p className='text-3xl font-bold text-text-primary'>{mockSubscribers.length}</p>
                </div>
                <div className='w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center'>
                  <Mail className='w-6 h-6 text-emerald-500' />
                </div>
              </div>
            </Card>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-secondary mb-1'>Active</p>
                  <p className='text-3xl font-bold text-text-primary'>{activeCount}</p>
                </div>
                <div className='w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center'>
                  <CheckCircle2 className='w-6 h-6 text-green-500' />
                </div>
              </div>
            </Card>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-secondary mb-1'>Unsubscribed</p>
                  <p className='text-3xl font-bold text-text-primary'>{unsubscribedCount}</p>
                </div>
                <div className='w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center'>
                  <XCircle className='w-6 h-6 text-red-500' />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className='p-6'>
            <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
              <div className='flex-1 w-full md:max-w-md'>
                <div className='relative'>
                  <CustomTextField
                    placeholder='Search by email or name...'
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
                <Tabs
                  value={statusFilter}
                  onChange={(event, newValue) => setStatusFilter(newValue)}
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#10B981'
                    },
                    '& .MuiTab-root': {
                      color: '#9CA3AF',
                      textTransform: 'none',
                      fontWeight: 500,
                      minHeight: 40,
                      '&.Mui-selected': {
                        color: '#10B981'
                      },
                      '&:hover': {
                        color: '#6B7280'
                      }
                    }
                  }}>
                  <Tab label='All' />
                  <Tab label='Active' />
                  <Tab label='Unsubscribed' />
                </Tabs>
              </Box>
            </div>
          </Card>

          {/* Subscribers Table */}
          <div className=''>
            <TableContainer component={Paper} sx={{ maxHeight: '500px' }} className='table-container'>
              <Table sx={{ minWidth: 650 }} aria-label='subscribers table'>
                <TableHead>
                  <TableRow className='table-header-cell dark:table-header-cell' sx={{ minWidth: 150 }}>
                    <TableCell className='table-header-cell dark:table-header-cell'>Name</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Email</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Source</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Subscribed Date</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSubscribers.map(subscriber => (
                    <TableRow
                      key={subscriber.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { bgcolor: 'rgba(55, 65, 81, 0.3)' },
                        borderColor: '#374151'
                      }}>
                      <TableCell className='table-body-cell dark:table-body-cell'>{subscriber.name}</TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>{subscriber.email}</TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Chip label={subscriber.source} variant='outlined' size='small' />
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calendar size={16} />
                          <Typography variant='body2'>{new Date(subscriber.subscribedDate).toLocaleDateString()}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Chip
                          label={subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
                          size='small'
                          sx={{
                            bgcolor: subscriber.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: subscriber.status === 'active' ? '#22C55E' : '#EF4444',
                            border: 'none',
                            '&:hover': {
                              bgcolor: subscriber.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
