//@ts-check
"use client"
import React from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useSearchParams } from "next/navigation";
import { paginateMyProject, removeProject } from "@/client/api/project";
import { AppContext } from "@/client/context";
import useSuccessMessage from "@/client/hooks/useSuccessMessage";
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog";
import { listProjectServices } from "@/client/api/service";

export const useProjectHooks = (params) => {

    const searchParams = useSearchParams()
    const ErrorMessage = useErrorMessage()
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
    const SuccessMessage = useSuccessMessage()

    
    

    const [list, setList] = React.useState({})

    const fetchData = React.useCallback(async () => {
        try {
            const query = Object.fromEntries(searchParams.entries())

            let l = await paginateMyProject(query)
            setList(l)

        } catch (e) {
            ErrorMessage(e);
        }
    }, [searchParams, ErrorMessage]);

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    

    const handleRemove = async (id) => {
        openConfirmDialog({
            title: 'Remove Account',
            message: 'Are you sure you want to remove this project? This action cannot be undone.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                try {
                    await removeProject(id)
                    fetchData()
                } catch (e) {
                    ErrorMessage(e)
                }
            },
            onCancel: () => console.log('Delete cancelled'),
        })
    }

    const handleDownload = async (id) => {
        try {

            let services = await listProjectServices(id)
            const { hostname, protocol } = window.location

            let env = [
                `LIFELINE_BASE_URL=${protocol}//${hostname}/api`,
                `LIFELINE_PROJECT_ID=${id}`,
                ...services?.map((n) => {
                    return `${n?.name?.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_LIFELINE_SERVICE=${n?.id}`
                })]?.join("\n")

            await navigator.clipboard.writeText(env)

            SuccessMessage('Text copied to clipboard')
        } catch (e) {
            ErrorMessage(e)
        }
    }


    return {
        list,
        fetchData,
        ConfirmDialogComponent,
        handleDownload,
        handleRemove,
    };
};
