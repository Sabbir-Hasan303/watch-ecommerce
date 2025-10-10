export function DonutChart () {
    return (
        <div className='flex items-center justify-center'>
            <div className='relative w-48 h-48'>
                <svg className='w-full h-full -rotate-90' viewBox='0 0 100 100'>
                    {/* Electronics - 45% */}
                    <circle
                        cx='50'
                        cy='50'
                        r='40'
                        fill='none'
                        stroke='url(#gradient1)'
                        strokeWidth='12'
                        strokeDasharray='113 282'
                        strokeDashoffset='0'
                        className='transition-all duration-1000'
                    />
                    {/* Clothing - 30% */}
                    <circle
                        cx='50'
                        cy='50'
                        r='40'
                        fill='none'
                        stroke='url(#gradient2)'
                        strokeWidth='12'
                        strokeDasharray='75 282'
                        strokeDashoffset='-113'
                        className='transition-all duration-1000'
                    />
                    {/* Food - 15% */}
                    <circle
                        cx='50'
                        cy='50'
                        r='40'
                        fill='none'
                        stroke='url(#gradient3)'
                        strokeWidth='12'
                        strokeDasharray='38 282'
                        strokeDashoffset='-188'
                        className='transition-all duration-1000'
                    />
                    {/* Others - 10% */}
                    <circle
                        cx='50'
                        cy='50'
                        r='40'
                        fill='none'
                        stroke='url(#gradient4)'
                        strokeWidth='12'
                        strokeDasharray='25 282'
                        strokeDashoffset='-226'
                        className='transition-all duration-1000'
                    />

                    <defs>
                        <linearGradient
                            id='gradient1'
                            x1='0%'
                            y1='0%'
                            x2='100%'
                            y2='100%'
                        >
                            <stop offset='0%' stopColor='#10b981' />
                            <stop offset='100%' stopColor='#14b8a6' />
                        </linearGradient>
                        <linearGradient
                            id='gradient2'
                            x1='0%'
                            y1='0%'
                            x2='100%'
                            y2='100%'
                        >
                            <stop offset='0%' stopColor='#3b82f6' />
                            <stop offset='100%' stopColor='#06b6d4' />
                        </linearGradient>
                        <linearGradient
                            id='gradient3'
                            x1='0%'
                            y1='0%'
                            x2='100%'
                            y2='100%'
                        >
                            <stop offset='0%' stopColor='#a855f7' />
                            <stop offset='100%' stopColor='#ec4899' />
                        </linearGradient>
                        <linearGradient
                            id='gradient4'
                            x1='0%'
                            y1='0%'
                            x2='100%'
                            y2='100%'
                        >
                            <stop offset='0%' stopColor='#f97316' />
                            <stop offset='100%' stopColor='#ef4444' />
                        </linearGradient>
                    </defs>
                </svg>

                <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center'>
                        <p className='text-2xl font-bold text-text-primary'>$45.2K</p>
                        <p className='text-xs text-text-secondary'>Total Sales</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
