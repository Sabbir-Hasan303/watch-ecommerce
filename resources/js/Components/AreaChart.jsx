export function AreaChart () {
    const data = [
        { month: 'Jan', value: 30 },
        { month: 'Feb', value: 45 },
        { month: 'Mar', value: 35 },
        { month: 'Apr', value: 60 },
        { month: 'May', value: 50 },
        { month: 'Jun', value: 75 }
    ]

    const maxValue = Math.max(...data.map(d => d.value))

    return (
        <div className='h-64 flex items-end justify-between gap-4'>
            {data.map((item, index) => (
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
                                height: `${(item.value / maxValue) * 100}%`,
                                animationDelay: `${index * 100}ms`
                            }}
                        />
                    </div>
                    <span className='text-xs text-gray-500'>{item.month}</span>
                </div>
            ))}
        </div>
    )
}
