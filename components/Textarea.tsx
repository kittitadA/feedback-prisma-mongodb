import { useRef } from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface textareaProps {
    label: string
    id: string
    value: string
    required?: boolean
    disabled?: boolean
    row?: number
    register?: UseFormRegister<FieldValues> | undefined
    errors?: FieldErrors
    customValidate?: any
}

const Textarea: React.FC<textareaProps> = ({
    label,
    id,
    value,
    required,
    disabled,
    register,
    errors,
    customValidate,
    row = 3,
}) => {
    const textareaRef: any = useRef(null)

    function updateTextareaHeight(e: any) {
        let element = document.getElementById(id)
        if (element) {
            element.style.height = "0px"
            element.style.height = e.target.scrollHeight + 2 + "px"
        }
    }

    function focus(e: any) {
        if (textareaRef.current) {
            textareaRef.current.childNodes[0].focus()
        }
    }

    return (
        <div
            ref={textareaRef}
            className={`
                w-full relative overflow-hidden
                border
                rounded
                bg-indigo-50
                ${
                    errors![id]
                        ? "border-rose-600"
                        : "border-neutral-200 focus:border-indigo-400"
                }
            `}
        >
            <textarea
                id={id}
                value={value}
                placeholder=" "
                rows={row}
                disabled={disabled}
                onInput={updateTextareaHeight}
                className={`
                    w-full
                    min-h-[89.6px]
                    max-h-[40vh]
                    peer
                    bg-indigo-50
                    px-2
                    pt-4
                    pb-1
                    outline-none
                    ${disabled ? "text-neutral-400 cursor-not-allowed" : ""}

                `}
                {...register!(id, { required, ...customValidate })}
            />
            <label
                onClick={focus}
                className={`
                    select-none
                    w-[120%]
                    bg-indigo-50
                    text-sm
                    text-zinc-400
                    absolute
                    left-1
                    right-1
                    top-2
                    pl-1
                    py-0.5
                    origin-[0]
                    duration-150 
                    transform
                    -translate-y-3
                    scale-90
                    peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0
                    peer-placeholder-shown:text-zinc-400
                    peer-focus:scale-90
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

export default Textarea
