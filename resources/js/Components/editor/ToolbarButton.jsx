import React from 'react'
import { ToggleButton, Tooltip } from '@mui/material'

const ToolbarButton = ({
    title,
    icon,
    selected = false,
    onClick,
    onMouseDown,
    toolbarButtonSx
}) => {
    return (
        <Tooltip title={title}>
            <ToggleButton
                value={title}
                selected={selected}
                onClick={onClick}
                onMouseDown={onMouseDown}
                sx={toolbarButtonSx}>
                {icon}
            </ToggleButton>
        </Tooltip>
    )
}

export default ToolbarButton

