import { useState } from "react"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import { connect } from "react-redux"
import { useRouter } from "next/router"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"

import { GrClose } from "react-icons/gr"
import { regexEmail } from "../utility"
import Button from "../Button"
import Input from "../Input"

import { openModalLogin } from "@/actions/user_action"

interface modalLoginProps {
    openModalLogin: (login?: boolean, register?: boolean) => any
}

const ModalLogin: React.FC<modalLoginProps> = ({ openModalLogin }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const router = useRouter()
    const email = watch("watch")
    const password = watch("password")
    const [disabled, setDisabled] = useState(false)

    function close() {
        if (!disabled) {
            openModalLogin()
        }
    }

    function openRegister() {
        openModalLogin(false, true)
    }

    const loginHandler: SubmitHandler<FieldValues> = (data) => {
        setDisabled(true)
        signIn("credentials", { ...data, redirect: false }).then((res) => {
            setDisabled(false)

            if (res?.ok) {
                toast.success("Login success")
                close()
            }

            if (res?.error) {
                toast.error("The email or password is incorrect")
            }
        })
    }

    return (
        <>
            <div className="fixed inset-0 bg-neutral-950 opacity-80"></div>
            <div className="absolute flex inset-0 h-screen w-full overflow-y-auto px-4 py-4">
                <div className="relative bg-white rounded-lg px-5 pb-8 pt-14 w-full max-w-sm m-auto">
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={close}
                            className="
                                flex items-center justify-center rounded-full w-[34px] h-[34px]
                                hover:bg-neutral-100 cursor-pointer
                            "
                        >
                            <GrClose size={16} />
                        </button>
                    </div>
                    <p className="text-center font-bold text-lg">Login</p>
                    <div className="mt-6">
                        <Input
                            label="Email"
                            id="email"
                            type="email"
                            value={email}
                            required
                            register={register}
                            errors={errors}
                            customValidate={{ pattern: regexEmail }}
                            disabled={disabled}
                        />
                    </div>
                    <div className="mt-4">
                        <Input
                            label="Password"
                            id="password"
                            type="password"
                            value={password}
                            required
                            register={register}
                            errors={errors}
                            customValidate={{ minLength: 4 }}
                            disabled={disabled}
                        />
                    </div>
                    <div className="mt-6">
                        <Button
                            label="Login"
                            className="w-full"
                            onClick={handleSubmit(loginHandler)}
                            loading={disabled}
                        />
                    </div>
                    <div className="mt-2">
                        <Button
                            label="Create account"
                            onClick={openRegister}
                            className="w-full hover:opacity-100"
                            textColor="text-neutral-700"
                            color="bg-transparent hover:bg-violet-50"
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default connect(null, { openModalLogin })(ModalLogin)
