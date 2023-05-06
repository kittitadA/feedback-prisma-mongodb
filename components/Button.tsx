import { IconType } from "react-icons"
import { Oval } from "react-loader-spinner"

interface buttonProps {
    onClick: () => void
    icon?: IconType
    label: string
    size?: string
    color?: string
    textColor?: string
    className?: string
    colorIcon?: string
    loadingColor?: string
    secondLoadingColor?: string
    disabled?: boolean
    loading?: boolean
}

const Button: React.FC<buttonProps> = ({
    label,
    onClick,
    size = "sm",
    color = "",
    className = "",
    textColor = "text-white",
    icon: Icon,
    colorIcon = "#fff",
    disabled,
    loading,
    loadingColor = "#fff",
    secondLoadingColor = "#fff",
}) => {
    let padding = "px-4 py-2"
    let iconSize = 24
    if (size === "sm") {
        padding = "px-3 py-2"
        iconSize = 20
    }
    if (size === "lg") {
        iconSize = 28
    }

    return (
        <button
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                rounded-lg 
                text-${size}
                ${padding}
                ${color ? color : "bg-violet-600"}
                ${className}
                ${
                    disabled || loading
                        ? "cursor-not-allowed opacity-75 hover:opacity-75 "
                        : "hover:opacity-80"
                }
            `}
        >
            <div className="relative flex flex-row items-center justify-center">
                {loading && (
                    <div className="absolute top-0 left-[50%] -translate-x-1/2">
                        <Oval
                            height={iconSize}
                            width={iconSize}
                            color={loadingColor}
                            wrapperStyle={{}}
                            wrapperClass="!p-0"
                            visible={true}
                            ariaLabel="oval-loading"
                            secondaryColor={secondLoadingColor}
                            strokeWidth={5}
                            strokeWidthSecondary={5}
                        />
                    </div>
                )}
                {Icon && (
                    <span className={`${loading ? "opacity-0" : ""}`}>
                        <Icon
                            size={iconSize}
                            color={colorIcon}
                        />
                    </span>
                )}
                <span
                    className={`
                        font-semibold
                        ${textColor}
                        ${loading ? "opacity-0" : ""}
                        ${Icon ? "ml-1" : ""}
                    `}
                >
                    {label}
                </span>
            </div>
        </button>
    )
}

export default Button
