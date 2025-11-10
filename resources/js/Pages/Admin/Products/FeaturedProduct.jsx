import React from 'react'
import { FeaturedProducts } from '@/Components/FeaturedProducts'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function FeaturedProduct({ featuredProducts = [], categories = [], statusOptions = [], flash }) {
  return (
    <AuthenticatedLayout flash={flash}>
      <Head title='Featured Products' />
      <div className='py-4 custom-container mx-auto md:px-[40px] md:py-[18px]'>
        <FeaturedProducts
          featuredProducts={featuredProducts}
          categories={categories}
          statusOptions={statusOptions}
        />
      </div>
    </AuthenticatedLayout>
  )
}
