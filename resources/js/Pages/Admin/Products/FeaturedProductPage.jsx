import React from 'react'
import { FeaturedProducts } from '@/Components/FeaturedProducts'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function FeaturedProductPage() {
  return (
    <AuthenticatedLayout>
      <Head title='Featured Products' />
      <div className='py-4'>
        <FeaturedProducts />
      </div>
    </AuthenticatedLayout>
  )
}
