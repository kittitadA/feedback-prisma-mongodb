export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/api/vote_blog",
        "/api/users/:path*",
        "/api/comment_reply",
        "/api/comment",
    ],
}
