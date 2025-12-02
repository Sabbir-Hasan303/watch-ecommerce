import React, { useState } from 'react'

// Reusable Ripple Component
const Ripple = ({ children, className = '', onClick, bgColor = '', ...props }) => {
    const [ripples, setRipples] = useState([])

    const createRipple = (event) => {
        const button = event.currentTarget
        const rect = button.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const newRipple = {
            id: Date.now(),
            x: x - 10,
            y: y - 10,
        }

        setRipples(prev => [...prev, newRipple])

        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
        }, 600)

        if (onClick) onClick(event)
    }

    return (
        <button
            type="button"
            onClick={createRipple}
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            {children}

            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className={`absolute w-5 h-5 rounded-full pointer-events-none ripple-animation ${bgColor || 'bg-green-500/40'}`}
                    style={{
                        left: `${ripple.x}px`,
                        top: `${ripple.y}px`,
                    }}
                />
            ))}
        </button>
    )
}

export default Ripple
