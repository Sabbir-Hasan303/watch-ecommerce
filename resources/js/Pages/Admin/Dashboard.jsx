import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { DollarSign, Users, Package2 as PackageIcon, ShoppingCart } from 'lucide-react'
import { AreaChart } from '@/Components/AreaChart'
import { BarChart } from '@/Components/BarChart'
import { DonutChart } from '@/Components/DonutChart'
import { LineChart } from '@/Components/LineChart'
import { NewAreaChart } from '@/Components/NewAreaChart'
// import { FeaturedProducts } from '@/Components/FeaturedProducts'
import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
// import { InventoryManagement } from './Admin/Inventory/InventoryDashboard'
// import { AccountsManagement } from './Admin/Accounts/AccountManagement'
import { Card } from '@mui/material'
import Taka from '@/Components/Taka'

export default function Dashboard({ stats, recentOrders, productSales, salesDistribution, revenueTrends, orderTrends, selectedPeriod = '6months', totalRevenue }) {
    const [activeSection, setActiveSection] = useState('dashboard')
    const [period, setPeriod] = useState(selectedPeriod)

    // Icon mapping from backend string to component
    const iconMap = {
        'DollarSign': DollarSign,
        'ShoppingCart': ShoppingCart,
        'Users': Users,
        'Package': PackageIcon,
        'PackageIcon': PackageIcon
    }

    // Sync period state when prop changes
    useEffect(() => {
        setPeriod(selectedPeriod)
    }, [selectedPeriod])

    const handlePeriodChange = (e) => {
        const newPeriod = e.target.value
        setPeriod(newPeriod)
        router.get('/admin/dashboard', { period: newPeriod }, {
            preserveState: true,
            preserveScroll: true,
            only: ['revenueTrends', 'orderTrends', 'selectedPeriod']
        })
    }


    return (
        <AuthenticatedLayout>
            <Head title='Dashboard' />

            <div className='py-4'>
                <div>
                    <div className='space-y-6'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6'>
                            {stats?.map((stat, index) => (
                                <Card
                                    key={index}
                                    className='!bg-card border border-border/40 p-6 hover:border-emerald-500/30 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden relative'
                                    style={{
                                        animationDelay: `${index * 100}ms`
                                    }}>
                                    <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500' />

                                    <div className='relative flex items-start justify-between'>
                                        <div className='flex-1'>
                                            <p className='text-sm text-muted-foreground mb-2 group-hover:text-text-primary/70 transition-colors'>{stat.title}</p>
                                            <h3 className='text-2xl md:text-3xl font-bold text-text-primary group-hover:text-emerald-400 transition-colors flex items-center gap-1'>
                                                {stat.title === 'Total Revenue' ? (
                                                    <>
                                                        <Taka color='text-text-primary' size='text-2xl md:text-3xl' />
                                                        <span>{stat.value.replace(/[$,]/g, '')}</span>
                                                    </>
                                                ) : (
                                                    <span>{stat.value}</span>
                                                )}
                                            </h3>
                                        </div>
                                        <div className='relative'>
                                            <div
                                                className={cn(
                                                    'absolute inset-0 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 bg-gradient-to-br',
                                                    stat.color
                                                )}
                                            />
                                            <div
                                                className={cn(
                                                    'relative w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg',
                                                    stat.color
                                                )}>
                                                {(() => {
                                                    const IconComponent = typeof stat.icon === 'string' ? iconMap[stat.icon] || DollarSign : stat.icon
                                                    return <IconComponent className='w-6 h-6 text-text-primary' />
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* <FeaturedProducts /> */}

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'>
                            {/* Recent Orders */}
                            <Card
                                className='!bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-left-4 hover:border-emerald-500/20 transition-all duration-500'
                                style={{ animationDelay: '400ms' }}>
                                <div className='flex items-center justify-between mb-6'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-text-primary'>Recent Orders</h3>
                                        <p className='text-sm text-muted-foreground mt-1'>Latest customer transactions</p>
                                    </div>
                                    <button className='px-4 py-2 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-all duration-300'>
                                        View All
                                    </button>
                                </div>
                                <div className='space-y-3'>
                                    {recentOrders?.map((order, index) => (
                                        <div
                                            key={order.id}
                                            className='flex items-center justify-between p-4 bg-foreground/5 rounded-xl hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-300 group cursor-pointer border border-transparent hover:border-emerald-500/20'
                                            style={{
                                                animationDelay: `${(index + 5) * 100}ms`
                                            }}>
                                            <div className='flex items-center gap-4 flex-1'>
                                                <div className='relative'>
                                                    <div className='absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity' />
                                                    <div className='relative w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg'>
                                                        <PackageIcon className='w-5 h-5 text-white' />
                                                    </div>
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <p className='text-sm font-medium text-text-primary group-hover:text-emerald-400 transition-colors truncate'>
                                                        {order.customer}
                                                    </p>
                                                    <p className='text-xs text-muted-foreground'>
                                                        Order #{order.id} • {order.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='text-right ml-4'>
                                                <p className='text-sm font-semibold text-text-primary flex items-center justify-end gap-1'>
                                                    <Taka color='text-text-primary' size='text-sm' />
                                                    <span>{(parseFloat(order.amount) || 0).toFixed(2)}</span>
                                                </p>
                                                <span
                                                    className={cn(
                                                        'inline-block px-2 py-1 text-xs font-medium rounded-full',
                                                        (order.status === 'Completed' || order.status === 'Delivered') && 'text-emerald-400 bg-emerald-500/10',
                                                        (order.status === 'Processing' || order.status === 'Confirmed' || order.status === 'Shipped') && 'text-blue-400 bg-blue-500/10',
                                                        order.status === 'Pending' && 'text-orange-400 bg-orange-500/10',
                                                        order.status === 'Cancelled' && 'text-red-400 bg-red-500/10'
                                                    )}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className='!bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-bottom-4' style={{ animationDelay: '500ms' }}>
                                <div className='flex items-center justify-between mb-6'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-text-primary'>Product Sales</h3>
                                        <p className='text-sm text-muted-foreground mt-1'>Top selling products</p>
                                    </div>
                                </div>
                                <BarChart data={productSales} />
                            </Card>

                            <Card className='!bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-bottom-4' style={{ animationDelay: '700ms' }}>
                                <h3 className='text-lg font-semibold text-text-primary mb-6'>Sales Distribution</h3>
                                <DonutChart data={salesDistribution} totalRevenue={totalRevenue ? totalRevenue.toFixed(2) : (stats?.[0]?.value?.replace(/[$,]/g, '') || '0')} />
                                <div className='mt-6 space-y-3'>
                                    {salesDistribution?.map((item, index) => (
                                        <div key={index} className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <div className={cn('w-3 h-3 rounded-full', item.color)} />
                                                <span className='text-sm text-muted-foreground'>{item.label}</span>
                                            </div>
                                            <span className='text-sm font-medium text-text-primary'>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className='!bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-bottom-4' style={{ animationDelay: '400ms' }}>
                                <div className='flex items-center justify-between mb-6'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-text-primary'>Revenue Overview</h3>
                                        <p className='text-sm text-muted-foreground mt-1'>Monthly revenue trends</p>
                                    </div>
                                    <select
                                        value={period}
                                        onChange={handlePeriodChange}
                                        className='px-3 py-1.5 bg-card border border-border/40 rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/50'>
                                        <option value='6months'>Last 6 months</option>
                                        <option value='year'>Last year</option>
                                    </select>
                                </div>
                                <AreaChart data={revenueTrends} />
                            </Card>
                        </div>

                        <div className='space-y-6'>
                            {/* Charts Grid */}
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                <div className='rounded-2xl border border-border/40 !bg-card p-6 shadow-sm animate-in fade-in slide-in-from-right-4'>
                                    <h3 className='mb-4 text-lg font-semibold text-text-primary'>Performance Trends</h3>
                                    <LineChart data={revenueTrends} />
                                </div>
                                <div className='rounded-2xl border border-border/40 !bg-card p-6 shadow-sm animate-in fade-in slide-in-from-left-4'>
                                    <h3 className='mb-4 text-lg font-semibold text-text-primary'>Order Trends</h3>
                                    <p className='text-sm text-muted-foreground mb-4'>Monthly order volume</p>
                                    <NewAreaChart data={orderTrends} dataKey='orders' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
