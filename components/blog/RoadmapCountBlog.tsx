import { useEffect } from "react"
import { connect } from "react-redux"
import Link from "next/link"

import { getCountRoadmap } from "@/actions/blog_action"

interface roadmapCountProps {
    roadmap: any
    getCountRoadmap: () => any
}

const RoadmapCountBlog: React.FC<roadmapCountProps> = ({
    roadmap,
    getCountRoadmap,
}) => {
    function loadRoadmapCount() {
        if (!roadmap.loaded) {
            getCountRoadmap()
        }
    }

    useEffect(() => {
        loadRoadmapCount()
    }, [])

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-row justify-between items-center">
                <p className="font-bold text-blue-900">Roadmap</p>
                <Link
                    href={"/roadmap"}
                    className="text-sm text-blue-900 py-1 cursor-pointer hover:underline"
                >
                    View
                </Link>
            </div>

            <div className="mt-2">
                {roadmap.loaded && (
                    <>
                        {roadmap.data.map((data: any, index: number) => {
                            return (
                                <div
                                    className="flex flex-row justify-between items-center gap-1"
                                    key={`roadmap_count_${data.id}`}
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <div
                                            className="rounded-full w-[7px] h-[7px]"
                                            style={{
                                                backgroundColor: data.color,
                                            }}
                                        ></div>
                                        <p className="text-sm text-neutral-500">
                                            {data.name}
                                        </p>
                                    </div>
                                    <p className="text-sm text-blue-900 font-bold">
                                        {data._count.blog}
                                    </p>
                                </div>
                            )
                        })}
                    </>
                )}
            </div>

            {!roadmap.loaded && (
                <>
                    {Array(4)
                        .fill(null)
                        .map((data: any, index: number) => (
                            <LoaderRoadmap
                                key={`loader_roadmap_count_${index}`}
                            />
                        ))}
                </>
            )}
        </div>
    )
}

const LoaderRoadmap = () => {
    return (
        <p className="text-sm text-transparent bg-neutral-200 rounded-lg mt-1">
            In-Progress
        </p>
    )
}

function mapStateToProps(state: any) {
    return {
        roadmap: state.blog.roadmap,
    }
}

export default connect(mapStateToProps, { getCountRoadmap })(RoadmapCountBlog)
