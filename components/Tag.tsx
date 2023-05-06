interface tagProps {
    label: string
    active?: boolean
    onClick?: () => void
    bgColor?: string
    bgColorActive?: string
    textColor?: string
    textColorActive?: string
    className?: string
    textClassName?: string
}

const Tag: React.FC<tagProps> = ({
    label,
    onClick,
    active = false,
    bgColor,
    bgColorActive,
    textColor,
    textColorActive,
    textClassName,
    className,
}) => {
    return (
        <div
            onClick={onClick}
            className={`
                px-3 
                py-1 
                rounded-lg 
                shadow-sm 
                ${onClick ? "cursor-pointer hover:opacity-80" : ""}
                ${
                    bgColor
                        ? active
                            ? bgColorActive
                            : bgColor
                        : active
                        ? "bg-blue-700"
                        : "bg-blue-100"
                }
                ${className}
            `}
        >
            <p
                className={`
                    text-sm 
                    font-semibold
                    ${
                        textColor
                            ? active
                                ? textColorActive
                                : textColor
                            : active
                            ? "text-white"
                            : "text-blue-700 "
                    }
                    ${textClassName}
                `}
            >
                {label}
            </p>
        </div>
    )
}

export default Tag
