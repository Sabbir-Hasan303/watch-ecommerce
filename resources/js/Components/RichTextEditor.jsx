import React, { useEffect } from 'react'
import { FormHelperText } from '@mui/material'
import { useThemeContext } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import './editor/style.css'

import { useEditorSetup, getCurrentParagraphStyle, handleFormatChange } from './editor/useEditorSetup'
import { useEditorHandlers } from './editor/useEditorHandlers'
import Toolbar from './editor/Toolbar'
import EditorArea from './editor/EditorArea'
import LinkDialog from './editor/LinkDialog'
import ImageDialog from './editor/ImageDialog'

const RichTextEditor = ({ value, onChange, error, helperText, label, placeholder = 'Write something awesome...', id }) => {
    const { isDark } = useThemeContext()
    const editor = useEditorSetup(value, onChange)

    // Update editor content when value prop changes (for editing existing content)
    useEffect(() => {
        if (editor && value && typeof value === 'string' && value.trim() !== '') {
            // Only update if content has changed to avoid unnecessary updates
            const currentContent = editor.getHTML()
            if (currentContent !== value) {
                editor.commands.setContent(value)
            }
        }
    }, [editor, value])

    const {
        linkDialogOpen,
        setLinkDialogOpen,
        imageDialogOpen,
        setImageDialogOpen,
        linkUrl,
        setLinkUrl,
        imageUrl,
        setImageUrl,
        imageAlt,
        setImageAlt,
        imageWidth,
        setImageWidth,
        imageHeight,
        setImageHeight,
        fullscreen,
        setFullscreen,
        handleLinkOpen,
        handleLinkApply,
        handleImageOpen,
        handleImageApply,
        handleClearFormatting,
        handleBulletList,
        handleOrderedList
    } = useEditorHandlers(editor)

    const toolbarButtonSx = {
        padding: '4px 6px',
        minWidth: '28px',
        color: isDark ? '#9CA3AF' : '#6B7280',
        border: 'none',
        '&:hover': {
            backgroundColor: isDark ? '#374151' : '#e5e7eb'
        },
        '&.Mui-selected': {
            backgroundColor: isDark ? '#374151' : '#e5e7eb',
            color: isDark ? '#fff' : '#1c252e'
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className={cn('space-y-2', fullscreen && 'fixed inset-0 z-50')}>
            {label && (
                <label
                    htmlFor={id}
                    className={cn(
                        'block text-sm font-medium',
                        isDark ? 'text-white' : 'text-gray-900'
                    )}>
                    {label}
                </label>
            )}

            <div
                className={cn(
                    'border rounded-lg overflow-hidden flex flex-col',
                    error
                        ? 'border-red-500'
                        : isDark
                            ? 'border-[#333E47]'
                            : 'border-[#eaeceb]',
                    'transition-colors',
                    fullscreen && 'fixed inset-0 rounded-none border-0 space-y-0',
                    !fullscreen && 'h-full'
                )}>
                {/* Toolbar */}
                <Toolbar
                    editor={editor}
                    isDark={isDark}
                    getCurrentParagraphStyle={getCurrentParagraphStyle}
                    handleFormatChange={handleFormatChange}
                    handleBulletList={handleBulletList}
                    handleOrderedList={handleOrderedList}
                    handleClearFormatting={handleClearFormatting}
                    handleLinkOpen={handleLinkOpen}
                    handleImageOpen={handleImageOpen}
                    fullscreen={fullscreen}
                    setFullscreen={setFullscreen}
                    toolbarButtonSx={toolbarButtonSx}
                />

                {/* Editor Area */}
                <EditorArea
                    editor={editor}
                    id={id}
                    isDark={isDark}
                />
            </div>

            {helperText && (
                <FormHelperText
                    error={error}
                    sx={{
                        color: error ? '#dc2626' : (isDark ? '#9CA3AF' : '#6b7280'),
                        marginLeft: '14px',
                        marginTop: '4px'
                    }}>
                    {helperText}
                </FormHelperText>
            )}

            {/* Link Dialog */}
            <LinkDialog
                open={linkDialogOpen}
                onClose={() => setLinkDialogOpen(false)}
                linkUrl={linkUrl}
                setLinkUrl={setLinkUrl}
                onApply={handleLinkApply}
                isDark={isDark}
            />

            {/* Image Dialog */}
            <ImageDialog
                open={imageDialogOpen}
                onClose={() => setImageDialogOpen(false)}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                imageAlt={imageAlt}
                setImageAlt={setImageAlt}
                imageWidth={imageWidth}
                setImageWidth={setImageWidth}
                imageHeight={imageHeight}
                setImageHeight={setImageHeight}
                onApply={handleImageApply}
                isDark={isDark}
            />
        </div>
    )
}

export default RichTextEditor
