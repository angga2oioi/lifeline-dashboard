//@ts-check
"use client"
import React from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useSearchParams } from "next/navigation";
import { paginateAccount, removeAccount, resetAccountPassword } from "@/client/api/account";
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog";

export const useAccountHooks = () => {

    const searchParams = useSearchParams()
    const ErrorMessage = useErrorMessage()

    const [list, setList] = React.useState({})
    const [secretKey, setSecretKey] = React.useState({});
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
    const [isSecretModalVisible, setIsSecretModalVisible] = React.useState(false);
    const [formUpdate, setFormUpdate] = React.useState(null);
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

    const fetchData = React.useCallback(async () => {
        try {
            const query = Object.fromEntries(searchParams.entries());
            const data = await paginateAccount(query);
            setList(data);
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
            message: 'Are you sure you want to remove this account? This action cannot be undone.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                try {
                    await removeAccount(id)
                    fetchData()
                } catch (e) {
                    ErrorMessage(e)
                }
            },
            onCancel: () => console.log('Delete cancelled'),
        })
    }

    const handleUpdate = async (item) => {
        setFormUpdate(item)
        setIsEditModalVisible(true)
    }

    const handleReset = async (id) => {
        try {
            let password = await resetAccountPassword(id)
            setSecretKey(password)
            setIsSecretModalVisible(true)
        } catch (e) {
            ErrorMessage(e)
        }
    }

    return {
        list,
        fetchData,
        handleRemove,
        handleUpdate,
        handleReset,
        isSecretModalVisible,
        setIsSecretModalVisible,
        secretKey,
        isEditModalVisible,
        setIsEditModalVisible,
        formUpdate,
        ConfirmDialogComponent
    };
};
