//@ts-check
"use client"
import { listProjectServices } from "@/client/api/service";
import { PrimaryButton } from "@/client/component/buttons/PrimaryButton";
import SearchInput from "@/client/component/inputs/SearchInput";
import ModalManageService from "@/client/component/modals/ModalManageService";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useSearchParams } from "next/navigation";
import React from "react";
import ServiceList from "./ServiceList";
import { findProjectById } from "@/client/api/project";
import MetricList from "./MetricList";
import { useProjectHooks } from "./hooks";
import { Tooltip } from "@mantine/core";
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { DangerButton } from "@/client/component/buttons/DangerButton";
const DashboardProjectDetailViews = ({ params }) => {
    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false)
    const [formUpdate, setFormUpdate] = React.useState(null)
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false)

    const {
        services,
        project,
        metrics,
        fetchData,
        ConfirmDialogComponent,
        handleRemoveService
    } = useProjectHooks(params?.id)

    const formattedServices = services?.map((n) => {
        return {
            id: n?.id,
            name: n?.name,
            action: (
                <>
                    <Tooltip label={`Update Service`}>
                        <SecondaryButton onClick={() => { setFormUpdate(n); setIsEditModalVisible(true) }}>
                            <FaPencilAlt />
                        </SecondaryButton>
                    </Tooltip>
                    <Tooltip label={`Remove Account`}>
                        <DangerButton onClick={() => handleRemoveService(n?.id)}>
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
                <div className="flex justify-between">
                    <h1 className="text-lg">{project?.name}</h1>
                    <div className="flex justify-end space-x-2">
                        <SearchInput />
                        <PrimaryButton
                            onClick={() => {
                                setIsCreateModalVisible(true)
                            }}
                        >
                            Create Service
                        </PrimaryButton>
                    </div>
                </div>
                <MetricList
                    metrics={metrics}
                />
                <ServiceList
                    services={formattedServices}
                />
            </div>
            {
                isCreateModalVisible &&
                <ModalManageService
                    initialValue={{
                        project: params?.id
                    }}
                    title={`Create Service`}
                    onCancel={() => {
                        setIsCreateModalVisible(false)
                    }}
                    onSubmit={() => {
                        fetchData()
                        setIsCreateModalVisible(false)
                    }}
                />
            }
            <ConfirmDialogComponent />
            {isEditModalVisible &&
                <ModalManageService
                    mode={`edit`}
                    title={`Update Service`}
                    initialValue={formUpdate}
                    onCancel={() => {
                        setIsEditModalVisible(false)
                    }}
                    onSubmit={() => {
                        setIsEditModalVisible(false)
                        fetchData()
                    }}
                />}
        </>
    )
}

export default DashboardProjectDetailViews;