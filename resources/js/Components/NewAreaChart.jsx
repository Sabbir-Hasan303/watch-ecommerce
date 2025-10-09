import { useEffect, useRef } from 'react'

export function NewAreaChart () {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)

        const width = rect.width
        const height = rect.height
        const padding = 40

        const data = [30, 45, 35, 55, 45, 60, 50, 70, 65, 80, 75, 90]
        const max = Math.max(...data)

        let progress = 0
        const animate = () => {
            progress += 0.02
            if (progress > 1) progress = 1

            ctx.clearRect(0, 0, width, height)

            // Draw grid
            ctx.strokeStyle = 'rgba(128, 128, 128, 0.1)'
            ctx.lineWidth = 1
            for (let i = 0; i <= 4; i++) {
                const y = padding + (height - padding * 2) * (i / 4)
                ctx.beginPath()
                ctx.moveTo(padding, y)
                ctx.lineTo(width - padding, y)
                ctx.stroke()
            }

            // Draw area
            const gradient = ctx.createLinearGradient(
                0,
                padding,
                0,
                height - padding
            )
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')

            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.moveTo(padding, height - padding)

            data.forEach((value, index) => {
                const x =
                    padding +
                    (width - padding * 2) * (index / (data.length - 1))
                const y =
                    height -
                    padding -
                    (value / max) * (height - padding * 2) * progress
                if (index === 0) {
                    ctx.lineTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })

            ctx.lineTo(width - padding, height - padding)
            ctx.closePath()
            ctx.fill()

            // Draw line
            ctx.strokeStyle = 'rgb(59, 130, 246)'
            ctx.lineWidth = 3
            ctx.beginPath()

            data.forEach((value, index) => {
                const x =
                    padding +
                    (width - padding * 2) * (index / (data.length - 1))
                const y =
                    height -
                    padding -
                    (value / max) * (height - padding * 2) * progress
                if (index === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })

            ctx.stroke()

            // Draw points
            data.forEach((value, index) => {
                const x =
                    padding +
                    (width - padding * 2) * (index / (data.length - 1))
                const y =
                    height -
                    padding -
                    (value / max) * (height - padding * 2) * progress

                ctx.fillStyle = 'rgb(59, 130, 246)'
                ctx.beginPath()
                ctx.arc(x, y, 4, 0, Math.PI * 2)
                ctx.fill()

                ctx.strokeStyle = 'white'
                ctx.lineWidth = 2
                ctx.stroke()
            })

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        animate()
    }, [])

    return <canvas ref={canvasRef} className='h-64 w-full' />
}
