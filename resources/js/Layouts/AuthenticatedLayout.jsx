import Sidebar from '@/Pages/Sidebar'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import Navbar from '@/Pages/Navbar'

export default function AuthenticatedLayout ({ header, children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        // <ThemeProvider>
            <div className='flex h-screen overflow-hidden bg-background'>
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <Navbar
                        title='Dashboard'
                        collapsed={sidebarCollapsed}
                        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                    <main className='flex-1 overflow-auto'>{children}</main>
                </div>
            </div>
        // </ThemeProvider>
    )
}
