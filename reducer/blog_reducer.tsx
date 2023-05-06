import update from "react-addons-update"

import {
    GET_BLOG,
    CREATE_BLOG,
    DELETE_BLOG,
    GET_COMMENT_FOR_BLOG,
    INSERT_COMMENT,
    GET_SPECIFY_BLOG,
    INSERT_REPLY_COMMENT,
    VOTE_BLOG,
    GET_CATEGORY,
    UPDATE_BLOG,
    CHANGE_CATEGORY_OR_SORT,
    GET_COUNT_ROADMAP,
    GET_ROADMAP_BLOG,
    GET_ALL_ROADMAP_BLOG,
} from "../actions/blog_action"

import { findBlogInRoadmap } from "./redux_utillity"

const initailState = {
    blog_page: {
        mode_category: { id: null, name: null },
        sort: "vote",
        data: [],
        loaded: false,
    },
    category: { data: [], loaded: false },
    roadmap: { data: [], loaded: false },
    roadmap_admin: { data: [], loaded: false },
}

function blogReducer(state: any = initailState, action: any) {
    let data, index, idx, value
    switch (action.type) {
        case GET_BLOG:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    blog_page: {
                        data: { $set: action.payload.data.data },
                        loaded: { $set: true },
                        sort: { $set: action.sort },
                    },
                })
            } else {
                return state
            }

        case CHANGE_CATEGORY_OR_SORT:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    blog_page: {
                        data: { $set: action.payload.data.data },
                        mode_category: { $set: action.category },
                        sort: { $set: action.sort },
                    },
                })
            } else {
                return state
            }

        case CREATE_BLOG:
            if (
                action.payload.data?.message === "Success" &&
                state.blog_page.loaded
            ) {
                return update(state, {
                    blog_page: {
                        data: {
                            $apply: (p) => {
                                if (
                                    action.payload.data.data.blog.category
                                        .id ===
                                        state.blog_page.mode_category.id ||
                                    state.blog_page.mode_category.id ===
                                        "6451ccc5b6fe89bc53559363"
                                ) {
                                    p.unshift({
                                        ...action.payload.data.data.blog,
                                    })
                                }

                                return p
                            },
                        },
                    },
                    roadmap: {
                        data: {
                            $apply: (p) => {
                                if (
                                    p.some((data: any) => {
                                        return (
                                            data.hasOwnProperty("blog") &&
                                            data.id ===
                                                action.payload.data.data.blog
                                                    .roadmap.id
                                        )
                                    })
                                ) {
                                    index = p.findIndex(
                                        (item: any) =>
                                            item.id ===
                                            action.payload.data.data.blog
                                                .roadmap.id
                                    )
                                    if (index > -1) {
                                        p = update(p, {
                                            [index]: {
                                                _count: {
                                                    blog: {
                                                        $apply: (m: number) =>
                                                            m + 1,
                                                    },
                                                },
                                                blog: {
                                                    $unshift: [
                                                        {
                                                            ...action.payload
                                                                .data.data.blog,
                                                        },
                                                    ],
                                                },
                                            },
                                        })
                                    }
                                }
                                return p
                            },
                        },
                    },
                })
            } else {
                return state
            }

        case DELETE_BLOG:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    blog_page: {
                        data: {
                            $apply: (p) => {
                                if (
                                    action.payload.data.data.category_id ===
                                        state.blog_page.mode_category.id ||
                                    state.blog_page.mode_category.id ===
                                        "6451ccc5b6fe89bc53559363"
                                ) {
                                    let index = p.findIndex(
                                        (item: any) =>
                                            item.id === action.blog_id
                                    )

                                    if (index > -1) {
                                        p = update(p, { $splice: [[index, 1]] })
                                    }
                                }

                                return p
                            },
                        },
                    },
                    roadmap: {
                        data: {
                            $apply: (p) => {
                                let { roadmap_index, blog_index } =
                                    findBlogInRoadmap(p, action.blog_id)
                                if (roadmap_index > -1 && blog_index > -1) {
                                    p = update(p, {
                                        [roadmap_index]: {
                                            _count: {
                                                blog: {
                                                    $apply: (m: number) =>
                                                        m - 1,
                                                },
                                            },
                                            blog: {
                                                $splice: [[blog_index, 1]],
                                            },
                                        },
                                    })
                                } else {
                                    index = p.findIndex(
                                        (item: any) =>
                                            item.id ===
                                            action.payload.data.data.roadmap_id
                                    )
                                    if (index > -1) {
                                        p = update(p, {
                                            [index]: {
                                                _count: {
                                                    blog: {
                                                        $apply: (m: number) =>
                                                            m - 1,
                                                    },
                                                },
                                            },
                                        })
                                    }
                                }
                                return p
                            },
                        },
                    },
                })
            } else {
                return state
            }

        case GET_COMMENT_FOR_BLOG:
            if (action.payload.data?.message === "Success") {
                if (action.index_blog > -1) {
                    return update(state, {
                        blog_page: {
                            data: {
                                $apply: (p) => {
                                    index = p.findIndex(
                                        (item: any) =>
                                            item.id === action.blog_id
                                    )
                                    if (index > -1) {
                                        p = update(p, {
                                            [index]: {
                                                comment: {
                                                    $set: action.payload.data
                                                        .data,
                                                },
                                            },
                                        })
                                    }
                                    return p
                                },
                            },
                        },
                    })
                }
                return state
            } else {
                return state
            }

        case INSERT_COMMENT:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    blog_page: {
                        data: {
                            $apply: (p) => {
                                index = p.findIndex(
                                    (item: any) => item.id === action.blog_id
                                )
                                if (index > -1) {
                                    p = update(p, {
                                        [index]: {
                                            comment: {
                                                $push: [
                                                    {
                                                        ...action.payload.data
                                                            .data,
                                                    },
                                                ],
                                            },
                                        },
                                    })
                                }
                                return p
                            },
                        },
                    },
                    roadmap: {
                        data: {
                            $apply: (p) => {
                                let { roadmap_index, blog_index } =
                                    findBlogInRoadmap(p, action.blog_id)
                                if (roadmap_index > -1 && blog_index > -1) {
                                    p = update(p, {
                                        [roadmap_index]: {
                                            blog: {
                                                [blog_index]: {
                                                    comment: {
                                                        $push: [
                                                            {
                                                                ...action
                                                                    .payload
                                                                    .data.data,
                                                            },
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                    })
                                }
                                return p
                            },
                        },
                    },
                })
            } else {
                return state
            }

        case INSERT_REPLY_COMMENT:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    blog_page: {
                        data: {
                            $apply: (p) => {
                                index = p.findIndex(
                                    (item: any) => item.id === action.blog_id
                                )
                                if (index > -1) {
                                    p = update(p, {
                                        [index]: {
                                            comment: {
                                                $apply: (m: any) => {
                                                    idx = m.findIndex(
                                                        (item: any) =>
                                                            item.id ===
                                                            action.comment_id
                                                    )
                                                    if (idx > -1) {
                                                        m = update(m, {
                                                            [idx]: {
                                                                reply: {
                                                                    $push: [
                                                                        {
                                                                            ...action
                                                                                .payload
                                                                                .data
                                                                                .data,
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                        })
                                                    }
                                                    return m
                                                },
                                            },
                                        },
                                    })
                                }
                                return p
                            },
                        },
                    },
                    roadmap: {
                        data: {
                            $apply: (p) => {
                                let { roadmap_index, blog_index } =
                                    findBlogInRoadmap(p, action.blog_id)

                                if (roadmap_index > -1 && blog_index > -1) {
                                    p = update(p, {
                                        [roadmap_index]: {
                                            blog: {
                                                [blog_index]: {
                                                    comment: {
                                                        $apply: (m: any) => {
                                                            idx = m.findIndex(
                                                                (item: any) =>
                                                                    item.id ===
                                                                    action.comment_id
                                                            )
                                                            if (idx > -1) {
                                                                m = update(m, {
                                                                    [idx]: {
                                                                        reply: {
                                                                            $push: [
                                                                                {
                                                                                    ...action
                                                                                        .payload
                                                                                        .data
                                                                                        .data,
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                })
                                                            }
                                                            return m
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    })
                                }
                                return p
                            },
                        },
                    },
                })
            } else {
                return state
            }

        case GET_SPECIFY_BLOG:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    blog_page: {
                        data: {
                            $push: [{ ...action.payload.data.data }],
                        },
                        loaded: { $set: false },
                        mode_category: {
                            $apply: (p) => {
                                if (
                                    state.category.loaded &&
                                    state.category.data.length > 0
                                ) {
                                    p = update(p, {
                                        id: { $set: state.category.data[0].id },
                                        name: {
                                            $set: state.category.data[0].name,
                                        },
                                    })
                                    return p
                                }
                            },
                        },
                        sort: { $set: "vote" },
                    },
                })
            } else {
                return state
            }

        case VOTE_BLOG:
            if (
                action.payload.data?.message === "Success vote" ||
                action.payload.data?.message === "Success unvote"
            ) {
                return update(state, {
                    blog_page: {
                        data: {
                            $apply: (p) => {
                                index = p.findIndex(
                                    (item: any) => item.id === action.blog_id
                                )
                                if (index > -1) {
                                    p = update(p, {
                                        [index]: {
                                            vote: {
                                                user_id: {
                                                    $set: action.payload.data
                                                        .data.vote.user_id,
                                                },
                                            },
                                        },
                                    })
                                }
                                return p
                            },
                        },
                    },
                    roadmap: {
                        data: {
                            $apply: (p) => {
                                let { roadmap_index, blog_index } =
                                    findBlogInRoadmap(p, action.blog_id)
                                if (roadmap_index > -1 && blog_index > -1) {
                                    p = update(p, {
                                        [roadmap_index]: {
                                            blog: {
                                                [blog_index]: {
                                                    vote: {
                                                        user_id: {
                                                            $set: action.payload
                                                                .data.data.vote
                                                                .user_id,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    })
                                }

                                return p
                            },
                        },
                    },
                })
            } else {
                return state
            }

        case GET_CATEGORY:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    category: {
                        data: { $set: action.payload.data.data },
                        loaded: { $set: true },
                    },
                    blog_page: {
                        mode_category: {
                            $apply: (p) => {
                                if (action.payload.data.data.length > 0) {
                                    return action.payload.data.data[0]
                                }
                                return p
                            },
                        },
                    },
                })
            } else {
                return state
            }

        case UPDATE_BLOG:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    blog_page: {
                        data: {
                            $apply: (p) => {
                                index = state.blog_page.data.findIndex(
                                    (item: any) => item.id === action.blog_id
                                )
                                if (index > -1) {
                                    p = update(p, {
                                        [index]: {
                                            $set: action.payload.data.data,
                                        },
                                    })
                                }
                                return p
                            },
                        },
                    },
                    roadmap: {
                        data: {
                            $apply: (p) => {
                                let { roadmap_index, blog_index } =
                                    findBlogInRoadmap(p, action.blog_id)

                                index = p.findIndex(
                                    (item: any) =>
                                        item.id ===
                                        action.payload.data.data.roadmap.id
                                )

                                if (roadmap_index > -1 && blog_index > -1) {
                                    if (
                                        p[roadmap_index].id ===
                                        action.payload.data.data.roadmap.id
                                    ) {
                                        p = update(p, {
                                            [roadmap_index]: {
                                                blog: {
                                                    [blog_index]: {
                                                        $set: action.payload
                                                            .data.data,
                                                    },
                                                },
                                            },
                                        })
                                    } else {
                                        if (index > -1) {
                                            p = update(p, {
                                                [index]: {
                                                    _count: {
                                                        blog: {
                                                            $apply: (
                                                                p: number
                                                            ) => p + 1,
                                                        },
                                                    },
                                                    blog: {
                                                        $unshift: [
                                                            {
                                                                ...action
                                                                    .payload
                                                                    .data.data,
                                                            },
                                                        ],
                                                    },
                                                },
                                                [roadmap_index]: {
                                                    _count: {
                                                        blog: {
                                                            $apply: (
                                                                p: number
                                                            ) => p - 1,
                                                        },
                                                    },
                                                    blog: {
                                                        $splice: [
                                                            [blog_index, 1],
                                                        ],
                                                    },
                                                },
                                            })
                                        } else {
                                            p = update(p, {
                                                [roadmap_index]: {
                                                    _count: {
                                                        blog: {
                                                            $apply: (
                                                                p: number
                                                            ) => p - 1,
                                                        },
                                                    },
                                                    blog: {
                                                        $splice: [
                                                            [blog_index, 1],
                                                        ],
                                                    },
                                                },
                                            })
                                        }
                                    }
                                } else if (index > -1) {
                                    if (p[index].id !== action.old_roadmap_id) {
                                        p = update(p, {
                                            [index]: {
                                                _count: {
                                                    blog: {
                                                        $apply: (p: number) =>
                                                            p + 1,
                                                    },
                                                },
                                            },
                                        })

                                        if (p[index].hasOwnProperty("blog")) {
                                            p = update(p, {
                                                [index]: {
                                                    blog: {
                                                        $unshift: [
                                                            {
                                                                ...action
                                                                    .payload
                                                                    .data.data,
                                                            },
                                                        ],
                                                    },
                                                },
                                            })
                                        }

                                        idx = p.findIndex(
                                            (item: any) =>
                                                item.id ===
                                                action.old_roadmap_id
                                        )
                                        if (idx > -1) {
                                            p = update(p, {
                                                [idx]: {
                                                    _count: {
                                                        blog: {
                                                            $apply: (
                                                                p: number
                                                            ) => p - 1,
                                                        },
                                                    },
                                                },
                                            })
                                        }
                                    }
                                } else {
                                    idx = p.findIndex(
                                        (item: any) =>
                                            item.id === action.old_roadmap_id
                                    )
                                    if (idx > -1) {
                                        p = update(p, {
                                            [idx]: {
                                                _count: {
                                                    blog: {
                                                        $apply: (p: number) =>
                                                            p - 1,
                                                    },
                                                },
                                            },
                                        })
                                    }
                                }

                                return p
                            },
                        },
                    },
                })
            } else {
                return state
            }

        case GET_COUNT_ROADMAP:
            if (
                !state.roadmap.loaded &&
                action.payload.data?.message === "Success"
            ) {
                return update(state, {
                    roadmap: {
                        data: { $set: action.payload.data.data },
                        loaded: { $set: true },
                    },
                })
            } else {
                return state
            }

        case GET_ROADMAP_BLOG:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    roadmap: {
                        data: { $set: action.payload.data.data },
                        loaded: { $set: true },
                    },
                })
            } else {
                return state
            }

        case GET_ALL_ROADMAP_BLOG:
            if (action.payload.data?.message === "Success") {
                return update(state, {
                    roadmap_admin: {
                        data: { $set: action.payload.data.data },
                        loaded: { $set: true },
                    },
                })
            } else {
                return state
            }

        default:
            return state
    }
}

export default blogReducer
