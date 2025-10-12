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
  Tab,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { Eye, Mail, Phone, Calendar, MessageSquare } from 'lucide-react'
import CustomTextField from '@/Components/CustomTextField'

const mockContacts = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+1 (555) 234-5678',
    subject: 'Product Inquiry',
    message: "I'm interested in learning more about your premium products. Can you provide more details?",
    date: '2024-03-01',
    status: 'new'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+1 (555) 345-6789',
    subject: 'Order Issue',
    message: "I haven't received my order yet. Order number: #12345",
    date: '2024-02-28',
    status: 'replied'
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@example.com',
    phone: '+1 (555) 456-7890',
    subject: 'Partnership Opportunity',
    message: "I'd like to discuss a potential partnership with your company.",
    date: '2024-02-27',
    status: 'read'
  },
  {
    id: '4',
    name: 'James Brown',
    email: 'james@example.com',
    phone: '+1 (555) 567-8901',
    subject: 'Technical Support',
    message: "I'm having trouble accessing my account. Can you help?",
    date: '2024-02-26',
    status: 'new'
  }
]

export default function ContactList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(0) // Changed to use tab index
  const [selectedContact, setSelectedContact] = useState(null)

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase())

    // Map tab indices to status values
    const statusMap = ['all', 'new', 'read', 'replied']
    const selectedStatus = statusMap[statusFilter]
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const newCount = mockContacts.filter(c => c.status === 'new').length
  const readCount = mockContacts.filter(c => c.status === 'read').length
  const repliedCount = mockContacts.filter(c => c.status === 'replied').length

  return (
    <AuthenticatedLayout>
      <div className='py-4'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
          <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Contact List</h2>
        </div>
        <div className='space-y-6'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-secondary mb-1'>Total Messages</p>
                  <p className='text-3xl font-bold text-text-primary'>{mockContacts.length}</p>
                </div>
                <div className='w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center'>
                  <MessageSquare className='w-6 h-6 text-blue-500' />
                </div>
              </div>
            </Card>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-secondary mb-1'>New</p>
                  <p className='text-3xl font-bold text-text-primary'>{newCount}</p>
                </div>
                <div className='w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center'>
                  <Mail className='w-6 h-6 text-orange-500' />
                </div>
              </div>
            </Card>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-secondary mb-1'>Read</p>
                  <p className='text-3xl font-bold text-text-primary'>{readCount}</p>
                </div>
                <div className='w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center'>
                  <Eye className='w-6 h-6 text-yellow-500' />
                </div>
              </div>
            </Card>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-text-secondary mb-1'>Replied</p>
                  <p className='text-3xl font-bold text-text-primary'>{repliedCount}</p>
                </div>
                <div className='w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center'>
                  <MessageSquare className='w-6 h-6 text-green-500' />
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
                    placeholder='Search messages...'
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
                  <Tab label='New' />
                  <Tab label='Read' />
                  <Tab label='Replied' />
                </Tabs>
              </Box>
            </div>
          </Card>

          {/* Contacts Table */}
          <div className=''>
            <TableContainer component={Paper} sx={{ maxHeight: '500px' }} className='table-container'>
              <Table sx={{ minWidth: 650 }} aria-label='contacts table'>
                <TableHead>
                  <TableRow className='table-header-cell dark:table-header-cell' sx={{ minWidth: 150 }}>
                    <TableCell className='table-header-cell dark:table-header-cell'>Name</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Email</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Subject</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Date</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Status</TableCell>
                    <TableCell className='table-header-cell dark:table-header-cell'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredContacts.map(contact => (
                    <TableRow
                      key={contact.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { bgcolor: 'rgba(55, 65, 81, 0.3)' },
                        borderColor: '#374151'
                      }}>
                      <TableCell className='table-body-cell dark:table-body-cell'>{contact.name}</TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>{contact.email}</TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>{contact.subject}</TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calendar size={16} />
                          <Typography variant='body2'>{new Date(contact.date).toLocaleDateString()}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Chip
                          label={contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          size='small'
                          sx={{
                            bgcolor:
                              contact.status === 'new'
                                ? 'rgba(249, 115, 22, 0.1)'
                                : contact.status === 'read'
                                ? 'rgba(234, 179, 8, 0.1)'
                                : 'rgba(34, 197, 94, 0.1)',
                            color: contact.status === 'new' ? '#F97316' : contact.status === 'read' ? '#EAB308' : '#22C55E',
                            border: 'none',
                            '&:hover': {
                              bgcolor:
                                contact.status === 'new'
                                  ? 'rgba(249, 115, 22, 0.2)'
                                  : contact.status === 'read'
                                  ? 'rgba(234, 179, 8, 0.2)'
                                  : 'rgba(34, 197, 94, 0.2)'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className='table-body-cell dark:table-body-cell'>
                        <Button
                          variant='outlined'
                          size='small'
                          startIcon={<Eye size={16} />}
                          sx={{
                            padding: '7px 11px',
                            minWidth: '0px',
                            '& .MuiButton-startIcon': {
                              marginRight: 0,
                              marginLeft: 0
                            }
                          }}
                          onClick={() => setSelectedContact(contact)}></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      {/* Contact Details Dialog */}
      <Dialog
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1C252E',
            border: '1px solid #374151'
          }
        }}>
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }} className='text-text-primary'>
          Contact Message Details
        </DialogTitle>
        {selectedContact && (
          <DialogContent className='text-text-primary'>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <Box>
                  <Typography variant='body2' className='text-text-primary mb-1'>
                    Name
                  </Typography>
                  <Typography variant='body1' className='text-text-primary font-medium mb-1'>
                    {selectedContact.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' className='text-text-primary mb-1'>
                    Status
                  </Typography>
                  <Chip
                    label={selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                    size='small'
                    sx={{
                      bgcolor:
                        selectedContact.status === 'new'
                          ? 'rgba(249, 115, 22, 0.1)'
                          : selectedContact.status === 'read'
                          ? 'rgba(234, 179, 8, 0.1)'
                          : 'rgba(34, 197, 94, 0.1)',
                      color: selectedContact.status === 'new' ? '#F97316' : selectedContact.status === 'read' ? '#EAB308' : '#22C55E',
                      border: 'none'
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant='body2' className='text-text-primary mb-1'>
                    Email
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail size={16} />
                    <Typography variant='body1' className='text-text-primary font-medium mb-1'>
                      {selectedContact.email}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant='body2' className='text-text-primary mb-1'>
                    Phone
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={16} />
                    <Typography variant='body1' className='text-text-primary font-medium mb-1'>
                      {selectedContact.phone}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant='body2' className='text-text-primary mb-1'>
                    Subject
                  </Typography>
                  <Typography variant='body1' className='text-text-primary font-medium mb-1'>
                    {selectedContact.subject}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant='body2' className='text-text-primary mb-1'>
                    Message
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid #374151'
                    }}>
                    <Typography variant='body1' className='text-text-primary font-medium mb-1'>
                      {selectedContact.message}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant='body2' className='text-text-primary mb-1'>
                    Date
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} />
                    <Typography variant='body1' className='text-text-primary font-medium mb-1'>
                      {new Date(selectedContact.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            variant='outlined'
            onClick={() => setSelectedContact(null)}
            sx={{
              color: '#9CA3AF',
              borderColor: '#374151',
              '&:hover': {
                bgcolor: 'rgba(55, 65, 81, 0.3)',
                borderColor: '#6B7280'
              }
            }}>
            Close
          </Button>
          <Button variant='contained' startIcon={<Mail size={16} />} className='!bg-text-primary !text-primary-foreground'>
            Reply
          </Button>
        </DialogActions>
      </Dialog>
    </AuthenticatedLayout>
  )
}
