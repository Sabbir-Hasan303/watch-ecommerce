import { React } from 'react'
import { ArrowLeft, Package, Calendar, DollarSign, MapPin, ChevronRight } from 'lucide-react'
import { Button } from '@mui/material'
import { Badge } from '@/Components/ui/badge'
import { Card } from '@/Components/ui/card'
import { Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import Taka from '@/Components/Taka'

const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30'
}

export default function CustomerOrders({ customer, totalOrders, totalSpent, admin }) {
    const orders = customer.orders || []

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
                                    {customer.name} - {customer.email}
                                </p>
                            </div>
                            <div>
                                <Button
                                    variant='outline'
                                    onClick={() => router.visit(admin ? route('admin.orders.index') : route('admin.customers.index'))}
                                    className='flex items-center gap-2'
                                >
                                    <ArrowLeft className='h-4 w-4' />
                                    {admin ? 'Back to Orders' : 'Back to Customers'}
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
                                    <p className='text-3xl font-bold mt-1'>{totalOrders || 0}</p>
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
                                    <p className='text-2xl md:text-xl xl:text-3xl font-bold mt-1 flex items-center gap-1'><Taka color='text-green-600 dark:text-green-400' className='font-bold text-2xl md:text-xl xl:text-2xl' />{(totalSpent || 0).toFixed(2)}</p>
                                </div>
                                <div className='h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center'>
                                    <Taka color='text-green-600 dark:text-green-400' className='font-bold text-xl xl:text-3xl' />
                                </div>
                            </div>
                        </Card>
                        <Card className='p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Avg Order Value</p>
                                    <p className='text-2xl md:text-xl xl:text-3xl font-bold mt-1 flex items-center gap-2'><Taka color='text-purple-600 dark:text-purple-400' className='font-bold text-2xl md:text-xl xl:text-2xl' />{totalOrders > 0 ? ((totalSpent || 0) / totalOrders).toFixed(2) : '0.00'}</p>
                                </div>
                                <div className='h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center'>
                                    <Taka color='text-purple-600 dark:text-purple-400' className='font-bold text-2xl md:text-xl xl:text-3xl' />
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
                                {orders.map(order => {
                                    const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0
                                    const shippingAddress = order.shipping_address ? order.shipping_address.address_line : 'No address provided'

                                    return (
                                        <Card
                                            key={order.id}
                                            className='p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-border/50 group'>
                                            <div className='flex flex-col xl:flex-row xl:items-center flex-wrap justify-between gap-4'>
                                                <div className='flex-1 space-y-3'>
                                                    <div className='flex items-center gap-3 flex-wrap'>
                                                        <h3 className='text-lg font-semibold'>#{order.id}</h3>
                                                        <Badge className={statusColors[order.status] || statusColors.pending}>
                                                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                                                        </Badge>
                                                    </div>
                                                    <div className='flex flex-wrap gap-2 text-sm text-muted-foreground'>
                                                        <div className='flex items-center gap-2'>
                                                            <Calendar className='h-4 w-4' />
                                                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <Package className='h-4 w-4' />
                                                            <span>{totalItems} items</span>
                                                        </div>
                                                        <div className='flex items-center gap-2 md:col-span-2'>
                                                            <MapPin className='h-4 w-4' />
                                                            <span className='truncate'>{shippingAddress}</span>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <p className='text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1'><Taka color='text-green-600 dark:text-green-400 text-xl' />{(Number(order.total).toFixed(2) || 0)}</p>
                                                    </div>
                                                </div>
                                                <Link href={route('admin.orders.show', { id: order.id })}>
                                                    <Button
                                                        variant='outline'
                                                        className='w-full lg:w-auto hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all bg-transparent'>
                                                        View Details
                                                        <ChevronRight className='h-4 w-4 ml-2' />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
