import Taka from './Taka'

export function DonutChart({ data, totalRevenue }) {
    const defaultData = [
        { label: 'No Data', value: '100%', color: 'bg-gray-500' }
    ]

    const chartData = data && data.length > 0 ? data : defaultData
    const circumference = 282.74 // 2 * π * 45 (radius)
    let currentOffset = 0

    const gradients = [
        { id: 'gradient1', colors: ['#10b981', '#14b8a6'] },
        { id: 'gradient2', colors: ['#3b82f6', '#06b6d4'] },
        { id: 'gradient3', colors: ['#a855f7', '#ec4899'] },
        { id: 'gradient4', colors: ['#f97316', '#ef4444'] },
        { id: 'gradient5', colors: ['#eab308', '#f59e0b'] }
    ]

    return (
        <div className='flex items-center justify-center'>
            <div className='relative w-48 h-48'>
                <svg className='w-full h-full -rotate-90' viewBox='0 0 100 100'>
                    {chartData.map((item, index) => {
                        const percentage = parseFloat(item.value) / 100
                        const dashArray = percentage * circumference
                        const dashOffset = -currentOffset
                        currentOffset += dashArray

                        const gradient = gradients[index % gradients.length]

                        return (
                            <circle
                                key={index}
                                cx='50'
                                cy='50'
                                r='40'
                                fill='none'
                                stroke={`url(#${gradient.id})`}
                                strokeWidth='12'
                                strokeDasharray={`${dashArray} ${circumference}`}
                                strokeDashoffset={dashOffset}
                                className='transition-all duration-1000'
                                style={{ animationDelay: `${index * 200}ms` }}
                            />
                        )
                    })}

                    <defs>
                        {gradients.map((gradient) => (
                            <linearGradient
                                key={gradient.id}
                                id={gradient.id}
                                x1='0%'
                                y1='0%'
                                x2='100%'
                                y2='100%'
                            >
                                <stop offset='0%' stopColor={gradient.colors[0]} />
                                <stop offset='100%' stopColor={gradient.colors[1]} />
                            </linearGradient>
                        ))}
                    </defs>
                </svg>

                <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-text-primary flex items-center justify-center gap-1'>
                            <Taka color='text-text-primary' size='text-2xl' />
                            <span>{totalRevenue ? totalRevenue : '0'}</span>
                        </div>
                        <p className='text-xs text-muted-foreground'>Total Revenue</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
