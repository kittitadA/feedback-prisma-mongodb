import { useEffect, useState } from "react"
import { connect } from "react-redux"

import { ImPencil } from "react-icons/im"

import { PRIVILEGE } from "../utility"
import classes from "@/pages/create.module.css"
import FormCreateBlog from "./FormCreateBlog"
import Select from "../Select"

import { getAllRoadmapBlog } from "@/actions/blog_action"

interface FormCreateProps {
    title: string
    description: string
    categorySelect: string
    roadmapSelect: string
    register: any
    errors: any
    roadmap: any
    user: any
    isLoading: boolean
    setCategorySelect: (value: any) => void
    setRoadmapSelect: (value: any) => void
    getAllRoadmapBlog: () => any
}

const EditBlog: React.FC<FormCreateProps> = ({
    title,
    description,
    categorySelect,
    roadmapSelect,
    setCategorySelect,
    setRoadmapSelect,
    register,
    errors,
    isLoading,
    roadmap,
    user,
    getAllRoadmapBlog,
}) => {
    const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false)

    function loadRoadmapAdmin() {
        if (!roadmap.loaded && user.privilege === PRIVILEGE.DEVELOPER) {
            setIsLoadingRoadmap(true)
            getAllRoadmapBlog().then((res: any) => {
                setIsLoadingRoadmap(false)
            })
        }
    }

    useEffect(() => {
        loadRoadmapAdmin()
    }, [user])

    return (
        <div className="relative rounded-lg bg-white p-4 shadow-sm mt-[48px] animation-slideUp">
            <div
                className={`
                        absolute rounded-full w-[48px] h-[48px] left-[24px] top-[-24px] shadow
                        flex justify-center items-center ${classes.gradient_box_home}
                    `}
            >
                <ImPencil
                    size={18}
                    color="#fff"
                />
            </div>
            <h2 className="text-lg font-bold mt-6">Edit your Feedback</h2>
            <p className="text-sm text-neutral-400">
                Give your feedback and detail for developer
            </p>

            <FormCreateBlog
                title={title}
                description={description}
                categorySelect={categorySelect}
                register={register}
                errors={errors}
                isLoading={isLoading}
                setCategorySelect={(value: any) => setCategorySelect(value)}
            />

            {user?.privilege === PRIVILEGE.DEVELOPER && (
                <>
                    <p className="font-semibold mt-3">Roadmap</p>
                    <div className="pt-2">
                        <Select
                            id="Category"
                            value={roadmapSelect}
                            disabled={isLoading}
                            loading={!roadmap.loaded}
                            onChange={(e) => setRoadmapSelect(e.target.value)}
                        >
                            {!roadmap.loaded && (
                                <option value="">Loading...</option>
                            )}
                            {roadmap.loaded &&
                                roadmap.data.map((rdm: any) => (
                                    <option
                                        value={rdm.id}
                                        key={rdm.id}
                                    >
                                        {rdm.name}
                                    </option>
                                ))}
                        </Select>
                    </div>
                </>
            )}
        </div>
    )
}

function mapStateToProps(state: any) {
    return {
        roadmap: state.blog.roadmap_admin,
        user: state.user.user,
    }
}

export default connect(mapStateToProps, { getAllRoadmapBlog })(EditBlog)
