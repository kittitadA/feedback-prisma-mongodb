import { combineReducers } from "redux"
import userReducer from "./user_reducer"
import blogReducer from "./blog_reducer"

export default combineReducers({
    user: userReducer,
    blog: blogReducer,
})
