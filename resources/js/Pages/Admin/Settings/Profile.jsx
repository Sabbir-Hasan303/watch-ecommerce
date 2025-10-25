import { React, useState } from 'react'
import { Button, InputAdornment } from '@mui/material'
import { Card } from '@/Components/ui/card'
import { User, Mail, Lock, Upload, Save, Eye, EyeOff } from 'lucide-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import CustomTextField from '@/Components/CustomTextField'
import { toast } from 'react-hot-toast'

export default function Profile({ user }) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [profileImage, setProfileImage] = useState(user?.profile_image || '/placeholder.svg?height=120&width=120')
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleImageUpload = e => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result)
            }
            reader.readAsDataURL(file)

            // Submit the image immediately
            const formData = new FormData()
            formData.append('profile_image', file)

            router.post(route('admin.settings.profile.image'), formData, {
                onSuccess: () => {
                    toast.success('Profile image updated successfully')
                },
                onError: (errors) => {
                    console.error('Error updating profile image:', errors)
                    toast.error(errors.profile_image)
                }
            })
        }
    }

    const handleProfileUpdate = () => {
        setIsSubmitting(true)

        router.put(route('admin.settings.profile.update'), {
            name,
            email,
            current_password: currentPassword || undefined,
            password: newPassword || undefined,
            password_confirmation: confirmPassword || undefined
        }, {
            onSuccess: () => {
                toast.success('Profile updated successfully')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
                setIsSubmitting(false)
            },
            onError: (errors) => {
                console.error('Error updating profile:', errors)
                toast.error('Failed to update profile')
                setIsSubmitting(false)
            }
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title='Profile' />
            <div className='py-4'>
                <div className='space-y-6 custom-container mx-auto md:px-[40px] md:py-[18px]'>
                    <div className='mb-6'>
                        <div>
                            <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Profile</h2>
                            <p className='text-sm text-muted-foreground'>Manage your profile</p>
                        </div>
                    </div>

                    {/* Profile Picture Section */}
                    <Card className='p-6'>
                        <div className='flex items-center gap-6'>
                            <div className='relative group'>
                                <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-lg shadow-emerald-500/10'>
                                    <img src={`/storage/${profileImage}`} alt='Profile' width={128} height={128} className='w-full h-full object-cover' />
                                </div>
                                <label
                                    htmlFor='profile-upload'
                                    className='absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                                    <Upload className='w-8 h-8 text-white' />
                                </label>
                                <input id='profile-upload' type='file' accept='image/*' className='hidden' onChange={handleImageUpload} />
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className='mt-6'>
                            <h2 className='text-xl font-semibold text-text-primary mb-6'>Personal Information</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-2'>
                                    <CustomTextField
                                        label='Full Name'
                                        name='name'
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <User className='w-4 h-4 mr-2' />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <CustomTextField
                                        label='Email'
                                        name='email'
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <Mail className='w-4 h-4 mr-2' />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                             {/* Change Password */}
                             <div className='mt-6'>
                                 <h2 className='text-xl font-semibold text-text-primary mb-6'>Change Password (Optional)</h2>
                                 <div className='space-y-6'>
                                     <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                         <div className='space-y-2'>
                                             <CustomTextField
                                                 label='Current Password'
                                                 name='currentPassword'
                                                 type={showCurrentPassword ? 'text' : 'password'}
                                                 value={currentPassword}
                                                 onChange={e => setCurrentPassword(e.target.value)}
                                                 InputProps={{
                                                     startAdornment: (
                                                         <InputAdornment position='start'>
                                                             <Lock className='w-4 h-4 mr-2' />
                                                         </InputAdornment>
                                                     ),
                                                     endAdornment: (
                                                         <InputAdornment position='end'>
                                                             <button
                                                                 type='button'
                                                                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                 className='text-muted-foreground hover:text-foreground transition-colors cursor-pointer'>
                                                                 {showCurrentPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                                             </button>
                                                         </InputAdornment>
                                                     )
                                                 }}
                                             />
                                         </div>
                                         <div className='space-y-2'>
                                             <CustomTextField
                                                 label='New Password'
                                                 name='newPassword'
                                                 type={showNewPassword ? 'text' : 'password'}
                                                 value={newPassword}
                                                 onChange={e => setNewPassword(e.target.value)}
                                                 InputProps={{
                                                     startAdornment: (
                                                         <InputAdornment position='start'>
                                                             <Lock className='w-4 h-4 mr-2' />
                                                         </InputAdornment>
                                                     ),
                                                     endAdornment: (
                                                         <InputAdornment position='end'>
                                                             <button
                                                                 type='button'
                                                                 onClick={() => setShowNewPassword(!showNewPassword)}
                                                                 className='text-muted-foreground hover:text-foreground transition-colors cursor-pointer'>
                                                                 {showNewPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                                             </button>
                                                         </InputAdornment>
                                                     )
                                                 }}
                                             />
                                         </div>
                                         <div className='space-y-2'>
                                             <CustomTextField
                                                 label='Confirm Password'
                                                 name='confirmPassword'
                                                 type={showConfirmPassword ? 'text' : 'password'}
                                                 value={confirmPassword}
                                                 onChange={e => setConfirmPassword(e.target.value)}
                                                 InputProps={{
                                                     startAdornment: (
                                                         <InputAdornment position='start'>
                                                             <Lock className='w-4 h-4 mr-2' />
                                                         </InputAdornment>
                                                     ),
                                                     endAdornment: (
                                                         <InputAdornment position='end'>
                                                             <button
                                                                 type='button'
                                                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                 className='text-muted-foreground hover:text-foreground transition-colors cursor-pointer'>
                                                                 {showConfirmPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                                             </button>
                                                         </InputAdornment>
                                                     )
                                                 }}
                                             />
                                         </div>
                                     </div>
                                     <p className='text-xs text-text-primary'>
                                         Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.
                                     </p>
                                 </div>
                             </div>

                             {/* Single Update Button */}
                             <div className='flex justify-end mt-6'>
                                 <Button
                                     variant='contained'
                                     className='!bg-text-primary !text-primary-foreground'
                                     onClick={handleProfileUpdate}
                                     disabled={isSubmitting}
                                 >
                                     <Save className='w-4 h-4 mr-2' />
                                     {isSubmitting ? 'Updating...' : 'Update Profile'}
                                 </Button>
                             </div>
                         </div>
                     </Card>
                 </div>
             </div>
         </AuthenticatedLayout>
     )
}
