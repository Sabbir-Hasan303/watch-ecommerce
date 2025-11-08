import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Link, usePage } from '@inertiajs/react'
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Package,
  ChevronRight,
  ChevronLeft,
  User,
  ShoppingBag,
  ImageIcon,
  Settings,
  UserCheck,
  FileText
} from 'lucide-react'
import { Button } from '@mui/material'

export default function Sidebar({ collapsed, onToggle, user }) {
  const { url } = usePage()
  const [expandedItems, setExpandedItems] = useState([])

  // Helper function to extract path from full URL
  const getPathFromUrl = (fullUrl) => {
    try {
      const urlObj = new URL(fullUrl, window.location.origin)
      return urlObj.pathname
    } catch {
      // If it's already just a path, return it
      return fullUrl
    }
  }

  // Check if any child item is active for a given parent
  const hasActiveChild = item => {
    if (!item.subItems) return false
    return item.subItems.some(subItem => url === getPathFromUrl(subItem.href))
  }

  // Get the parent item that has an active child
  const getActiveParent = () => {
    return managementItems.find(item => hasActiveChild(item))
  }

  const menuItems = [{ icon: LayoutDashboard, label: 'Dashboard', href: route('admin.dashboard') }]

  const managementItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: route('admin.dashboard')
    },
    {
      icon: Package,
      label: 'Product',
      subItems: [
        { label: 'Product List', href: route('admin.products.index') },
        { label: 'Add Product', href: route('admin.products.create') },
        { label: 'Categories', href: route('admin.products.categories') },
        // { label: 'Tags', href: '/products/tags' }
        { label: 'Featured Products', href: route('admin.products.featured-products') }
      ]
    },
    {
      icon: ShoppingBag,
      label: 'Order',
      subItems: [
        { label: 'All Orders', href: route('admin.orders.index') },
        { label: 'Create Order', href: route('admin.orders.create') }
      ]
    },
    // {
    //   icon: CreditCard,
    //   label: 'Accounts',
    //   subItems: [
    //     { label: 'Dashboard', href: '/accounts' },
    //     { label: 'Revenue Reports', href: '/accounts/revenue' },
    //     { label: 'Transactions', href: '/accounts/transactions' },
    //     { label: 'Invoices', href: '/accounts/invoices' }
    //   ]
    // },
    {
      icon: ImageIcon,
      label: 'Content',
      subItems: [
        { label: 'Newsletter', href: route('admin.contents.newsletters') },
        { label: 'Contact List', href: route('admin.contents.contact-list') }
        // { label: 'Banners', href: '/dynamic-banner' },
        // { label: 'FAQs', href: '/faqs' }
      ]
    },
    // {
    //   icon: Users,
    //   label: 'User',
    //   subItems: [{ label: 'All Users', href: '/users' }]
    // },
    {
      icon: UserCheck,
      label: 'Customers',
      subItems: [
        { label: 'All Customers', href: route('admin.customers.index') }
        // { label: 'Customer Reviews', href: '/customers/reviews' },
        // { label: 'Customer Ratings', href: '/customers/ratings' }
      ]
    },
    {
      icon: FileText,
      label: 'Log Viewer',
      href: route('admin.logs')
    },
    {
      icon: Settings,
      label: 'Settings',
      subItems: [
        { label: 'Profile', href: route('admin.settings.profile') }
        // { label: 'Security', href: '/settings/security' },
        // { label: 'Payment Methods', href: '/settings/payment' },
        // { label: 'API Configuration', href: '/settings/api' },
        // { label: 'Mail Settings', href: '/settings/mail' },
        // { label: 'Preferences', href: '/settings/preferences' }
      ]
    }
  ]

  // Auto-expand active parent on component mount and URL change
  useEffect(() => {
    const activeParent = getActiveParent()
    if (activeParent) {
      setExpandedItems(prev => {
        if (!prev.includes(activeParent.label)) {
          return [...prev, activeParent.label]
        }
        return prev
      })
    }
  }, [url])

  const toggleExpanded = label => {
    const activeParent = getActiveParent()
    const isActiveParent = activeParent && activeParent.label === label

    setExpandedItems(prev => {
      // If this is the active parent, always keep it expanded
      if (isActiveParent) {
        return prev.includes(label) ? prev : [...prev, label]
      }

      // For non-active parents, implement accordion behavior
      // Close all other parents except the active one, then toggle the clicked one
      const activeParentLabel = activeParent ? activeParent.label : null
      const filteredItems = prev.filter(item => item === activeParentLabel)

      // If the clicked item is already expanded, collapse it
      if (prev.includes(label)) {
        return filteredItems
      }

      // Otherwise, expand the clicked item (and keep active parent open)
      return [...filteredItems, label]
    })
  }

  const renderMenuItem = (item, index) => {
    const isExpanded = expandedItems.includes(item.label)
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isActive = item.href ? url === getPathFromUrl(item.href) : false
    const isSettings = item.label === 'Settings'
    const hasActiveChildItem = hasActiveChild(item)

    const buttonContent = (
      <>
        <div className={cn('relative', isSettings && 'animate-spin-slow')}>
          <item.icon className={cn('w-5 h-5 flex-shrink-0 transition-all duration-300')} />
          {isSettings && (
            <div className='absolute inset-0 animate-ping opacity-20'>
              <item.icon className='w-5 h-5' />
            </div>
          )}
        </div>

        {!collapsed && (
          <>
            <span className='flex-1 text-left text-sm font-medium transition-all duration-200'>{item.label}</span>
            {hasSubItems && (
              <ChevronRight className={cn('w-4 h-4 transition-all duration-300 flex-shrink-0', isExpanded && 'rotate-90 text-emerald-400')} />
            )}
          </>
        )}
      </>
    )

    const buttonClasses = cn(
      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden',
      isActive || hasActiveChildItem
        ? 'bg-sidebar-accent text-primary shadow-lg shadow-sidebar-primary/20 border border-sidebar-primary/30'
        : 'text-text-primary hover:text-text-primary hover:bg-sidebar-accent hover:shadow-md hover:scale-[1.02]',
      collapsed && 'justify-center px-2'
    )

    return (
      <div key={index} className='relative'>
        {isActive && <div className='absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl -z-10' />}

        {/* Single menu item with href - direct navigation */}
        {item.href && !hasSubItems ? (
          <Link href={item.href} className={buttonClasses}>
            <div className='relative z-10 flex items-center gap-3 w-full'>{buttonContent}</div>
          </Link>
        ) : hasSubItems ? (
          /* Menu item with sub-items - expandable */
          <button onClick={() => toggleExpanded(item.label)} className={buttonClasses}>
            <div className='relative z-10 flex items-center gap-3 w-full'>{buttonContent}</div>
          </button>
        ) : (
          /* Fallback for items without href or subItems */
          <div className={buttonClasses}>
            <div className='relative z-10 flex items-center gap-3 w-full'>{buttonContent}</div>
          </div>
        )}

        {hasSubItems && isExpanded && !collapsed && (
          <div className='mt-1 space-y-0.5 animate-in slide-in-from-top-2 duration-300 relative'>
            {item.subItems?.map((subItem, subIndex) => {
              const isLast = subIndex === item.subItems.length - 1
              const isSubActive = url === getPathFromUrl(subItem.href)

              return (
                <div key={subIndex} className='relative group/sub'>
                  <div className={`absolute left-5 w-px bg-sidebar-border ${isLast ? 'top-0 h-[43%]' : 'top-0 bottom-0'}`}></div>
                  <div className='absolute left-5 top-[24%] w-3 h-3 border-l border-b border-gray-200 dark:border-gray-600 rounded-bl-md'></div>

                  <Link href={subItem.href} className='block pl-8 pr-3'>
                    <Button
                      variant='text'
                      className={cn(
                        'w-full border flex !pl-8 !justify-start py-2.5 rounded-lg text-sm transition-all duration-300 group relative overflow-hidden',
                        isSubActive
                          ? 'text-sidebar-primary !bg-sidebar-accent font-medium shadow-sm border-l-2 !border-sidebar-primary'
                          : '!text-text-secondary hover:text-text-primary hover:!bg-gray-200 hover:dark:!bg-sidebar-accent hover:shadow-sm'
                      )}>
                      <span className='relative z-10 transition-all duration-300'>{subItem.label}</span>
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {!collapsed && <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300' onClick={onToggle} />}

      <aside
        className={cn(
          'fixed lg:relative bg-background h-full transition-all duration-500 ease-in-out z-50 flex flex-col border-r border-border shadow-lg',
          collapsed ? 'w-20' : 'w-72',
          collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0',
          'lg:translate-x-0'
        )}>
        {/* Edge toggle button (desktop) */}
        <button
          type='button'
          onClick={onToggle}
          className='hidden lg:flex items-center justify-center w-7 h-7 rounded-full border border-gray-600/40 text-gray-400 hover:text-white hover:border-gray-400 bg-transparent absolute top-[38px] z-40 -translate-y-1/2'
          style={{ right: '-14px' }}
          title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight className='w-4 h-4' /> : <ChevronLeft className='w-4 h-4' />}
        </button>
        <div className={cn('flex items-center gap-3 p-4 border-b border-border', collapsed && 'justify-center')}>
          <div className='relative flex-shrink-0 group'>
            <div className='absolute inset-0 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300' />
            <div className='relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300'>
              <LayoutDashboard className='w-6 h-6 text-text-primary animate-pulse' />
            </div>
          </div>
          {!collapsed && (
            <div className='flex-1 animate-in slide-in-from-left duration-300'>
              <h1 className='text-lg font-bold text-text-primary'>Dashboard</h1>
              <p className='text-xs text-text-secondary'>Admin Panel</p>
            </div>
          )}
        </div>

        <div className='flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent hover:scrollbar-thumb-emerald-500/40'>
          {/* <div className='space-y-1'>{menuItems.map((item, index) => renderMenuItem(item, index))}</div>

          {!collapsed && (
            <div className='px-3 pt-2'>
              <div className='flex items-center gap-2'>
                <div className='h-px flex-1 bg-gradient-to-r from-transparent via-sidebar-border to-transparent' />
                <h3 className='text-xs font-semibold text-text-secondary uppercase tracking-wider'>Management</h3>
                <div className='h-px flex-1 bg-gradient-to-r from-transparent via-sidebar-border to-transparent' />
              </div>
            </div>
          )} */}

          <div className='space-y-1'>{managementItems.map((item, index) => renderMenuItem(item, index))}</div>
        </div>

        <div className={cn('p-4 border-t border-border', collapsed && 'px-2')}>
          {!collapsed ? (
              <div className='flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer group'>
                <div className='relative flex-shrink-0'>
                  <div className='absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300' />
                  <div className='relative w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden'>
                    {user?.profile_image ? (
                      <img
                        src={`/storage/${user.profile_image}`}
                        alt={user.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <User className='w-5 h-5 text-text-primary' />
                    )}
                  </div>
                  <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-border rounded-full animate-pulse' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-text-primary truncate group-hover:text-emerald-400 transition-colors'>{user?.name || 'User'}</p>
                  <p className='text-xs text-text-secondary truncate'>Admin</p>
                </div>
                <ChevronRight className='w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300' />
              </div>
          ) : (
            <div className='flex justify-center group cursor-pointer'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300' />
                <div className='relative w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden'>
                  {user?.profile_image ? (
                    <img
                      src={`/storage/${user.profile_image}`}
                      alt={user.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <User className='w-5 h-5 text-text-primary' />
                  )}
                </div>
                <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-border rounded-full animate-pulse' />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
