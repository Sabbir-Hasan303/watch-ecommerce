import { React, useState } from 'react'
import { Card, FormControl, InputAdornment } from '@mui/material'
import { Button } from '@mui/material'
import { Plus, Search, Edit, Trash2, HelpCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomTextField from '@/Components/CustomTextField'
import CustomSelectField from '@/Components/CustomSelectField'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'

export default function FaqList() {
  const [faqs, setFaqs] = useState([
    {
      id: '1',
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy for all unused items in their original packaging. Simply contact our support team to initiate a return.',
      category: 'Orders & Returns',
      order: 1,
      published: true
    },
    {
      id: '2',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery.',
      category: 'Shipping',
      order: 2,
      published: true
    },
    {
      id: '3',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates are calculated at checkout.',
      category: 'Shipping',
      order: 3,
      published: true
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFaq, setNewFaq] = useState({
    category: 'General',
    published: true,
    order: 1
  })

  const filteredFaqs = faqs.filter(
    faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([
        ...faqs,
        {
          id: Date.now().toString(),
          question: newFaq.question,
          answer: newFaq.answer,
          category: newFaq.category || 'General',
          order: newFaq.order || faqs.length + 1,
          published: newFaq.published ?? true
        }
      ])
      setNewFaq({ category: 'General', published: true, order: 1 })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteFaq = id => {
    setFaqs(faqs.filter(faq => faq.id !== id))
  }

  const togglePublished = id => {
    setFaqs(faqs.map(faq => (faq.id === id ? { ...faq, published: !faq.published } : faq)))
  }

  return (
    <AuthenticatedLayout>
      <div className='py-4'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
          <div>
            <h2 className='text-2xl leading-9 font-bold text-text-primary'>FAQs</h2>
            <p className='text-sm text-gray-400 mt-1'>Manage frequently asked questions</p>
          </div>
          <div className='flex items-center gap-3'>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className='w-4 h-4' />
              Add FAQ
            </Button>
          </div>
        </div>

        <FormControl size='small' sx={{ minWidth: 200, mb: 2 }}>
          <CustomTextField
            placeholder='Search FAQs...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search className='w-4 h-4' />
                </InputAdornment>
              )
            }}
          />
        </FormControl>

        <div className='space-y-6'>
          <div className='space-y-3'>
            {filteredFaqs.map(faq => (
              <Card key={faq.id} className='bg-[#1C252E] border-white/10 overflow-hidden'>
                <div className='p-4'>
                  <div className='flex items-start gap-3'>
                    <button onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)} className='flex-1 text-left'>
                      <div className='flex items-start gap-3'>
                        <div className='flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-0.5'>
                          <HelpCircle className='w-5 h-5 text-emerald-400' />
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-1'>
                            <h3 className='text-base font-semibold text-text-primary'>{faq.question}</h3>
                            <ChevronDown
                              className={cn('w-5 h-5 text-gray-400 transition-transform flex-shrink-0', expandedFaq === faq.id && 'rotate-180')}
                            />
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className='text-xs text-gray-500'>{faq.category}</span>
                            <span className='text-xs text-gray-600'>•</span>
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                faq.published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                              )}>
                              {faq.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className='flex gap-1 flex-shrink-0'>
                      <Button size='sm' variant='ghost' onClick={() => togglePublished(faq.id)} className='h-8 w-8 p-0 hover:bg-white/5'>
                        <Edit className='w-4 h-4 text-text-primary' />
                      </Button>
                      <Button size='sm' variant='ghost' onClick={() => handleDeleteFaq(faq.id)} className='h-8 w-8 p-0 hover:bg-red-500/10'>
                        <Trash2 className='w-4 h-4 text-text-primary' />
                      </Button>
                    </div>
                  </div>

                  {expandedFaq === faq.id && (
                    <div className='mt-3 pl-11 animate-in slide-in-from-top-2 duration-200'>
                      <p className='text-sm text-text-primary leading-relaxed'>{faq.answer}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className='flex flex-col items-center justify-center py-12'>
              <HelpCircle className='w-16 h-16 text-text-primary mb-4' />
              <h3 className='text-lg font-semibold text-text-primary mb-2'>No FAQs found</h3>
              <p className='text-sm text-text-primary'>
                {searchQuery ? 'Try adjusting your search' : 'Create your first FAQ to help your customers'}
              </p>
            </div>
          )}
        </div>

        {/* Add FAQ Dialog */}
        <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
          <DialogTitle>Add New FAQ</DialogTitle>
          <DialogContent>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <CustomTextField
                  label='Question'
                  placeholder='Enter the question'
                  value={newFaq.question || ''}
                  onChange={e => setNewFaq({ ...newFaq, question: e.target.value })}
                />
              </div>
              <div className='space-y-2'>
                <CustomTextField
                  label='Answer'
                  placeholder='Enter the answer'
                  value={newFaq.answer || ''}
                  multiline
                  rows={4}
                  onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <CustomSelectField
                    label='Category'
                    options={[
                      { label: 'General', value: 'General' },
                      { label: 'Orders & Returns', value: 'Orders & Returns' },
                      { label: 'Shipping', value: 'Shipping' },
                      { label: 'Payment', value: 'Payment' },
                      { label: 'Account', value: 'Account' }
                    ]}
                    value={newFaq.category}
                    onChange={e => setNewFaq({ ...newFaq, category: e.target.value })}
                  />
                </div>
                <div className='space-y-2'>
                  <CustomTextField
                    label='Order'
                    type='number'
                    placeholder='1'
                    value={newFaq.order || ''}
                    onChange={e => setNewFaq({ ...newFaq, order: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <div className='flex justify-end gap-3'>
              <Button variant='outline' onClick={() => setIsAddDialogOpen(false)} className='border-white/10'>
                Cancel
              </Button>
              <Button onClick={handleAddFaq}>Add FAQ</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}
