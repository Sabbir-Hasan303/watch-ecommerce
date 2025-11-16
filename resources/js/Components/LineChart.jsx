import { useEffect, useRef } from 'react'

export function LineChart ({ data }) {
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

        // Convert revenue data to chart values
        const defaultData = [0, 0, 0, 0, 0, 0]
        const chartValues = data && data.length > 0
            ? data.map(item => item.revenue)
            : defaultData

        const datasets = [
            {
                data: chartValues,
                color: 'rgb(59, 130, 246)'
            }
        ]

        const max = Math.max(...datasets.flatMap(d => d.data)) || 1

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
