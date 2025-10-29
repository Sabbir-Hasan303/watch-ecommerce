import { Head } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Navbar from '@/Pages/Admin/Navbar'
import Sidebar from '@/Pages/Admin/Sidebar'
import { Container } from '@mui/material'
import { Toaster, toast } from 'react-hot-toast'
import { usePage } from '@inertiajs/react'
import { ThemeContextProvider } from '@/contexts/ThemeContext'

export default function AuthenticatedLayout({ header, children, flash }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const { auth } = usePage().props

    // Handle flash messages from Laravel
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success)
        }
        if (flash?.error) {
            toast.error(flash.error)
        }
    }, [flash])

    return (
        <ThemeContextProvider>
            <div className='flex h-screen overflow-hidden bg-background'>
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    user={auth?.user}
                />
                <div className='flex-1 flex flex-col overflow-auto  scrollbar-thin'>
                    <Navbar
                        title='Dashboard'
                        collapsed={sidebarCollapsed}
                        onToggleSidebar={() =>
                            setSidebarCollapsed(!sidebarCollapsed)
                        }
                        user={auth?.user}
                    />
                    <main>
                        <Container maxWidth='xl' sx={{ px: { xs: '20px', sm: '40px', md: '40px', lg: '40px', xl: '40px' }}}>
                            {children}
                        </Container>
                    </main>
                </div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#4ade80',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </div>
        </ThemeContextProvider>
    )
}
