import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material'
import CustomTextField from '../CustomTextField'

const ImageDialog = ({
    open,
    onClose,
    imageUrl,
    setImageUrl,
    imageAlt,
    setImageAlt,
    onApply,
    isDark
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: isDark ? '#1F2937' : '#ffffff',
                    color: isDark ? '#ffffff' : '#000000'
                }
            }}>
            <DialogTitle sx={{ color: isDark ? '#ffffff' : '#000000' }}>Add Image</DialogTitle>
            <DialogContent sx={{ minWidth: '400px', display: 'flex', flexDirection: 'column', gap: 2 }} className='!p-4'>
                <CustomTextField
                    fullWidth
                    label="Image URL"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <CustomTextField
                    fullWidth
                    label="Alt text"
                    placeholder="Describe the image"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    Cancel
                </Button>
                <Button
                    onClick={onApply}
                    variant='outlined'>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImageDialog

