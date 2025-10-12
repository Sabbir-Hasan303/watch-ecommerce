import { React, useState } from 'react'
import { Button, InputAdornment } from '@mui/material'
import { Card } from '@/components/ui/card'
import { User, Mail, Lock, Upload, Save, Eye, EyeOff, Phone } from 'lucide-react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import CustomTextField from '@/Components/CustomTextField'

export default function Profile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState('/placeholder.svg?height=120&width=120')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleImageUpload = e => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
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
            <h2 className='text-xl font-semibold text-text-primary mb-6'>Profile Picture</h2>
            <div className='flex items-center gap-6'>
              <div className='relative group'>
                <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-lg shadow-emerald-500/10'>
                  <img src={profileImage || '/placeholder.svg'} alt='Profile' width={128} height={128} className='w-full h-full object-cover' />
                </div>
                <label
                  htmlFor='profile-upload'
                  className='absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                  <Upload className='w-8 h-8 text-white' />
                </label>
                <input id='profile-upload' type='file' accept='image/*' className='hidden' onChange={handleImageUpload} />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-medium text-text-primary mb-2'>Upload New Picture</h3>
                <p className='text-sm text-muted-foreground mb-4'>Recommended: Square image, at least 400x400px in JPG or PNG format</p>
                <label htmlFor='profile-upload'>
                  <Button variant='outline' className='cursor-pointer bg-transparent' asChild>
                    <span>
                      <Upload className='w-4 h-4 mr-2' />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className='p-6'>
            <h2 className='text-xl font-semibold text-text-primary mb-6'>Personal Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <CustomTextField
                  label='First Name'
                  name='firstName'
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
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
                  label='Last Name'
                  name='lastName'
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
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
              <div className='space-y-2'>
                <CustomTextField
                  label='Phone Number'
                  name='phone'
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Phone className='w-4 h-4 mr-2' />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            </div>
            <div className='flex justify-end mt-6'>
              <Button variant='contained' className='!bg-text-primary !text-primary-foreground'>
                <Save className='w-4 h-4 mr-2' />
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Change Password */}
          <Card className='p-6'>
            <h2 className='text-xl font-semibold text-text-primary mb-6'>Change Password</h2>
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
            <div className='flex justify-end mt-6'>
              <Button variant='contained' className='!bg-text-primary !text-primary-foreground'>
                <Lock className='w-4 h-4 mr-2' />
                Update Password
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
