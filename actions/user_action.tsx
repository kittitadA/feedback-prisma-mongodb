import axios from "axios"

export const OPEN_MODAL_LOGIN = "OPEN_MODAL_LOGIN"
export const GET_CURRENT_USER = "GET_CURRENT_USER"

export const openModalLogin = (
    login: boolean = false,
    register: boolean = false
) => {
    return {
        type: OPEN_MODAL_LOGIN,
        login,
        register,
    }
}

export async function getCurrentUser(email: string) {
    const response = await axios.get(`/api/users/email/${email}`)
    return {
        type: GET_CURRENT_USER,
        payload: response,
    }
}
