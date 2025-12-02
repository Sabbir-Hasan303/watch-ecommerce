import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { Card } from '@/Components/ui/card'
import { Button, TextField } from '@mui/material'
import { toast } from 'react-hot-toast'

export default function Google({ googleSettings }) {
    const [googleForm, setGoogleForm] = useState({
        analytics_script: googleSettings?.analytics_script || '',
        tag_manager_head_script: googleSettings?.tag_manager_head_script || '',
        tag_manager_body_script: googleSettings?.tag_manager_body_script || ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleGoogleChange = event => {
        const { name, value } = event.target
        setGoogleForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmitGoogle = () => {
        setIsSubmitting(true)
        router.put(route('admin.marketing.google.update'), googleForm, {
            onSuccess: () => {
                toast.success('Google settings updated successfully')
                setIsSubmitting(false)
            },
            onError: () => {
                toast.error('Failed to update Google settings')
                setIsSubmitting(false)
            }
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title='Google Integration' />
            <div className='py-4'>
                <div className='space-y-6 custom-container mx-auto md:px-[40px] md:py-[18px]'>
                    <div className='mb-6'>
                        <h2 className='text-2xl leading-9 font-bold text-text-primary mb-2'>Google Analytics & Tag Manager</h2>
                        <p className='text-sm text-muted-foreground'>
                            Configure your Google Analytics and Google Tag Manager scripts for tracking.
                        </p>
                    </div>

                    <Card className='p-6'>
                        <div className='space-y-6'>
                            <div>
                                <h3 className='text-lg font-semibold text-text-primary mb-4'>Google Analytics</h3>
                                <TextField
                                    label='Google Analytics Integration'
                                    name='analytics_script'
                                    value={googleForm.analytics_script}
                                    onChange={handleGoogleChange}
                                    fullWidth
                                    multiline
                                    minRows={6}
                                    placeholder='Paste your Google Analytics script here'
                                    helperText='Include the full script tag for Google Analytics 4'
                                />
                            </div>

                            <div className='border-t border-border pt-6'>
                                <h3 className='text-lg font-semibold text-text-primary mb-4'>Google Tag Manager</h3>
                                <div className='space-y-4'>
                                    <TextField
                                        label='GTM Head Script'
                                        name='tag_manager_head_script'
                                        value={googleForm.tag_manager_head_script}
                                        onChange={handleGoogleChange}
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        placeholder='Paste the GTM script for the &lt;head&gt; section'
                                        helperText='This script goes in the <head> section'
                                    />
                                    <TextField
                                        label='GTM Body Script'
                                        name='tag_manager_body_script'
                                        value={googleForm.tag_manager_body_script}
                                        onChange={handleGoogleChange}
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        placeholder='Paste the GTM noscript for after &lt;body&gt; tag'
                                        helperText='This script goes immediately after the opening <body> tag'
                                    />
                                </div>
                            </div>

                            <div className='border-t border-border pt-6 flex justify-end'>
                                <Button
                                    variant='outlined'
                                    onClick={handleSubmitGoogle}
                                    disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Google Settings'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

