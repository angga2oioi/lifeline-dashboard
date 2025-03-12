//@ts-check
"use client"
import React from "react"

import { PrimaryButton } from "@/client/component/buttons/PrimaryButton"
import { ProjectTable } from "./ProjectTable"
import SearchInput from "@/client/component/inputs/SearchInput"
import ModalManageProject from "@/client/component/modals/ModalManageProject"
import ModalShowSecret from "@/client/component/modals/ModalShowSecret"
import { useProjectHooks } from "./hooks"
import { Tooltip } from "@mantine/core"
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton"
import { IoReload } from "react-icons/io5"
import { FaFileDownload, FaPencilAlt, FaTrash } from "react-icons/fa"
import { DangerButton } from "@/client/component/buttons/DangerButton"
import PaginationButtons from "@/client/component/buttons/PaginationButtons"
const DashboardProjectViews = () => {

    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false)
    const [isSecretModalVisible, setIsSecretModalVisible] = React.useState(false)
    const [secreteKey, setSecretKey] = React.useState({})
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false)
    const [formUpdate, setFormUpdate] = React.useState(null)

    const {
        list,
        fetchData,
        ConfirmDialogComponent,
        handleDownload,
        handleRemove,

    } = useProjectHooks()

    const formattedProject = list?.results?.map((n) => {
        return {
            id: n?.id,
            name: n?.name,
            totalServices: n?.totalServices,
            totalInstances: n?.totalInstances,
            totalEvents: n?.totalEvents,
            action: (
                <>
                    <Tooltip label={`Download env`}>
                        <SecondaryButton onClick={() => { handleDownload(n?.id) }}>
                            <FaFileDownload />
                        </SecondaryButton>
                    </Tooltip>
                    <Tooltip label={`Edit Project`}>
                        <SecondaryButton onClick={() => { setFormUpdate(n); setIsEditModalVisible(true) }}>
                            <FaPencilAlt />
                        </SecondaryButton>
                    </Tooltip>
                    <Tooltip label={`Delete Project`}>
                        <DangerButton onClick={() => { handleRemove(n?.id) }}>
                            <FaTrash />
                        </DangerButton>
                    </Tooltip>
                </>
            )
        }
    })

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
                <ProjectTable list={formattedProject} />
            </div>
            <ConfirmDialogComponent />
            {
                list?.totalResults > 0 &&
                <div className="w-full flex justify-end">
                    <PaginationButtons
                        total={list?.totalPages || 1}
                        value={list?.page || 1}
                    />
                </div>
            }
            {
                isEditModalVisible &&
                <ModalManageProject
                    mode={`edit`}
                    initialValue={formUpdate}
                    title={`Update Project`}
                    onCancel={() => {
                        setIsEditModalVisible(false)
                    }}
                    onSubmit={() => {
                        setIsEditModalVisible(false)
                        fetchData()
                    }}
                />
            }
            {
                isCreateModalVisible &&
                <ModalManageProject
                    title={`Create Project`}
                    onCancel={() => {
                        setIsCreateModalVisible(false)
                    }}
                    onSubmit={(e) => {
                        fetchData()
                        setIsCreateModalVisible(false)
                        setSecretKey(e)
                        setIsSecretModalVisible(true)
                    }}
                />
            }
            {
                isSecretModalVisible &&
                <ModalShowSecret
                    secretKey={secreteKey}
                    onClose={() => {
                        setIsSecretModalVisible(false)
                    }}
                />
            }
        </>
    )
}

export default DashboardProjectViews