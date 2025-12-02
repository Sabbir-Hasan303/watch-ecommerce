import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { Card } from '@/Components/ui/card'
import { Button, Switch, TextField } from '@mui/material'
import { toast } from 'react-hot-toast'

export default function Meta({ metaSettings }) {
    const [metaForm, setMetaForm] = useState({
        dataset_id: metaSettings?.dataset_id || '',
        pixel_id: metaSettings?.pixel_id || '',
        access_token: metaSettings?.access_token || '',
        catalog: metaSettings?.catalog || '',
        test_event_code: metaSettings?.test_event_code || '',
        browser_tracking_enabled: !!metaSettings?.browser_tracking_enabled,
        server_tracking_enabled: !!metaSettings?.server_tracking_enabled
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleMetaChange = event => {
        const { name, value, type, checked } = event.target
        setMetaForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmitMeta = () => {
        setIsSubmitting(true)
        router.put(route('admin.marketing.meta.update'), metaForm, {
            onSuccess: () => {
                toast.success('Meta settings updated successfully')
                setIsSubmitting(false)
            },
            onError: () => {
                toast.error('Failed to update Meta settings')
                setIsSubmitting(false)
            }
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title='Meta Integration' />
            <div className='py-4'>
                <div className='space-y-6 custom-container mx-auto md:px-[40px] md:py-[18px]'>
                    <div className='mb-6'>
                        <h2 className='text-2xl leading-9 font-bold text-text-primary mb-2'>Meta (Facebook) Conversion API</h2>
                        <p className='text-sm text-muted-foreground'>
                            Configure your Facebook Conversion API settings for server-side tracking.
                        </p>
                    </div>

                    <Card className='p-6'>
                        <div className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <TextField
                                    label='Dataset ID (Pixel ID)'
                                    name='dataset_id'
                                    value={metaForm.dataset_id}
                                    onChange={handleMetaChange}
                                    fullWidth
                                    size='small'
                                    placeholder='Enter your Meta Pixel ID'
                                />
                                <TextField
                                    label='Pixel ID (optional)'
                                    name='pixel_id'
                                    value={metaForm.pixel_id}
                                    onChange={handleMetaChange}
                                    fullWidth
                                    size='small'
                                    placeholder='Additional pixel ID if needed'
                                />
                            </div>
                            <TextField
                                label='Access Token'
                                name='access_token'
                                value={metaForm.access_token}
                                onChange={handleMetaChange}
                                fullWidth
                                size='small'
                                multiline
                                minRows={3}
                                placeholder='Paste your Facebook access token here'
                            />
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <TextField
                                    label='Catalog'
                                    name='catalog'
                                    value={metaForm.catalog}
                                    onChange={handleMetaChange}
                                    fullWidth
                                    size='small'
                                    placeholder='Your product catalog ID'
                                />
                                <TextField
                                    label='Test Event Code'
                                    name='test_event_code'
                                    value={metaForm.test_event_code}
                                    onChange={handleMetaChange}
                                    fullWidth
                                    size='small'
                                    placeholder='Test event code for debugging'
                                />
                            </div>
                            <div className='border-t border-border pt-4 mt-6'>
                                <h3 className='text-lg font-semibold text-text-primary mb-4'>Tracking Options</h3>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div className='flex items-center gap-4'>
                                        <div className='flex items-center gap-2'>
                                            <Switch
                                                checked={metaForm.browser_tracking_enabled}
                                                onChange={event =>
                                                    handleMetaChange({
                                                        target: {
                                                            name: 'browser_tracking_enabled',
                                                            type: 'checkbox',
                                                            checked: event.target.checked
                                                        }
                                                    })
                                                }
                                            />
                                            <span className='text-sm'>Browser Side Tracking</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Switch
                                                checked={metaForm.server_tracking_enabled}
                                                onChange={event =>
                                                    handleMetaChange({
                                                        target: {
                                                            name: 'server_tracking_enabled',
                                                            type: 'checkbox',
                                                            checked: event.target.checked
                                                        }
                                                    })
                                                }
                                            />
                                            <span className='text-sm'>Server Side Tracking</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant='outlined'
                                        onClick={handleSubmitMeta}
                                        disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save Meta Settings'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

