//@ts-check
"use client"
import React from "react"

import { PrimaryButton } from "@/client/component/buttons/PrimaryButton"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { createProject, paginateMyProject } from "@/client/api/project"
import { ProjectTable } from "./ProjectTable"
import { useSearchParams } from "next/navigation"
import ModalCreateProject from "@/client/component/modals/ModalCreateProject"
import SearchInput from "@/client/component/inputs/SearchInput"
const DashboardProjectViews = () => {

    const ErrorMessage = useErrorMessage()
    const searchParams = useSearchParams()

    const [list, setList] = React.useState({})
    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false)

    const fetchData = async () => {
        try {
            const query = Object.fromEntries(searchParams.entries())

            let l = await paginateMyProject(query)
            setList(l)

        } catch (e) {
            ErrorMessage(e)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [searchParams])

    return (
        <>
            <div className="w-full space-y-3">
                <div className="flex justify-end space-x-2">
                    <SearchInput />
                    <PrimaryButton
                        onClick={() => {
                            setIsCreateModalVisible(true)
                        }}
                    >
                        Create Project
                    </PrimaryButton>
                </div>
                <ProjectTable list={list} onUpdate={fetchData} />
            </div>
            {
                isCreateModalVisible &&
                <ModalCreateProject
                    onCancel={() => {
                        setIsCreateModalVisible(false)
                    }}
                    onSubmit={() => {
                        fetchData()
                        setIsCreateModalVisible(false)
                    }}
                />
            }
        </>
    )
}

export default DashboardProjectViews