import { useEffect, useRef } from 'react'

export function LineChart () {
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

        const datasets = [
            {
                data: [20, 35, 30, 45, 40, 55, 50, 65, 60, 75, 70, 85],
                color: 'rgb(59, 130, 246)'
            },
            {
                data: [30, 25, 35, 30, 40, 35, 45, 40, 50, 45, 55, 50],
                color: 'rgb(168, 85, 247)'
            },
            {
                data: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
                color: 'rgb(34, 197, 94)'
            }
        ]

        const max = Math.max(...datasets.flatMap(d => d.data))

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

            // Draw lines
            datasets.forEach(dataset => {
                ctx.strokeStyle = dataset.color
                ctx.lineWidth = 2.5
                ctx.beginPath()

                dataset.data.forEach((value, index) => {
                    const x =
                        padding +
                        (width - padding * 2) *
                            (index / (dataset.data.length - 1))
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
            })

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        animate()
    }, [])

    return <canvas ref={canvasRef} className='h-64 w-full' />
}
