import { useCallback, useEffect } from "react"
import { connect } from "react-redux"

import Tag from "../Tag"

import { getCategory } from "@/actions/blog_action"

interface categoryProps {
    category: any
    mode_category: any
    getCategory: () => any
    changeCategoryHandler: (value: any) => void
}

const CategoryBlog: React.FC<categoryProps> = ({
    getCategory,
    changeCategoryHandler,
    category,
    mode_category,
}) => {
    const loadCategory = useCallback(() => {
        getCategory()
    }, [])

    useEffect(() => {
        if (!category.loaded) {
            loadCategory()
        }
    }, [])

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-blue-900 font-bold">Category</p>
            <div className="flex flex-row flex-wrap gap-3 mt-3">
                {category.loaded &&
                    category?.data?.map((data: any) => (
                        <Tag
                            key={data.id}
                            label={data.name}
                            active={mode_category.id === data.id}
                            onClick={() => changeCategoryHandler(data)}
                        />
                    ))}

                {!category.loaded &&
                    Array(5)
                        .fill(null)
                        .map((data, index) => (
                            <LoaderTag key={`loading_category_${index}`} />
                        ))}
            </div>
        </div>
    )
}

const LoaderTag = () => {
    return (
        <div className="px-3 py-1 rounded-lg shadow-sm bg-slate-200">
            <p className="text-sm font-semibold opacity-0">Load</p>
        </div>
    )
}

function mapStateToProps(state: any) {
    return {
        category: state.blog.category,
        mode_category: state.blog.blog_page.mode_category,
    }
}

export default connect(mapStateToProps, { getCategory })(CategoryBlog)
