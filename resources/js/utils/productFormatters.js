// Format money to 2 decimal places (Example: 100 -> 100.00)
const formatMoney = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return null;
    }

    return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

// Format price range to 2 decimal places (Example: 100 - 150 -> 100.00 - 150.00)
// If the min and max are the same, return the min
const formatRange = (range) => {
    if (!range) {
        return null
    }

    const min = formatMoney(range.min)
    const max = formatMoney(range.max)

    if (min && max) {
        // return min === max ? min : `${min} - ${max}`
        return min === max ? min : `${min}`
    }

    return min || max || null
}

export { formatMoney, formatRange }

