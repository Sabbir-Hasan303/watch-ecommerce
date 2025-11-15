import { useState, useCallback } from 'react'

export const useEditorHandlers = (editor) => {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [imageAlt, setImageAlt] = useState('')
    const [imageWidth, setImageWidth] = useState('')
    const [imageHeight, setImageHeight] = useState('')
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
        // Check if an image is selected to get its current attributes
        const attrs = editor.getAttributes('image')
        if (attrs.src) {
            setImageUrl(attrs.src || '')
            setImageAlt(attrs.alt || '')
            setImageWidth(attrs.width || '')
            setImageHeight(attrs.height || '')
        } else {
            setImageUrl('')
            setImageAlt('')
            setImageWidth('')
            setImageHeight('')
        }
        setImageDialogOpen(true)
    }, [editor])

    const handleImageApply = useCallback(() => {
        if (imageUrl) {
            const imageAttrs = {
                src: imageUrl,
                alt: imageAlt || ''
            }

            // Add width and height if provided
            if (imageWidth) {
                imageAttrs.width = imageWidth
            }
            if (imageHeight) {
                imageAttrs.height = imageHeight
            }

            editor.chain().focus().setImage(imageAttrs).run()
        }
        setImageDialogOpen(false)
        setImageUrl('')
        setImageAlt('')
        setImageWidth('')
        setImageHeight('')
    }, [editor, imageUrl, imageAlt, imageWidth, imageHeight])

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
    }
}

