import * as LucideIcons from 'lucide-react'

export const LucideIcon = ({ name, className = 'w-5 h-5', ...props }) => {
    if (!name) return null

    // Get the icon component from lucide-react by name (in PascalCase)
    const IconComponent = LucideIcons[name]

    if (!IconComponent) {
        // Fallback if icon name doesn't exist
        return <LucideIcons.HelpCircle className={className} {...props} />
    }

    return <IconComponent className={className} {...props} />
}

