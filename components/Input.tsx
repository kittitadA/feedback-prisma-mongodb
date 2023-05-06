import { useRef } from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface inputProps {
    label: string
    id: string
    value: string
    required?: boolean
    disabled?: boolean
    type?: string
    register?: UseFormRegister<FieldValues> | undefined
    errors?: FieldErrors
    customValidate?: any
}

const Input: React.FC<inputProps> = ({
    label,
    id,
    value,
    type = "text",
    required,
    disabled,
    register,
    errors,
    customValidate,
}) => {
    const inputRef: any = useRef(null)

    function focus(e: any) {
        if (inputRef.current) {
            inputRef.current.childNodes[0].focus()
        }
    }

    return (
        <div
            ref={inputRef}
            className="w-full relative"
        >
            <input
                id={id}
                type={type}
                value={value}
                placeholder=" "
                disabled={disabled}
                className={`
                    w-full
                    peer
                    rounded
                    bg-indigo-50
                    px-2
                    pb-1
                    pt-4
                    outline-none
                    border
                    ${disabled ? "text-neutral-400 cursor-not-allowed" : ""}
                    ${
                        errors![id]
                            ? "border-rose-600"
                            : "border-neutral-200 focus:border-indigo-400"
                    }
                `}
                {...register!(id, { required, ...customValidate })}
            />
            <label
                onClick={focus}
                className={`
                    select-none
                    text-sm
                    text-zinc-400
                    absolute 
                    left-2 
                    top-3
                    origin-[0]
                    duration-150 
                    transform
                    -translate-y-3
                    scale-90
                    peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 
                    peer-placeholder-shown:text-zinc-400
                    peer-focus:scale-75
                    peer-focus:-translate-y-3
                    ${disabled ? "cursor-not-allowed" : "cursor-text"}
                    ${
                        errors![id]
                            ? "text-rose-600  peer-focus:text-rose-600"
                            : "text-zinc-400  peer-focus:text-indigo-600"
                    }
                `}
            >
                {label}
            </label>
        </div>
    )
}

export default Input
