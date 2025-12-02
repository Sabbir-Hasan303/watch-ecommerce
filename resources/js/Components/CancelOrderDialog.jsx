import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { router } from '@inertiajs/react'
import { toast } from 'react-hot-toast'

export default function CancelOrderDialog({ open, onClose, orderId, onSuccess }) {
    const handleCancelOrder = () => {
        // router.post('/orders/cancel', {
        router.post(route('admin.orders.cancel', { id: orderId }), {
            id: orderId
        }, {
            onSuccess: () => {
                onClose()
                if (onSuccess) {
                    onSuccess()
                }
                toast.success('Order has been cancelled')
            },
            onError: (errors) => {
                console.error('Error cancelling order:', errors)
                toast.error('Failed to cancel order')
            }
        })
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth='sm'
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#1C252E',
                    border: '1px solid #374151'
                }
            }}>
            <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }} className='text-text-primary'>
                Cancel Order
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: '#9CA3AF', mt: 1 }} className='text-text-primary'>
                    Are you sure you want to cancel this order? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button
                    variant='outlined'
                    onClick={onClose}
                    sx={{
                        color: '#9CA3AF',
                        borderColor: '#374151',
                        '&:hover': {
                            bgcolor: 'rgba(55, 65, 81, 0.3)',
                            borderColor: '#6B7280'
                        }
                    }}>
                    No, keep order
                </Button>
                <Button
                    variant='contained'
                    onClick={handleCancelOrder}
                    sx={{
                        bgcolor: '#EF4444',
                        '&:hover': {
                            bgcolor: '#DC2626'
                        }
                    }}>
                    Yes, cancel order
                </Button>
            </DialogActions>
        </Dialog>
    )
}
