//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import FormProject from "../../forms/FormProject"
import {  updateProject } from "@/client/api/project"
const ModalEditProject = ({ initialValue, onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

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
    return (
        <>
            <Modal opened={true} onClose={onCancel} title="Create Project">
                <FormProject
                    loading={isSubmitting}
                    initialValue={initialValue}
                    onSubmit={handleEditProject}
                />
            </Modal>
        </>
    )
}
export default ModalEditProject