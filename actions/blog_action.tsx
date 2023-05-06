import axios from "axios"

export const GET_BLOG = "GET_BLOG"
export const GET_SPECIFY_BLOG = "GET_SPECIFY_BLOG"
export const CREATE_BLOG = "CREATE_BLOG"
export const INSERT_COMMENT = "INSERT_COMMENT"
export const DELETE_BLOG = "DELETE_BLOG"
export const GET_COMMENT_FOR_BLOG = "GET_COMMENT_FOR_BLOG"
export const INSERT_REPLY_COMMENT = "INSERT_REPLY_COMMENT"
export const VOTE_BLOG = "VOTE_BLOG"
export const GET_CATEGORY = "GET_CATEGORY"
export const UPDATE_BLOG = "UPDATE_BLOG"
export const CHANGE_CATEGORY_OR_SORT = "CHANGE_CATEGORY_OR_SORT"
export const GET_COUNT_ROADMAP = "GET_COUNT_ROADMAP"
export const GET_ROADMAP_BLOG = "GET_ROADMAP_BLOG"
export const GET_ALL_ROADMAP_BLOG = "GET_ALL_ROADMAP_BLOG"

export async function getBlog(value: { sort: string } = { sort: "vote" }) {
    const response = await axios.get(`/api/blog?sort=${value.sort}`)
    return {
        type: GET_BLOG,
        payload: response,
        sort: value.sort,
    }
}

export async function getSpecifyBlog(value: { blog_id: string }) {
    const response = await axios.get(`/api/blog/${value.blog_id}`)
    return {
        type: GET_SPECIFY_BLOG,
        payload: response,
    }
}

export async function createBlog(value: {
    title: string
    description: string
    category: Number
    roadmap_id: Number
    user_id: string
}) {
    const response = await axios.post(`/api/blog`, value)
    return {
        type: CREATE_BLOG,
        payload: response,
    }
}

export async function insertComment(value: {
    message: string
    user_id: string
    blog_id: string
}) {
    const response = await axios.post(`/api/comment`, value)
    return {
        type: INSERT_COMMENT,
        payload: response,
        blog_id: value.blog_id,
    }
}

export async function deleteBlog(value: { blog_id: string }) {
    const response = await axios.delete(`/api/blog/${value.blog_id}`)
    return {
        type: DELETE_BLOG,
        payload: response,
        blog_id: value.blog_id,
    }
}

export async function getCommentForBlog(value: {
    blog_id: string
    index_blog: number
}) {
    const response = await axios.get(`/api/comment/${value.blog_id}`)
    return {
        type: GET_COMMENT_FOR_BLOG,
        payload: response,
        blog_id: value.blog_id,
        index_blog: value.index_blog,
    }
}

export async function insertReplyComment(value: {
    message: string
    user_id: string
    blog_id: string
    comment_id: string
}) {
    const response = await axios.post(`/api/comment_reply`, value)
    return {
        type: INSERT_REPLY_COMMENT,
        payload: response,
        blog_id: value.blog_id,
        comment_id: value.comment_id,
    }
}

export async function voteBlog(value: { user_id: string; blog_id: string }) {
    const response = await axios.post(`/api/vote_blog`, value)
    return {
        type: VOTE_BLOG,
        payload: response,
        blog_id: value.blog_id,
    }
}

export async function getCategory() {
    const response = await axios.get(`/api/category`)
    return {
        type: GET_CATEGORY,
        payload: response,
    }
}

export async function updateBlog(value: {
    blog_id: string
    title: string
    description: string
    category_id: string
    roadmap_id: string
    old_roadmap_id: string
}) {
    const response = await axios.patch(`/api/blog/${value.blog_id}`, value)
    return {
        type: UPDATE_BLOG,
        payload: response,
        blog_id: value.blog_id,
        old_roadmap_id: value.old_roadmap_id,
    }
}

export async function changeCategoryOrSort(
    value: { sort: string; category: any } = {
        sort: "vote",
        category: { id: null, name: null },
    }
) {
    const response = await axios.get(
        `/api/blog?sort=${value.sort}&category=${value.category.id}`
    )
    return {
        type: CHANGE_CATEGORY_OR_SORT,
        payload: response,
        sort: value.sort,
        category: value.category,
    }
}

export async function getCountRoadmap() {
    const response = await axios.get(`/api/roadmap?mode=count`)
    return {
        type: GET_COUNT_ROADMAP,
        payload: response,
    }
}

export async function getRoadmapBlog() {
    const response = await axios.get(`/api/roadmap`)
    return {
        type: GET_ROADMAP_BLOG,
        payload: response,
    }
}

export async function getAllRoadmapBlog() {
    const response = await axios.get(`/api/roadmap?mode=all`)
    return {
        type: GET_ALL_ROADMAP_BLOG,
        payload: response,
    }
}
