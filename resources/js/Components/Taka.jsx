import React from 'react'
import { Typography } from '@mui/material'

const Taka = ({ color = 'text-text-primary', size = 'text-2xl', className = '' }) => {
    return (
        <Typography>
            <span className={`${color} ${size} ${className}`}>৳</span>
        </Typography>
    )
}

export default Taka
