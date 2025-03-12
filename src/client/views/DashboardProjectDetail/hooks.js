//@ts-check
"use client"
import React from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useSearchParams } from "next/navigation";
import { findProjectById, getProjectMetric } from "@/client/api/project";
import { listProjectServices, removeService } from "@/client/api/service";
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog";

export const useProjectHooks = (projectId) => {
    
    const searchParams = useSearchParams()
    const ErrorMessage = useErrorMessage()

    const [services, setServices] = React.useState([])
    const [project, setProject] = React.useState(null)
    const [metrics, setMetrics] = React.useState(null)

    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

    const fetchData = React.useCallback(async () => {
        try {
            let p = await findProjectById(projectId)
            setProject(p)

            let s = await listProjectServices(projectId)
            setServices(s)

            let m = await getProjectMetric(projectId)
            setMetrics(m)
        } catch (e) {
            ErrorMessage(e);
        }
    }, [searchParams, ErrorMessage]);

    React.useEffect(() => {
        fetchData()
    }, [fetchData])


    const handleRemoveService = async (id) => {
        openConfirmDialog({
            title: 'Remove Service',
            message: 'Are you sure you want to remove this service? This action cannot be undone.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                try {
                    await removeService(id)
                    fetchData()
                } catch (e) {
                    ErrorMessage(e)
                }
            },
            onCancel: () => console.log('Delete cancelled'),
        })
    }

    return {
        services,
        project,
        metrics,
        fetchData,
        ConfirmDialogComponent,
        handleRemoveService
    };
};
