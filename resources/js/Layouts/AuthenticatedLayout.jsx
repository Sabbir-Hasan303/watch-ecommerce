import Sidebar from '@/Pages/Sidebar'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import Navbar from '@/Pages/Navbar'
import { Container } from '@mui/material'

export default function AuthenticatedLayout ({ header, children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className='flex h-screen overflow-hidden bg-background'>
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div className='flex-1 flex flex-col overflow-auto  scrollbar-thin'>
                <Navbar
                    title='Dashboard'
                    collapsed={sidebarCollapsed}
                    onToggleSidebar={() =>
                        setSidebarCollapsed(!sidebarCollapsed)
                    }
                />
                <main>
                    <Container
                        maxWidth='xl'
                        sx={{
                            px: {
                                xs: '20px',
                                sm: '40px',
                                md: '40px',
                                lg: '40px',
                                xl: '40px'
                            }
                        }}
                    >
                        {children}
                    </Container>
                </main>
            </div>
        </div>

        // <Box
        //     sx={{ display: 'flex', height: '100vh', bgcolor: 'white' }}
        //     className='dark:bg-dark-primary'
        // >
        //     {/* Sidebar */}
        //     <Box style={{ flexShrink: 0 }}>
        //         <Sidebar
        //             collapsed={sidebarCollapsed}
        //             onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        //         />
        //     </Box>

        //     {/* Main content area */}
        //     <Box
        //         sx={{
        //             flex: 1,
        //             display: 'flex',
        //             flexDirection: 'column',
        //             overflow: 'auto',
        //             pt: '71px',
        //             minWidth: '0px',
        //             height: '100%',
        //             transition: 'all 200ms linear',
        //             zIndex: 10
        //         }}
        //         className='main-scrollbar'
        //     >
        //         {/* Page header */}
        //         {header && (
        //             <div className='bg-white dark:bg-dark-primary shadow-sm border-b border-gray-200 dark:border-gray-700'>
        //                 <div className='px-6 py-4'>{header}</div>
        //             </div>
        //         )}
        //         {/* Top bar - fixed at top */}
        //         <Box sx={{ zIndex: 50 }}>
        //             <Navbar
        //                 title='Dashboard'
        //                 collapsed={sidebarCollapsed}
        //                 onToggleSidebar={() =>
        //                     setSidebarCollapsed(!sidebarCollapsed)
        //                 }
        //             />
        //         </Box>

        //         {/* Main content */}
        //         <Box
        //             component='main'
        //             sx={{ flex: 1, zIndex: 40, backgroundColor: 'white' }}
        //             className='dark:bg-dark-primary'
        //         >
        //             <Container
        //                 maxWidth='xl'
        //                 sx={{
        //                     px: {
        //                         xs: '20px',
        //                         sm: '40px',
        //                         md: '40px',
        //                         lg: '40px',
        //                         xl: '40px'
        //                     }
        //                 }}
        //             >
        //                 {children}
        //             </Container>
        //         </Box>
        //     </Box>

        //     {/* Global Search Popup Component */}
        //     {/* <SearchPopup
        //         isOpen={showSearchPopup}
        //         onClose={() => setShowSearchPopup(false)}
        //     /> */}
        // </Box>
    )
}
