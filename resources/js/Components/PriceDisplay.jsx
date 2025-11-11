import Taka from '@/Components/Taka'

export default function PriceDisplay({ minPrice, maxPrice, className = '' }) {
    if (!minPrice || !maxPrice) {
        return <span className={className}>N/A</span>
    }

    const formattedMin = Number(minPrice).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    const formattedMax = Number(maxPrice).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {minPrice === maxPrice ? (
                <>
                    <Taka size={`${className}`} />
                    <span>{formattedMin}</span>
                </>
            ) : (
                <>
                    <Taka size={`${className}`} />
                    <span>{formattedMin}</span>
                    <span>-</span>
                    <Taka size={`${className}`} />
                    <span>{formattedMax}</span>
                </>
            )}
        </div>
    )
}

