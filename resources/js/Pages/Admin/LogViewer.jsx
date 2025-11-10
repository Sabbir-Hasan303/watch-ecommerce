import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

export default function LogViewer({
    title,
    logs,
    files = [],
    folders = [],
    currentFile,
    currentFolder,
    standardFormat = true,
    debug = null
}) {
    const [expandedStacks, setExpandedStacks] = useState({});
    const { mode, theme } = useThemeContext();

    const toggleStack = (key) => {
        setExpandedStacks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const confirmAction = (message) => {
        return window.confirm(message);
    };

    const getLevelColor = (level) => {
        const levelMap = {
            'emergency': 'error',
            'alert': 'error',
            'critical': 'error',
            'error': 'error',
            'warning': 'warning',
            'notice': 'info',
            'info': 'info',
            'debug': 'text.secondary'
        };
        return levelMap[level?.toLowerCase()] || 'inherit';
    };

    const getLevelIcon = (level) => {
        const levelIcons = {
            'emergency': '🚨',
            'alert': '🔔',
            'critical': '❌',
            'error': '❗',
            'warning': '⚠️',
            'notice': 'ℹ️',
            'info': 'ℹ️',
            'debug': '🐛'
        };
        return levelIcons[level?.toLowerCase()] || 'ℹ️';
    };

    return (
        <AuthenticatedLayout>
            <Head title={title} />

            <Box sx={{ minHeight: '100vh' }}>
                <Box sx={{ mx: 'auto', px: { xs: 2, lg: 3 }, py: 3 }}>
                    {/* Header */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant='h1' component='h1' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            📋 Laravel Log Viewer
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                            System Log Management
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '300px 1fr' }, gap: 3 }}>
                        {/* Sidebar */}
                        <Paper sx={{ p: 2 }} className="!bg-card !shadow-lg !rounded-lg">
                            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                                Log Files
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '400px', overflowY: 'auto' }}>
                                {folders.map((folder, index) => (
                                    <Box key={index} sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                                        <Typography variant='body2'>
                                            📁 {folder}
                                        </Typography>
                                    </Box>
                                ))}

                                {files.map((file, index) => (
                                    <Link
                                        key={index}
                                        href={`/admin/logs?l=${encodeURIComponent(file)}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 1,
                                                transition: 'all 0.2s',
                                                bgcolor: currentFile === file ? 'primary.main' : 'transparent',
                                                color: currentFile === file ? 'primary.contrastText' : 'text.primary',
                                                '&:hover': {
                                                    bgcolor: currentFile === file ? 'primary.dark' : 'action.hover'
                                                }
                                            }}
                                        >
                                            <Typography variant='body2'>
                                                📄 {file}
                                            </Typography>
                                        </Box>
                                    </Link>
                                ))}
                            </Box>
                        </Paper>

                        {/* Main Content */}
                        <Box>
                            {logs === null ? (
                                <Paper sx={{ p: 3, textAlign: 'center' }} className="!bg-card !shadow-lg !rounded-lg">
                                    <Typography variant='body1'>Please download it to view.</Typography>
                                </Paper>
                            ) : (
                                <Paper sx={{ overflow: 'hidden' }} className="!bg-card !shadow-lg !rounded-lg">
                                    <Box sx={{ overflowX: 'auto' }}>
                                        <Table size='small'>
                                        <TableHead>
                                            <TableRow sx={{ '& th': { fontWeight: 600 } }}>
                                                {standardFormat && (
                                                    <>
                                                        <TableCell>Level</TableCell>
                                                        <TableCell>Date</TableCell>
                                                    </>
                                                )}
                                                {!standardFormat && (
                                                    <TableCell>Line</TableCell>
                                                )}
                                                <TableCell>Content</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {logs && logs.map((log, key) => (
                                                <TableRow key={key} sx={{ '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                                                    {standardFormat && (
                                                        <>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <Typography variant='body2' sx={{ color: `${getLevelColor(log.level)}.main` }}>
                                                                        {getLevelIcon(log.level)}
                                                                    </Typography>
                                                                    <Typography variant='body2' sx={{ color: `${getLevelColor(log.level)}.main` }}>
                                                                        {log.level}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant='caption' sx={{ whiteSpace: 'nowrap' }}>{log.date}</Typography>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                    {!standardFormat && (
                                                        <TableCell>
                                                            <Typography variant='caption'>{log.date}</Typography>
                                                        </TableCell>
                                                    )}
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Typography variant='body2' sx={{ wordBreak: 'break-word' }}>{log.text}</Typography>
                                                                {log.in_file && (
                                                                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 0.5 }}>
                                                                        {log.in_file}
                                                                    </Typography>
                                                                )}
                                                                {expandedStacks[key] && (
                                                                    <Paper sx={{ mt: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                                                        {log.context && (
                                                                            <Box sx={{ mb: 1 }}>
                                                                                <Typography variant='caption' sx={{ fontWeight: 600 }}>
                                                                                    Context:
                                                                                </Typography>
                                                                                <Typography variant='caption' sx={{ ml: 0.5, display: 'block' }}>
                                                                                    {log.context}
                                                                                </Typography>
                                                                            </Box>
                                                                        )}
                                                                        {log.stack && (
                                                                            <Box>
                                                                                <Typography variant='caption' sx={{ fontWeight: 600 }}>
                                                                                    Stack Trace:
                                                                                </Typography>
                                                                                <Typography
                                                                                    component='pre'
                                                                                    variant='caption'
                                                                                    sx={{
                                                                                        display: 'block',
                                                                                        mt: 0.5,
                                                                                        fontFamily: 'monospace',
                                                                                        whiteSpace: 'pre-wrap',
                                                                                        wordWrap: 'break-word',
                                                                                        color: 'text.secondary'
                                                                                    }}
                                                                                >
                                                                                    {log.stack.trim()}
                                                                                </Typography>
                                                                            </Box>
                                                                        )}
                                                                    </Paper>
                                                                )}
                                                            </Box>
                                                            {(log.stack || log.context) && (
                                                                <Button
                                                                    onClick={() => toggleStack(key)}
                                                                    size='small'
                                                                    variant='outlined'
                                                                    sx={{ mt: 0.5, minWidth: 'auto', p: '4px 8px' }}
                                                                >
                                                                    🔍
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    </Box>

                                    {/* File Actions */}
                                    {currentFile && (
                                        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Link
                                            href={`/admin/logs?dl=${encodeURIComponent(currentFile)}${currentFolder ? '&f=' + encodeURIComponent(currentFolder) : ''}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Button variant='text' size='small' sx={{ color: 'info.main' }}>
                                                ⬇️ Download file
                                            </Button>
                                        </Link>

                                        <Link
                                            href={`/admin/logs?clean=${encodeURIComponent(currentFile)}${currentFolder ? '&f=' + encodeURIComponent(currentFolder) : ''}`}
                                            onClick={(e) => {
                                                if (!confirmAction('Are you sure you want to clean this log file?')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Button variant='text' size='small' sx={{ color: 'warning.main' }}>
                                                🔄 Clean file
                                            </Button>
                                        </Link>

                                        <Link
                                            href={`/admin/logs?del=${encodeURIComponent(currentFile)}${currentFolder ? '&f=' + encodeURIComponent(currentFolder) : ''}`}
                                            onClick={(e) => {
                                                if (!confirmAction('Are you sure you want to delete this log file?')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Button variant='text' size='small' sx={{ color: 'error.main' }}>
                                                🗑️ Delete file
                                            </Button>
                                        </Link>

                                        {files.length > 1 && (
                                            <Link
                                                href={`/admin/logs?delall=true${currentFolder ? '&f=' + encodeURIComponent(currentFolder) : ''}`}
                                                onClick={(e) => {
                                                    if (!confirmAction('Are you sure you want to delete ALL log files?')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Button variant='text' size='small' sx={{ color: 'error.main' }}>
                                                    🗑️ Delete all files
                                                </Button>
                                            </Link>
                                        )}
                                        </Box>
                                    )}
                                </Paper>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}

