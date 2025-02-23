//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import FormAccount from "../../forms/FormAccount"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { createAccount, updateAccount } from "@/client/api/account"

const ModalManageAccount = ({ mode = "create", title, initialValue = null, onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleCreateAccount = async (e) => {
        if (isSubmitting) {
            return null
        }
        try {
            setIsSubmitting(true)
            await createAccount(e)
            onSubmit()
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateAccount = async (e) => {
        if (isSubmitting) {
            return null
        }
        try {
            setIsSubmitting(true)
            await updateAccount(initialValue?.id, e)
            onSubmit()
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = (e) => {
        if (mode === "create") {
            handleCreateAccount(e)
        } else {
            handleUpdateAccount(e)
        }
    }

    return (
        <>
            <Modal opened={true} onClose={onCancel} title={title}>
                <FormAccount
                    initialValue={initialValue}
                    loading={isSubmitting}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </>
    )
}
export default ModalManageAccount