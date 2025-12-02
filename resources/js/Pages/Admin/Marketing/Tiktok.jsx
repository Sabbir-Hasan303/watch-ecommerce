import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { Card } from '@/Components/ui/card'
import { Button, TextField } from '@mui/material'
import { toast } from 'react-hot-toast'

export default function Tiktok({ tiktokSettings }) {
    const [tiktokForm, setTiktokForm] = useState({
        pixel_script: tiktokSettings?.pixel_script || ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleTiktokChange = event => {
        const { name, value } = event.target
        setTiktokForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmitTiktok = () => {
        setIsSubmitting(true)
        router.put(route('admin.marketing.tiktok.update'), tiktokForm, {
            onSuccess: () => {
                toast.success('TikTok settings updated successfully')
                setIsSubmitting(false)
            },
            onError: () => {
                toast.error('Failed to update TikTok settings')
                setIsSubmitting(false)
            }
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title='TikTok Integration' />
            <div className='py-4'>
                <div className='space-y-6 custom-container mx-auto md:px-[40px] md:py-[18px]'>
                    <div className='mb-6'>
                        <h2 className='text-2xl leading-9 font-bold text-text-primary mb-2'>TikTok Pixel</h2>
                        <p className='text-sm text-muted-foreground'>
                            Configure your TikTok Pixel script for conversion tracking and audience building.
                        </p>
                    </div>

                    <Card className='p-6'>
                        <div className='space-y-4'>
                            <TextField
                                label='TikTok Pixel Script'
                                name='pixel_script'
                                value={tiktokForm.pixel_script}
                                onChange={handleTiktokChange}
                                fullWidth
                                multiline
                                minRows={10}
                                placeholder='Paste your TikTok Pixel script here'
                                helperText='Include the complete script tag provided by TikTok Business Center'
                            />

                            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4'>
                                <h4 className='font-semibold text-blue-900 dark:text-blue-100 mb-2'>Script Format</h4>
                                <p className='text-sm text-blue-800 dark:text-blue-200'>
                                    Paste your TikTok Pixel tracking code starting with the comment and including the full script tag. You can get this from your TikTok Ads Manager &gt; Events &gt; Pixel &gt; Track Conversions.
                                </p>
                            </div>

                            <div className='border-t border-border pt-6 flex justify-end'>
                                <Button
                                    variant='outlined'
                                    onClick={handleSubmitTiktok}
                                    disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save TikTok Settings'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

