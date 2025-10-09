export function BarChart () {
    const data = [
        {
            category: 'Electronics',
            value: 85,
            color: 'from-emerald-500 to-teal-500'
        },
        { category: 'Clothing', value: 65, color: 'from-blue-500 to-cyan-500' },
        { category: 'Food', value: 45, color: 'from-purple-500 to-pink-500' },
        { category: 'Books', value: 30, color: 'from-orange-500 to-red-500' },
        { category: 'Toys', value: 55, color: 'from-yellow-500 to-orange-500' }
    ]

    const maxValue = Math.max(...data.map(d => d.value))

    return (
        <div className='h-64 space-y-4'>
            {data.map((item, index) => (
                <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-400'>{item.category}</span>
                        <span className='text-white font-medium'>
                            {item.value}%
                        </span>
                    </div>
                    <div className='h-3 bg-white/5 rounded-full overflow-hidden'>
                        <div
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{
                                width: `${(item.value / maxValue) * 100}%`,
                                animationDelay: `${index * 100}ms`
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
