export function findBlogInRoadmap(roadmapData: any, blog_id: string) {
    let blog_index = -1,
        roadmap_index = -1
    for (let i = 0; i < roadmapData.length; i++) {
        if (roadmapData[i].hasOwnProperty("blog")) {
            blog_index = roadmapData[i].blog.findIndex(
                (item: any) => item.id === blog_id
            )
            if (blog_index > -1) {
                roadmap_index = i
                break
            }
        } else {
            break
        }
    }
    return { roadmap_index, blog_index }
}
