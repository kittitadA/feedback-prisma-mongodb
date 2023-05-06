import { useCallback, useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { connect } from "react-redux"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"

import Button from "../Button"
import ModalLogin from "../modals/ModalLogin"
import ModalRegister from "../modals/ModalRegister"

import { openModalLogin, getCurrentUser } from "@/actions/user_action"

interface navbarProps {
    openModalLogin: (login?: boolean, register?: boolean) => any
    getCurrentUser: (email: string) => any
    statusModalLogin: boolean
    statusModalRegister: boolean
    user: any
}

const Navbar: React.FC<navbarProps> = ({
    openModalLogin,
    statusModalLogin,
    statusModalRegister,
    user,
    getCurrentUser,
}) => {
    const { data: session } = useSession()
    const [showDropdown, setShowDropdown] = useState(false)

    function loadCurrentUser(session: any) {
        if (session?.user?.email && !user) {
            getCurrentUser(session.user.email)
        }
    }

    const checkCloseDropdown = useCallback((e: any) => {
        let element = document.getElementById("dropdown_navbar")
        if (element) {
            let clicked = element.contains(e.target)
            if (!clicked) {
                setShowDropdown(false)
            }
        }
    }, [])

    useEffect(() => {
        loadCurrentUser(session)
    }, [session])

    useEffect(() => {
        if (showDropdown) {
            document.addEventListener("click", checkCloseDropdown)
        }
        return () => {
            document.removeEventListener("click", checkCloseDropdown)
        }
    }, [showDropdown])

    function openLogin() {
        openModalLogin(true)
    }

    async function logOut() {
        signOut({ callbackUrl: "/" }).catch((err) => {
            toast.error(err.message)
        })
    }

    function toggleShowDropdown() {
        setShowDropdown((prev: boolean) => !prev)
    }

    return (
        <div className="fixed top-0 h-[52px] w-full bg-violet-950 z-20">
            <div className="flex flex-row justify-between px-2">
                <Link
                    href="/"
                    className="flex flex-row items-center py-3 px-2"
                >
                    <Image
                        src="/feed_icon.png"
                        alt="feed icon"
                        width={28}
                        height={28}
                    />
                    <p className="text-lg text-white font-semibold ml-1">
                        Feedback
                    </p>
                </Link>

                {!user && (
                    <div className="py-2 px-2">
                        <Button
                            label="Login"
                            onClick={openLogin}
                        />
                    </div>
                )}

                {user && (
                    <div
                        id="dropdown_navbar"
                        className="relative inline-block text-left py-2 dropdown_navbar"
                    >
                        <div
                            onClick={toggleShowDropdown}
                            className="cursor-pointer"
                        >
                            <Image
                                src={
                                    user.image ? user.image : "/unknow_user.png"
                                }
                                alt="profile_image"
                                width={36}
                                height={36}
                                className="rounded-full bg-neutral-400 animation-fadeIn"
                                aria-expanded="true"
                                aria-haspopup="true"
                                id="menu-button"
                            />
                        </div>
                        {showDropdown && (
                            <div
                                className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="menu-button"
                                tabIndex={-1}
                            >
                                <div
                                    className="py-1"
                                    role="none"
                                >
                                    <button
                                        onClick={logOut}
                                        className="text-start text-gray-700 block px-4 py-2 text-sm w-full hover:bg-slate-100"
                                        role="menuitem"
                                        tabIndex={-1}
                                        id="menu-item-1"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {statusModalLogin && <ModalLogin />}
                {statusModalRegister && <ModalRegister />}
            </div>
        </div>
    )
}

function mapStateToProps(state: any) {
    return {
        statusModalLogin: state.user.modalLogin,
        statusModalRegister: state.user.modalRegister,
        user: state.user.user,
    }
}

export default connect(mapStateToProps, { openModalLogin, getCurrentUser })(
    Navbar
)
