import React from 'react'

const Taka = ({ color = 'text-text-primary', size = 'text-2xl', className = '' }) => {
  return (
    <span className={`${color} ${size} mr-1 ${className}`}>৳</span>
  )
}

export default Taka
