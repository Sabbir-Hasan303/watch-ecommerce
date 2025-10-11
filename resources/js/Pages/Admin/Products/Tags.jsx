import { React, useState } from 'react'
import { Button, Card, FormControl, InputAdornment } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { Plus, Search, Edit, Trash2, TagIcon, Hash } from 'lucide-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CustomTextField from '@/Components/CustomTextField'

export default function Tags() {
  const [tags, setTags] = useState([
    {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      color: '#3B82F6',
      count: 45,
      description: 'Electronic devices and gadgets'
    },
    {
      id: '2',
      name: 'Fashion',
      slug: 'fashion',
      color: '#EC4899',
      count: 32,
      description: 'Clothing and accessories'
    },
    {
      id: '3',
      name: 'Home & Garden',
      slug: 'home-garden',
      color: '#10B981',
      count: 28,
      description: 'Home improvement and garden supplies'
    },
    {
      id: '4',
      name: 'Sports',
      slug: 'sports',
      color: '#F59E0B',
      count: 19,
      description: 'Sports equipment and apparel'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTag, setNewTag] = useState({
    color: '#3B82F6',
    count: 0
  })

  const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddTag = () => {
    if (newTag.name && newTag.slug) {
      setTags([
        ...tags,
        {
          id: Date.now().toString(),
          name: newTag.name,
          slug: newTag.slug,
          color: newTag.color || '#3B82F6',
          count: 0,
          description: newTag.description || ''
        }
      ])
      setNewTag({ color: '#3B82F6', count: 0 })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteTag = id => {
    setTags(tags.filter(tag => tag.id !== id))
  }

  const generateSlug = name => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <AuthenticatedLayout>
      <div className='py-4'>
        <div className='space-y-6'>
          <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
            <div>
              <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Tags</h2>
              <p className='text-sm text-gray-400 mt-1'>Organize content with tags and categories</p>
            </div>
            <div>
              <Button variant='outlined' onClick={() => setIsAddDialogOpen(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Add Tag
              </Button>
            </div>
          </div>

          <FormControl size='small' sx={{ minWidth: 200 }}>
            <CustomTextField
              placeholder='Search tags...'
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {filteredTags.map(tag => (
                <Card key={tag.id} className='bg-[#1C252E] border-white/10 p-4 hover:border-white/20 transition-colors'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='w-10 h-10 rounded-lg flex items-center justify-center' style={{ backgroundColor: `${tag.color}20` }}>
                      <Hash className='w-5 h-5' style={{ color: tag.color }} />
                    </div>
                    <div className='flex gap-1'>
                      <Button size='sm' variant='ghost' className='h-8 w-8 p-0 hover:bg-white/5'>
                        <Edit className='w-4 h-4 text-text-primary' />
                      </Button>
                      <Button size='sm' variant='ghost' onClick={() => handleDeleteTag(tag.id)} className='h-8 w-8 p-0 hover:bg-red-500/10'>
                        <Trash2 className='w-4 h-4 text-text-primary' />
                      </Button>
                    </div>
                  </div>
                  <h3 className='text-lg font-semibold text-text-primary mb-1'>{tag.name}</h3>
                  <p className='text-sm text-text-primary mb-3 line-clamp-2'>{tag.description}</p>
                  <div className='flex items-center justify-between pt-3 border-t border-white/5'>
                    <span className='text-xs text-text-primary'>/{tag.slug}</span>
                    <span className='text-sm font-medium text-text-primary'>{tag.count} items</span>
                  </div>
                </Card>
              ))}
            </div>

            {filteredTags.length === 0 && (
              <div className='flex flex-col items-center justify-center py-12'>
                <TagIcon className='w-16 h-16 text-text-primary mb-4' />
                <h3 className='text-lg font-semibold text-text-primary mb-2'>No tags found</h3>
                <p className='text-sm text-text-primary'>{searchQuery ? 'Try adjusting your search' : 'Create your first tag to get started'}</p>
              </div>
            )}
          </div>

          {/* Add Tag Dialog */}
          <Dialog
            open={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            maxWidth='sm'
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: '#1C252E',
                border: '1px solid #374151'
              }
            }}>
            <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }} className='text-text-primary'>
              Add New Tag
            </DialogTitle>
            <DialogContent className='text-text-primary'>
              <DialogContentText sx={{ color: '#9CA3AF', mb: 2 }} className='text-text-primary'>
                Create a new tag for organizing content
              </DialogContentText>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <CustomTextField
                    id='name'
                    label='Tag Name'
                    placeholder='Enter tag name'
                    value={newTag.name || ''}
                    onChange={e => {
                      const name = e.target.value
                      setNewTag({ ...newTag, name, slug: generateSlug(name) })
                    }}
                    fullWidth
                  />
                </div>
                <div className='space-y-2'>
                  <CustomTextField
                    id='slug'
                    label='Slug'
                    placeholder='tag-slug'
                    value={newTag.slug || ''}
                    onChange={e => setNewTag({ ...newTag, slug: e.target.value })}
                    fullWidth
                  />
                </div>
                <div className='space-y-2'>
                  <div className='flex gap-2'>
                    <CustomTextField
                      id='color'
                      type='color'
                      value={newTag.color || '#3B82F6'}
                      onChange={e => setNewTag({ ...newTag, color: e.target.value })}
                      sx={{ width: 80, height: 40 }}
                    />
                    <CustomTextField
                      label='Color'
                      value={newTag.color || '#3B82F6'}
                      onChange={e => setNewTag({ ...newTag, color: e.target.value })}
                      placeholder='#3B82F6'
                      fullWidth
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <CustomTextField
                    id='description'
                    label='Description'
                    placeholder='Enter tag description'
                    value={newTag.description || ''}
                    onChange={e => setNewTag({ ...newTag, description: e.target.value })}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }} className='text-text-primary'>
              <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button variant='outlined' onClick={handleAddTag}>
                Add Tag
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
