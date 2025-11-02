import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { FileText, ExternalLink } from 'lucide-react'
import { useEffect } from 'react'

export default function LogViewerPage() {
    useEffect(() => {
        // Check themeMode from localStorage
        const themeMode = localStorage.getItem('themeMode')

        // Set logViewerTheme based on themeMode
        if (themeMode === 'dark') {
            localStorage.setItem('logViewerTheme', 'Dark')
        } else if (themeMode === 'light') {
            localStorage.setItem('logViewerTheme', 'light')
        }
    }, [])

    return (
        <AuthenticatedLayout>
            <Head title='Log Viewer' />

            <div className='py-4'>
                <div className='mb-6 flex items-center justify-between'>
                    <div>
                        <h2 className='text-2xl leading-9 font-bold text-text-primary mb-6 flex items-center gap-3'>
                            <FileText className='w-8 h-8 text-emerald-500' />
                            Log Viewer
                        </h2>
                        <p className='text-sm text-muted-foreground'>Monitor and analyze application logs in real-time</p>
                    </div>
                    <a
                        href='/admin/log-viewer'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex text-sm items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-300 border border-emerald-500/30 hover:border-emerald-500/50'>
                        <ExternalLink className='w-4 h-4' />
                        Open
                    </a>
                </div>

                <div className='rounded-xl border border-border/40 !bg-card overflow-hidden shadow-lg max-h-[calc(100vh-20rem)]'>
                    <iframe
                        src='/admin/log-viewer'
                        className='w-full h-screen border-0 rounded-xl'
                        title='Log Viewer'
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
