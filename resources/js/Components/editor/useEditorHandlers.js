import { useState, useCallback } from 'react'

export const useEditorHandlers = (editor) => {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [imageAlt, setImageAlt] = useState('')
    const [fullscreen, setFullscreen] = useState(false)

    // Link handlers
    const handleLinkOpen = useCallback(() => {
        setLinkUrl(editor.getAttributes('link').href || '')
        setLinkDialogOpen(true)
    }, [editor])

    const handleLinkApply = useCallback(() => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
        } else {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
        }
        setLinkDialogOpen(false)
        setLinkUrl('')
    }, [editor, linkUrl])

    // Image handlers
    const handleImageOpen = useCallback(() => {
        setImageUrl('')
        setImageAlt('')
        setImageDialogOpen(true)
    }, [])

    const handleImageApply = useCallback(() => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run()
        }
        setImageDialogOpen(false)
        setImageUrl('')
        setImageAlt('')
    }, [editor, imageUrl, imageAlt])

    // Clear formatting
    const handleClearFormatting = useCallback(() => {
        editor.chain().focus().clearNodes().unsetAllMarks().run()
    }, [editor])

    // List handlers
    const handleBulletList = useCallback(() => {
        try {
            editor.chain().focus().toggleBulletList().run()
        } catch (error) {
            console.error('Bullet list error:', error)
        }
    }, [editor])

    const handleOrderedList = useCallback(() => {
        try {
            editor.chain().focus().toggleOrderedList().run()
        } catch (error) {
            console.error('Ordered list error:', error)
        }
    }, [editor])

    return {
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
        fullscreen,
        setFullscreen,
        handleLinkOpen,
        handleLinkApply,
        handleImageOpen,
        handleImageApply,
        handleClearFormatting,
        handleBulletList,
        handleOrderedList
    }
}

