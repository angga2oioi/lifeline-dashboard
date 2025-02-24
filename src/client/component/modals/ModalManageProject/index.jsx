//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import FormProject from "../../forms/FormProject"
import { createProject, updateProject } from "@/client/api/project"
const ModalManageProject = ({ mode = "create", title, initialValue = null, onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    
    const handleCreateProject = async (e) => {
        if (isSubmitting) {
            return null
        }

        try {
            setIsSubmitting(true)
            let { secret } = await createProject(e)
            onSubmit(secret)
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditProject = async (e) => {
        if (isSubmitting) {
            return null
        }

        try {

            setIsSubmitting(true)
            await updateProject(initialValue?.id, e)
            onSubmit()
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = (e) => {
        if (mode === "create") {
            handleCreateProject(e)
        } else {
            handleEditProject(e)
        }
    }

    return (
        <>
            <Modal opened={true} onClose={onCancel} title={title}>
                <FormProject
                    initialValue={initialValue}
                    loading={isSubmitting}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </>
    )
}
export default ModalManageProject