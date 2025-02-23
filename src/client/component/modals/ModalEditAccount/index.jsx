//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import FormAccount from "../../forms/FormAccount"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { createAccount, updateAccount } from "@/client/api/account"
const ModalEditAccount = ({ initialValue, onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

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
    return (
        <>
            <Modal opened={true} onClose={onCancel} title="Create Account">
                <FormAccount
                    initialValue={initialValue}
                    loading={isSubmitting}
                    onSubmit={handleUpdateAccount}
                />
            </Modal>
        </>
    )
}
export default ModalEditAccount