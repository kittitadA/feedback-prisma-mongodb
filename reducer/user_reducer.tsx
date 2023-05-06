import update from "react-addons-update"

import { OPEN_MODAL_LOGIN, GET_CURRENT_USER } from "../actions/user_action"

const initailState = {
    auth: false,
    user: null,
    modalLogin: false,
    modalRegister: false,
}

function userReducer(state = initailState, action: any) {
    let data
    switch (action.type) {
        case OPEN_MODAL_LOGIN:
            return update(state, {
                modalLogin: { $set: action.login },
                modalRegister: { $set: action.register },
            })

        case GET_CURRENT_USER:
            if (action.payload?.data?.data) {
                data = {
                    email: action.payload.data.data.email,
                    privilege: action.payload.data.data.privilege,
                    ...action.payload.data.data.profile,
                }
                delete data.id
                return update(state, {
                    auth: { $set: true },
                    user: {
                        $set: {
                            email: action.payload.data.data.email,
                            privilege: action.payload.data.data.privilege,
                            ...action.payload.data.data.profile,
                        },
                    },
                })
            } else {
                return state
            }

        default:
            return state
    }
}

export default userReducer
