import React from 'react'
import {
    ToggleButtonGroup,
    Divider,
    FormControl
} from '@mui/material'
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    StrikethroughS,
    FormatListBulleted,
    FormatListNumbered,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatAlignJustify,
    Link as LinkIcon,
    Image as ImageIcon,
    Code as CodeIcon,
    Fullscreen,
    FormatClear
} from '@mui/icons-material'
import ToolbarButton from './ToolbarButton'
import CustomSelectField from '../CustomSelectField'
import { cn } from '@/lib/utils'

const Toolbar = ({
    editor,
    isDark,
    getCurrentParagraphStyle,
    handleFormatChange,
    handleBulletList,
    handleOrderedList,
    handleClearFormatting,
    handleLinkOpen,
    handleImageOpen,
    fullscreen,
    setFullscreen,
    toolbarButtonSx
}) => {
    const handleFullscreen = (e) => {
        e.preventDefault()
        setFullscreen(!fullscreen)
    }

    const textAlignHandler = (align) => (e) => {
        e.preventDefault()
        editor.chain().focus().setTextAlign(align).run()
    }

    return (
        <div
            className={cn(
                'border-b p-2 flex flex-wrap gap-1 items-center overflow-x-auto',
                isDark ? 'bg-[#1F2937] border-[#333E47]' : 'bg-[#F3F4F6] border-[#eaeceb]'
            )}>
            {/* Paragraph Style Dropdown */}
            <FormControl sx={{ minWidth: '140px' }}>
                <CustomSelectField
                    value={getCurrentParagraphStyle(editor)}
                    onChange={(e) => handleFormatChange(editor, e.target.value)}
                    size='small'
                    options={[
                        { label: 'Paragraph', value: 'paragraph' },
                        { label: 'Heading 1', value: 'h1' },
                        { label: 'Heading 2', value: 'h2' },
                        { label: 'Heading 3', value: 'h3' }
                    ]}
                />
            </FormControl>

            <Divider orientation='vertical' flexItem sx={{ my: 0.5, borderColor: isDark ? '#374151' : '#d1d5db' }} />

            {/* Text Formatting */}
            <ToggleButtonGroup value={null} size='small' sx={{ display: 'flex', gap: '0px', '& .MuiToggleButton-root': toolbarButtonSx }}>
                <ToolbarButton title="Bold (Ctrl + B)" icon={<FormatBold fontSize='small' />} selected={editor.isActive('bold')} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }} toolbarButtonSx={toolbarButtonSx} />
                <ToolbarButton title="Italic (Ctrl + I)" icon={<FormatItalic fontSize='small' />} selected={editor.isActive('italic')} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }} toolbarButtonSx={toolbarButtonSx} />
                <ToolbarButton title="Underline (Ctrl + U)" icon={<FormatUnderlined fontSize='small' />} selected={editor.isActive('underline')} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }} toolbarButtonSx={toolbarButtonSx} />
                <ToolbarButton title="Strikethrough" icon={<StrikethroughS fontSize='small' />} selected={editor.isActive('strike')} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }} toolbarButtonSx={toolbarButtonSx} />
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem sx={{ my: 0.5, borderColor: isDark ? '#374151' : '#d1d5db' }} />

            {/* Lists */}
            <ToggleButtonGroup value={null} size='small' sx={{ display: 'flex', gap: '0px', '& .MuiToggleButton-root': toolbarButtonSx }}>
                <ToolbarButton title="Bullet List" icon={<FormatListBulleted fontSize='small' />} selected={editor.isActive('bulletList')} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBulletList() }} onMouseDown={(e) => e.preventDefault()} toolbarButtonSx={toolbarButtonSx} />
                <ToolbarButton title="Ordered List" icon={<FormatListNumbered fontSize='small' />} selected={editor.isActive('orderedList')} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleOrderedList() }} onMouseDown={(e) => e.preventDefault()} toolbarButtonSx={toolbarButtonSx} />
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem sx={{ my: 0.5, borderColor: isDark ? '#374151' : '#d1d5db' }} />

            {/* Alignment */}
            <ToggleButtonGroup value={null} size='small' sx={{ display: 'flex', gap: '0px', '& .MuiToggleButton-root': toolbarButtonSx }}>
                <ToolbarButton title="Align Left" icon={<FormatAlignLeft fontSize='small' />} onMouseDown={textAlignHandler('left')} toolbarButtonSx={toolbarButtonSx} />
                <ToolbarButton title="Align Center" icon={<FormatAlignCenter fontSize='small' />} onMouseDown={textAlignHandler('center')} toolbarButtonSx={toolbarButtonSx} />
                <ToolbarButton title="Align Right" icon={<FormatAlignRight fontSize='small' />} onMouseDown={textAlignHandler('right')} toolbarButtonSx={toolbarButtonSx} />
                <ToolbarButton title="Justify" icon={<FormatAlignJustify fontSize='small' />} onMouseDown={textAlignHandler('justify')} toolbarButtonSx={toolbarButtonSx} />
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem sx={{ my: 0.5, borderColor: isDark ? '#374151' : '#d1d5db' }} />

            {/* Code & Quote */}
            <ToggleButtonGroup value={null} size='small' sx={{ display: 'flex', gap: '0px', '& .MuiToggleButton-root': toolbarButtonSx }}>
                <ToolbarButton title="Code Block" icon={<CodeIcon fontSize='small' />} selected={editor.isActive('codeBlock')} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run() }} toolbarButtonSx={toolbarButtonSx} />
                <ToolbarButton title="Blockquote" icon={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>"</span>} selected={editor.isActive('blockquote')} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }} toolbarButtonSx={toolbarButtonSx} />
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem sx={{ my: 0.5, borderColor: isDark ? '#374151' : '#d1d5db' }} />

            {/* Insert Link & Image */}
            <ToggleButtonGroup value={null} size='small' sx={{ display: 'flex', gap: '0px', '& .MuiToggleButton-root': toolbarButtonSx }}>
                <ToolbarButton title="Insert Link" icon={<LinkIcon fontSize='small' />} onMouseDown={(e) => { e.preventDefault(); handleLinkOpen() }} toolbarButtonSx={toolbarButtonSx} />
                <ToolbarButton title="Insert Image" icon={<ImageIcon fontSize='small' />} onMouseDown={(e) => { e.preventDefault(); handleImageOpen() }} toolbarButtonSx={toolbarButtonSx} />
            </ToggleButtonGroup>

            <Divider orientation='vertical' flexItem sx={{ my: 0.5, borderColor: isDark ? '#374151' : '#d1d5db' }} />

            {/* Clear Formatting */}
            <ToolbarButton title="Clear Formatting" icon={<FormatClear fontSize='small' />} onMouseDown={(e) => { e.preventDefault(); handleClearFormatting() }} toolbarButtonSx={toolbarButtonSx} />

            <Divider orientation='vertical' flexItem sx={{ my: 0.5, borderColor: isDark ? '#374151' : '#d1d5db' }} />

            {/* Fullscreen */}
            <ToolbarButton title="Fullscreen" icon={<Fullscreen fontSize='small' />} selected={fullscreen} onMouseDown={handleFullscreen} toolbarButtonSx={toolbarButtonSx} />
        </div>
    )
}

export default Toolbar

