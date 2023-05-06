import { Oval } from "react-loader-spinner"

interface selectProps {
    children: React.ReactNode
    id: string
    onChange: (e: any) => void
    value: string
    className?: string
    disabled?: boolean
    loading?: boolean
}

const Select: React.FC<selectProps> = ({
    children,
    id,
    onChange,
    value,
    className,
    disabled,
    loading,
}) => {
    return (
        <div className="relative w-fit">
            <select
                id={id}
                value={value}
                disabled={disabled || loading}
                onChange={onChange}
                className={`
                rounded
                border
                border-neutral-200
                pl-2
                pr-6
                py-1.5
                outline-none
                focus:border-indigo-400
                opacity-100
                ${
                    disabled || loading
                        ? "text-neutral-400 bg-zinc-100 cursor-not-allowed"
                        : "text-neutral-700 bg-indigo-50"
                }
               
                ${className}
            `}
            >
                {children}
            </select>
            {loading && (
                <div
                    className="
                        absolute right-[5px] top-[50%] -translate-y-[50%] w-[16px] h-[16px]
                        bg-zinc-100
                    "
                >
                    <Oval
                        height={16}
                        width={16}
                        color={"#1E3A8A"}
                        wrapperStyle={{}}
                        wrapperClass="!p-0"
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor={"#1E3A8A"}
                        strokeWidth={5}
                        strokeWidthSecondary={5}
                    />
                </div>
            )}
        </div>
    )
}

export default Select
