export function AreaChart ({ data }) {
    const defaultData = [
        { month: 'No Data', revenue: 0 }
    ]

    const chartData = data && data.length > 0 ? data : defaultData

    const maxValue = Math.max(...chartData.map(d => d.revenue))

    return (
        <div className='h-64 flex items-end justify-between gap-4'>
            {chartData.map((item, index) => (
                <div
                    key={index}
                    className='flex-1 flex flex-col items-center gap-2'
                >
                    <div
                        className='w-full relative'
                        style={{ height: '200px' }}
                    >
                        <div
                            className='absolute bottom-0 w-full bg-gradient-to-t from-emerald-500/50 to-teal-500/20 rounded-t-lg transition-all duration-1000 ease-out hover:from-emerald-500/70 hover:to-teal-500/30'
                            style={{
                                height: `${maxValue > 0 ? (item.revenue / maxValue) * 100 : 0}%`,
                                animationDelay: `${index * 100}ms`
                            }}
                        />
                    </div>
                    <span className='text-xs text-muted-foreground'>{item.month}</span>
                </div>
            ))}
        </div>
    )
}
