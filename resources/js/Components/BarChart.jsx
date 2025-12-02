export function BarChart ({ data }) {
    const defaultData = [
        {
            name: 'No Data',
            sales: 0,
            revenue: '$0.00',
            color: 'from-gray-500 to-gray-400'
        }
    ]

    const chartData = data && data.length > 0 ? data : defaultData

    const maxValue = Math.max(...chartData.map(d => d.sales))

    return (
        <div className='h-64 space-y-4'>
            {chartData.map((item, index) => {
                const colors = ['from-emerald-500 to-teal-500', 'from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-red-500', 'from-yellow-500 to-orange-500']
                const colorClass = item.color || colors[index % colors.length]

                return (
                    <div key={index} className='space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                            <span className='text-muted-foreground'>{item.name}</span>
                            <span className='text-text-primary font-medium'>
                                {item.sales} units
                            </span>
                        </div>
                        <div className='h-3 bg-foreground/5 rounded-full overflow-hidden'>
                            <div
                                className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-out`}
                                style={{
                                    width: `${(item.sales / maxValue) * 100}%`,
                                    animationDelay: `${index * 100}ms`
                                }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
