import { useState } from "react"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import { connect } from "react-redux"
import toast from "react-hot-toast"
import axios from "axios"

import { GrClose } from "react-icons/gr"
import { regexEmail } from "../utility"
import Button from "../Button"
import Input from "../Input"

import { openModalLogin } from "@/actions/user_action"

interface modalLoginProps {
    openModalLogin: (login?: boolean, register?: boolean) => any
}

const ModalRegister: React.FC<modalLoginProps> = ({ openModalLogin }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            fname: "",
            lname: "",
            email: "",
            password: "",
        },
    })

    const fname = watch("fname")
    const lname = watch("lname")
    const email = watch("email")
    const password = watch("password")
    const [disabled, setDisabled] = useState(false)

    function close() {
        if (!disabled) {
            openModalLogin()
        }
    }

    function openLogin() {
        openModalLogin(true)
    }

    const submitLogin: SubmitHandler<FieldValues> = (data) => {
        setDisabled(true)
        let { fname, lname, email, password } = data
        axios
            .post("api/register", {
                fname,
                lname,
                email,
                password,
            })
            .then(function (response) {
                toast.success("Register success")
                openLogin()
            })
            .catch(function (error) {
                toast.error(`${error?.response?.data?.message}`)
            })
            .finally(function () {
                setDisabled(false)
            })
    }

    return (
        <>
            <div className="fixed inset-0 bg-neutral-950 opacity-80"></div>
            <div className="absolute flex inset-0 h-screen w-full overflow-y-auto px-4 py-4">
                <div className="relative bg-white rounded-lg px-5 pb-8 pt-14 w-full max-w-md m-auto">
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
                    <p className="text-center font-bold text-lg">
                        Create your account
                    </p>
                    <div className="flex flex-row gap-3 mt-6">
                        <div className="w-1/2">
                            <Input
                                label="First name"
                                id="fname"
                                value={fname}
                                required
                                register={register}
                                errors={errors}
                                disabled={disabled}
                            />
                        </div>
                        <div className="w-1/2">
                            <Input
                                label="Last name"
                                id="lname"
                                value={lname}
                                required
                                register={register}
                                errors={errors}
                                disabled={disabled}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
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
                            className="w-full"
                            color="bg-green-500"
                            label="Create account"
                            onClick={handleSubmit(submitLogin)}
                            loading={disabled}
                        />
                    </div>
                    <div className="mt-2">
                        <Button
                            onClick={openLogin}
                            label="Already Have an account? Login"
                            className="w-full hover:opacity-100"
                            textColor="text-neutral-600 font-normal"
                            color="bg-transparent hover:bg-violet-50"
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default connect(null, { openModalLogin })(ModalRegister)
