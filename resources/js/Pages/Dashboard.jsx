import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { DollarSign, Users, Package, ArrowUpRight, ArrowDownRight, ShoppingCart } from 'lucide-react'
import { AreaChart } from '@/Components/AreaChart'
import { BarChart } from '@/Components/BarChart'
import { DonutChart } from '@/Components/DonutChart'
import { LineChart } from '@/Components/LineChart'
import { NewAreaChart } from '@/Components/NewAreaChart'
import { FeaturedProducts } from '@/Components/FeaturedProducts'
import { useState } from 'react'
import { InventoryManagement } from './Admin/Inventory/InventoryDashboard'
import { AccountsManagement } from './Admin/Accounts/AccountManagement'
import { Card } from '@mui/material'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      description: 'vs last month'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      description: 'vs last month'
    },
    {
      title: 'Total Customers',
      value: '8,549',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      description: 'vs last month'
    },
    {
      title: 'Active Products',
      value: '456',
      change: '+12.5%',
      trend: 'up',
      icon: Package,
      color: 'from-orange-500 to-red-500',
      description: 'vs last month'
    }
  ]

  const recentOrders = [
    {
      id: '1001',
      customer: 'John Smith',
      amount: 234.5,
      status: 'Completed',
      time: '2 hours ago'
    },
    {
      id: '1002',
      customer: 'Sarah Johnson',
      amount: 456.0,
      status: 'Processing',
      time: '3 hours ago'
    },
    {
      id: '1003',
      customer: 'Mike Wilson',
      amount: 189.99,
      status: 'Completed',
      time: '5 hours ago'
    },
    {
      id: '1004',
      customer: 'Emily Brown',
      amount: 678.25,
      status: 'Pending',
      time: '6 hours ago'
    },
    {
      id: '1005',
      customer: 'David Lee',
      amount: 345.75,
      status: 'Completed',
      time: '8 hours ago'
    }
  ]

  const topProducts = [
    {
      name: 'Wireless Headphones',
      sales: 1234,
      revenue: '$45,231',
      trend: '+12%'
    },
    { name: 'Smart Watch', sales: 987, revenue: '$38,456', trend: '+8%' },
    { name: 'Laptop Stand', sales: 756, revenue: '$22,680', trend: '+15%' },
    { name: 'USB-C Cable', sales: 654, revenue: '$9,810', trend: '+5%' }
  ]

  return (
    <AuthenticatedLayout>
      <Head title='Dashboard' />

      <div className='py-4'>
        <div>
          {/* <div className='flex items-center gap-3 p-1 border border-border/40 rounded-xl w-fit'>
            <button
              onClick={() => setActiveSection('dashboard')}
              className={cn(
                'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
                activeSection === 'dashboard'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-text-primary shadow-lg shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-text-primary hover:bg-foreground/5'
              )}>
              Dashboard
            </button>
            <button
              onClick={() => setActiveSection('inventory')}
              className={cn(
                'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
                activeSection === 'inventory'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-text-primary shadow-lg shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-text-primary hover:bg-foreground/5'
              )}>
              Inventory Management
            </button>
            <button
              onClick={() => setActiveSection('accounts')}
              className={cn(
                'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
                activeSection === 'accounts'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-text-primary shadow-lg shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-text-primary hover:bg-foreground/5'
              )}>
              Accounts
            </button>
          </div> */}

          <div className='space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className='bg-card border border-border/40 p-6 hover:border-emerald-500/30 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden relative'
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}>
                  <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500' />

                  <div className='relative flex items-start justify-between'>
                    <div className='flex-1'>
                      <p className='text-sm text-muted-foreground mb-2 group-hover:text-text-primary/70 transition-colors'>{stat.title}</p>
                      <h3 className='text-2xl md:text-3xl font-bold text-text-primary mb-2 group-hover:text-emerald-400 transition-colors'>
                        {stat.value}
                      </h3>
                      <div className='flex items-center gap-1'>
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className='w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
                        ) : (
                          <ArrowDownRight className='w-4 h-4 text-red-500' />
                        )}
                        <span className={cn('text-sm font-medium', stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>{stat.change}</span>
                        <span className='text-sm text-muted-foreground'>{stat.description}</span>
                      </div>
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
                        <stat.icon className='w-6 h-6 text-text-primary' />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* <FeaturedProducts /> */}

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
              {/* Recent Orders */}
              <Card
                className='bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-left-4 hover:border-emerald-500/20 transition-all duration-500'
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
                  {recentOrders.map((order, index) => (
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
                            <Package className='w-5 h-5 text-white' />
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
                        <p className='text-sm font-semibold text-text-primary'>${order.amount.toFixed(2)}</p>
                        <span
                          className={cn(
                            'inline-block px-2 py-1 text-xs font-medium rounded-full',
                            order.status === 'Completed' && 'text-emerald-400 bg-emerald-500/10',
                            order.status === 'Processing' && 'text-blue-400 bg-blue-500/10',
                            order.status === 'Pending' && 'text-orange-400 bg-orange-500/10'
                          )}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Products */}
              <Card
                className='bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-right-4 hover:border-emerald-500/20 transition-all duration-500'
                style={{ animationDelay: '500ms' }}>
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold text-text-primary'>Top Products</h3>
                  <p className='text-sm text-muted-foreground mt-1'>Best selling items</p>
                </div>
                <div className='space-y-4'>
                  {topProducts.map((product, index) => (
                    <div key={index} className='group cursor-pointer'>
                      <div className='flex items-center justify-between mb-2'>
                        <p className='text-sm font-medium text-text-primary group-hover:text-emerald-400 transition-colors'>{product.name}</p>
                        <span className='text-xs text-emerald-400 font-medium'>{product.trend}</span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='flex-1 h-2 bg-foreground/5 rounded-full overflow-hidden'>
                          <div
                            className='h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50'
                            style={{
                              width: `${(product.sales / 1234) * 100}%`
                            }}
                          />
                        </div>
                        <span className='text-xs text-muted-foreground min-w-[60px] text-right'>{product.sales} sales</span>
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>{product.revenue} revenue</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className='bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-bottom-4' style={{ animationDelay: '500ms' }}>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-text-primary'>Product Sales</h3>
                    <p className='text-sm text-muted-foreground mt-1'>Sales by category</p>
                  </div>
                </div>
                <BarChart />
              </Card>
            </div>

            <div className='space-y-6'>
              {/* Stats Grid */}
              {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className='bg-card border border-border/40 p-6 hover:border-emerald-500/30 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4'
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <p className='text-sm text-muted-foreground mb-2'>{stat.title}</p>
                        <h3 className='text-3xl font-bold text-text-primary mb-2'>{stat.value}</h3>
                        <div className='flex items-center gap-1'>
                          {stat.trend === 'up' ? (
                            <ArrowUpRight className='w-4 h-4 text-emerald-500' />
                          ) : (
                            <ArrowDownRight className='w-4 h-4 text-red-500' />
                          )}
                          <span className={cn('text-sm font-medium', stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>{stat.change}</span>
                          <span className='text-sm text-muted-foreground'>vs last month</span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br transition-transform duration-300 group-hover:scale-110',
                          stat.color
                        )}>
                        <stat.icon className='w-6 h-6 text-text-primary' />
                      </div>
                    </div>
                  </Card>
                ))}
              </div> */}

              {/* Charts Grid */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card className='bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-bottom-4' style={{ animationDelay: '400ms' }}>
                  <div className='flex items-center justify-between mb-6'>
                    <div>
                      <h3 className='text-lg font-semibold text-text-primary'>Revenue Overview</h3>
                      <p className='text-sm text-muted-foreground mt-1'>Monthly revenue trends</p>
                    </div>
                    <select className='px-3 py-1.5 bg-foreground/5 border border-border/40 rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/50'>
                      <option>Last 6 months</option>
                      <option>Last year</option>
                    </select>
                  </div>
                  <AreaChart />
                </Card>

                <Card className='bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-bottom-4' style={{ animationDelay: '700ms' }}>
                  <h3 className='text-lg font-semibold text-text-primary mb-6'>Sales Distribution</h3>
                  <DonutChart />
                  <div className='mt-6 space-y-3'>
                    {[
                      {
                        label: 'Electronics',
                        value: '45%',
                        color: 'bg-emerald-500'
                      },
                      {
                        label: 'Clothing',
                        value: '30%',
                        color: 'bg-blue-500'
                      },
                      {
                        label: 'Food',
                        value: '15%',
                        color: 'bg-purple-500'
                      },
                      {
                        label: 'Others',
                        value: '10%',
                        color: 'bg-orange-500'
                      }
                    ].map((item, index) => (
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
              </div>

              <div className='grid gap-6 lg:grid-cols-2'>
                <div className='rounded-2xl border border-border/40 bg-card p-6 shadow-sm animate-in fade-in slide-in-from-left-4'>
                  <h3 className='mb-4 text-lg font-semibold text-text-primary'>Revenue Overview</h3>
                  <NewAreaChart />
                </div>
                <div className='rounded-2xl border border-border/40 bg-card p-6 shadow-sm animate-in fade-in slide-in-from-right-4'>
                  <h3 className='mb-4 text-lg font-semibold text-text-primary'>Performance Trends</h3>
                  <LineChart />
                </div>
              </div>
            </div>
          </div>

          {/* {activeSection === 'accounts' ? (
            <AccountsManagement />
          ) : activeSection === 'inventory' ? (
            <InventoryManagement />
          ) : (
            <div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className='bg-card border border-border/40 p-6 hover:border-emerald-500/30 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden relative'
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}>
                    <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500' />

                    <div className='relative flex items-start justify-between'>
                      <div className='flex-1'>
                        <p className='text-sm text-muted-foreground mb-2 group-hover:text-text-primary/70 transition-colors'>{stat.title}</p>
                        <h3 className='text-2xl md:text-3xl font-bold text-text-primary mb-2 group-hover:text-emerald-400 transition-colors'>
                          {stat.value}
                        </h3>
                        <div className='flex items-center gap-1'>
                          {stat.trend === 'up' ? (
                            <ArrowUpRight className='w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
                          ) : (
                            <ArrowDownRight className='w-4 h-4 text-red-500' />
                          )}
                          <span className={cn('text-sm font-medium', stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>{stat.change}</span>
                          <span className='text-sm text-muted-foreground'>{stat.description}</span>
                        </div>
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
                          <stat.icon className='w-6 h-6 text-text-primary' />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <FeaturedProducts />

              <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
                <Card
                  className='bg-card border border-border/40 p-6 lg:col-span-2 animate-in fade-in slide-in-from-left-4 hover:border-emerald-500/20 transition-all duration-500'
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
                    {recentOrders.map((order, index) => (
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
                              <Package className='w-5 h-5 text-white' />
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
                          <p className='text-sm font-semibold text-text-primary'>${order.amount.toFixed(2)}</p>
                          <span
                            className={cn(
                              'inline-block px-2 py-1 text-xs font-medium rounded-full',
                              order.status === 'Completed' && 'text-emerald-400 bg-emerald-500/10',
                              order.status === 'Processing' && 'text-blue-400 bg-blue-500/10',
                              order.status === 'Pending' && 'text-orange-400 bg-orange-500/10'
                            )}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card
                  className='bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-right-4 hover:border-emerald-500/20 transition-all duration-500'
                  style={{ animationDelay: '500ms' }}>
                  <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-text-primary'>Top Products</h3>
                    <p className='text-sm text-muted-foreground mt-1'>Best selling items</p>
                  </div>
                  <div className='space-y-4'>
                    {topProducts.map((product, index) => (
                      <div key={index} className='group cursor-pointer'>
                        <div className='flex items-center justify-between mb-2'>
                          <p className='text-sm font-medium text-text-primary group-hover:text-emerald-400 transition-colors'>{product.name}</p>
                          <span className='text-xs text-emerald-400 font-medium'>{product.trend}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <div className='flex-1 h-2 bg-foreground/5 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50'
                              style={{
                                width: `${(product.sales / 1234) * 100}%`
                              }}
                            />
                          </div>
                          <span className='text-xs text-muted-foreground min-w-[60px] text-right'>{product.sales} sales</span>
                        </div>
                        <p className='text-xs text-muted-foreground mt-1'>{product.revenue} revenue</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {stats.map((stat, index) => (
                    <Card
                      key={index}
                      className='bg-card border border-border/40 p-6 hover:border-emerald-500/30 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4'
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <p className='text-sm text-muted-foreground mb-2'>{stat.title}</p>
                          <h3 className='text-3xl font-bold text-text-primary mb-2'>{stat.value}</h3>
                          <div className='flex items-center gap-1'>
                            {stat.trend === 'up' ? (
                              <ArrowUpRight className='w-4 h-4 text-emerald-500' />
                            ) : (
                              <ArrowDownRight className='w-4 h-4 text-red-500' />
                            )}
                            <span className={cn('text-sm font-medium', stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>
                              {stat.change}
                            </span>
                            <span className='text-sm text-muted-foreground'>vs last month</span>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br transition-transform duration-300 group-hover:scale-110',
                            stat.color
                          )}>
                          <stat.icon className='w-6 h-6 text-text-primary' />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <Card className='bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-bottom-4' style={{ animationDelay: '400ms' }}>
                    <div className='flex items-center justify-between mb-6'>
                      <div>
                        <h3 className='text-lg font-semibold text-text-primary'>Revenue Overview</h3>
                        <p className='text-sm text-muted-foreground mt-1'>Monthly revenue trends</p>
                      </div>
                      <select className='px-3 py-1.5 bg-foreground/5 border border-border/40 rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/50'>
                        <option>Last 6 months</option>
                        <option>Last year</option>
                      </select>
                    </div>
                    <AreaChart />
                  </Card>

                  <Card className='bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-bottom-4' style={{ animationDelay: '500ms' }}>
                    <div className='flex items-center justify-between mb-6'>
                      <div>
                        <h3 className='text-lg font-semibold text-text-primary'>Product Sales</h3>
                        <p className='text-sm text-muted-foreground mt-1'>Sales by category</p>
                      </div>
                    </div>
                    <BarChart />
                  </Card>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                  <Card
                    className='bg-card border border-border/40 p-6 lg:col-span-2 animate-in fade-in slide-in-from-bottom-4'
                    style={{ animationDelay: '600ms' }}>
                    <h3 className='text-lg font-semibold text-text-primary mb-6'>Recent Orders</h3>
                    <div className='space-y-4'>
                      {[1, 2, 3, 4, 5].map(item => (
                        <div
                          key={item}
                          className='flex items-center justify-between p-4 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-all duration-300 group'>
                          <div className='flex items-center gap-4'>
                            <div className='w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center'>
                              <Package className='w-5 h-5 text-white' />
                            </div>
                            <div>
                              <p className='text-sm font-medium text-text-primary'>Order #{1000 + item}</p>
                              <p className='text-xs text-muted-foreground'>2 hours ago</p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='text-sm font-semibold text-text-primary'>${(Math.random() * 500 + 100).toFixed(2)}</p>
                            <span className='inline-block px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-full'>
                              Completed
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className='bg-card border border-border/40 p-6 animate-in fade-in slide-in-from-bottom-4' style={{ animationDelay: '700ms' }}>
                    <h3 className='text-lg font-semibold text-text-primary mb-6'>Sales Distribution</h3>
                    <DonutChart />
                    <div className='mt-6 space-y-3'>
                      {[
                        {
                          label: 'Electronics',
                          value: '45%',
                          color: 'bg-emerald-500'
                        },
                        {
                          label: 'Clothing',
                          value: '30%',
                          color: 'bg-blue-500'
                        },
                        {
                          label: 'Food',
                          value: '15%',
                          color: 'bg-purple-500'
                        },
                        {
                          label: 'Others',
                          value: '10%',
                          color: 'bg-orange-500'
                        }
                      ].map((item, index) => (
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
                </div>

                <div className='grid gap-6 lg:grid-cols-2'>
                  <div className='rounded-2xl border border-border/40 bg-card p-6 shadow-sm animate-in fade-in slide-in-from-left-4'>
                    <h3 className='mb-4 text-lg font-semibold text-text-primary'>Revenue Overview</h3>
                    <NewAreaChart />
                  </div>
                  <div className='rounded-2xl border border-border/40 bg-card p-6 shadow-sm animate-in fade-in slide-in-from-right-4'>
                    <h3 className='mb-4 text-lg font-semibold text-text-primary'>Performance Trends</h3>
                    <LineChart />
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
