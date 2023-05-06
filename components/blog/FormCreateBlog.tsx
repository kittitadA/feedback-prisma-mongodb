import { useCallback, useEffect, useState } from "react"
import { connect } from "react-redux"
import toast from "react-hot-toast"

import Input from "../Input"
import Select from "../Select"
import Textarea from "../Textarea"

import { getCategory } from "@/actions/blog_action"

interface FormCreateProps {
    title: string
    description: string
    categorySelect: string
    register: any
    errors: any
    isLoading: boolean
    setCategorySelect: (value: any) => void

    category: any
    getCategory: () => any
}

const FormCreateBlog: React.FC<FormCreateProps> = ({
    category,
    title,
    description,
    categorySelect,
    setCategorySelect,
    getCategory,
    register,
    errors,
    isLoading,
}) => {
    const [isLoadingCategory, setIsLoadingCategory] = useState(false)

    const loadCategory = useCallback(() => {
        setIsLoadingCategory(true)
        getCategory()
            .then((res: any) => {
                if (res.payload.data.data.length > 0) {
                    setCategorySelect(res.payload.data.data[0].id)
                }
            })
            .catch((err: any) => {
                toast.error("Cant load category")
            })
            .finally(() => {
                setIsLoadingCategory(false)
            })
    }, [])

    useEffect(() => {
        if (!category.loaded) {
            loadCategory()
        }
    }, [])

    return (
        <>
            <div className="mt-6">
                <Input
                    id="title"
                    label="Title"
                    value={title}
                    register={register}
                    errors={errors}
                    disabled={isLoading}
                    required
                />
            </div>
            <div className="mt-6">
                <Textarea
                    id="description"
                    label="Detail"
                    value={description}
                    register={register}
                    errors={errors}
                    disabled={isLoading}
                    required
                />
            </div>
            <p className="font-semibold mt-3">Category</p>
            <div className="pt-2">
                <Select
                    id="Category"
                    value={categorySelect}
                    disabled={isLoading || isLoadingCategory}
                    onChange={(e) => setCategorySelect(e.target.value)}
                >
                    {!category.loaded && <option value="">Loading...</option>}
                    {category.loaded &&
                        category.data.map((cate: any) => (
                            <option
                                value={cate.id}
                                key={cate.id}
                            >
                                {cate.name}
                            </option>
                        ))}
                </Select>
            </div>
        </>
    )
}

function mapStateToProps(state: any) {
    return {
        category: state.blog.category,
    }
}

export default connect(mapStateToProps, { getCategory })(FormCreateBlog)
