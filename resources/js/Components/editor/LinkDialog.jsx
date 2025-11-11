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

const LinkDialog = ({
    open,
    onClose,
    linkUrl,
    setLinkUrl,
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
            <DialogTitle sx={{ color: isDark ? '#ffffff' : '#000000' }}>Insert Link</DialogTitle>
            <DialogContent sx={{ minWidth: '400px'}} className='!p-4'>
                <CustomTextField
                    fullWidth
                    label="Link URL"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
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

export default LinkDialog

