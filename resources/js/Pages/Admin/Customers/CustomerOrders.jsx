import { React, useState } from 'react'
import { Menu, ArrowLeft, Package, Calendar, DollarSign, MapPin, ChevronRight } from 'lucide-react'
import { Button } from '@mui/material'
import { Badge } from '@/Components/ui/badge'
import { Card } from '@/Components/ui/card'
import { Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

// Mock data - this would typically come from props or API
const getMockUser = customerId => ({
  id: customerId,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  totalOrders: 12,
  totalSpent: 2450.0
})

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-10-15',
    status: 'delivered',
    total: 299.99,
    items: 3,
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-045',
    date: '2024-09-28',
    status: 'delivered',
    total: 149.5,
    items: 2,
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-089',
    date: '2024-09-10',
    status: 'cancelled',
    total: 89.99,
    items: 1,
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-123',
    date: '2024-08-22',
    status: 'delivered',
    total: 449.99,
    items: 5,
    shippingAddress: '123 Main St, New York, NY 10001'
  }
]

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30'
}

export default function CustomerOrders({ customerId }) {
  const [orders] = useState(mockOrders)
  const mockUser = getMockUser(customerId)

  return (
    <AuthenticatedLayout>
      <Head title='Order History' />
      <div className='py-4'>
        <div className='space-y-6'>
          <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4 w-full'>
              <div>
                <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6'>Order History</h2>
                <p className='text-sm text-muted-foreground'>
                  {mockUser.name} - {mockUser.email}
                </p>
              </div>
              <div>
                <Button variant='outline' onClick={() => router.visit('/customers')} className='flex items-center gap-2'>
                  <ArrowLeft className='h-4 w-4' />
                  Back to Customers
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card className='p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Total Orders</p>
                  <p className='text-3xl font-bold mt-1'>{mockUser.totalOrders}</p>
                </div>
                <div className='h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center'>
                  <Package className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
              </div>
            </Card>
            <Card className='p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Total Spent</p>
                  <p className='text-3xl font-bold mt-1'>${mockUser.totalSpent.toFixed(2)}</p>
                </div>
                <div className='h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center'>
                  <DollarSign className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
              </div>
            </Card>
            <Card className='p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Avg Order Value</p>
                  <p className='text-3xl font-bold mt-1'>${(mockUser.totalSpent / mockUser.totalOrders).toFixed(2)}</p>
                </div>
                <div className='h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center'>
                  <DollarSign className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                </div>
              </div>
            </Card>
          </div>

          {/* Orders List */}
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>All Orders</h2>
            {orders.length === 0 ? (
              <Card className='p-12 text-center'>
                <Package className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
                <p className='text-muted-foreground'>No orders found</p>
              </Card>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                {orders.map(order => (
                  <Card
                    key={order.id}
                    className='p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-border/50 group'>
                    <div className='flex flex-col xl:flex-row xl:items-center flex-wrap justify-between gap-4'>
                      <div className='flex-1 space-y-3'>
                        <div className='flex items-center gap-3 flex-wrap'>
                          <h3 className='text-lg font-semibold'>{order.orderNumber}</h3>
                          <Badge className={statusColors[order.status]}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
                        </div>
                        <div className='flex flex-wrap gap-2 text-sm text-muted-foreground'>
                          <div className='flex items-center gap-2'>
                            <Calendar className='h-4 w-4' />
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Package className='h-4 w-4' />
                            <span>{order.items} items</span>
                          </div>
                          <div className='flex items-center gap-2 md:col-span-2'>
                            <MapPin className='h-4 w-4' />
                            <span className='truncate'>{order.shippingAddress}</span>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <DollarSign className='h-5 w-5 text-green-600 dark:text-green-400' />
                          <span className='text-xl font-bold text-green-600 dark:text-green-400'>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <Button
                          variant='outline'
                          className='w-full lg:w-auto hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all bg-transparent'>
                          View Details
                          <ChevronRight className='h-4 w-4 ml-2' />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
