//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import FormAccount from "../../forms/FormAccount"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { createService, updateService } from "@/client/api/service"
import FormService from "../../forms/FormService"
const ModalManageService = ({ mode = "create", title, initialValue = null, onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleUpdateService = async (e) => {
        if (isSubmitting) {
            return null
        }
        try {
            setIsSubmitting(true)
            await updateService(initialValue?.id, e)
            onSubmit()
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCreateService = async (e) => {
        if (isSubmitting) {
            return null
        }
        try {
            setIsSubmitting(true)
            await createService(initialValue?.project, e)
            onSubmit()
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = (e) => {
        if (mode === "create") {
            handleCreateService(e)
        } else {
            handleUpdateService(e)
        }
    }
    return (
        <>
            <Modal opened={true} onClose={onCancel} title={title}>
                <FormService
                    initialValue={initialValue}
                    loading={isSubmitting}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </>
    )
}
export default ModalManageService