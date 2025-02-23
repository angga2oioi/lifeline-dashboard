//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import FormProject from "../../forms/FormProject"
import { createProject } from "@/client/api/project"
const ModalCreateProject = ({ onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleCreateProject = async(e)=>{
        if(isSubmitting){
            return null
        }
        
        try{
            setIsSubmitting(true)
            await createProject(e)
            onSubmit()
        }catch(e){
            ErrorMessage(e)
        }finally{
            setIsSubmitting(false)
        }
    }
    return (
        <>
            <Modal opened={true} onClose={onCancel} title="Create Project">
                <FormProject
                    loading={isSubmitting}
                    onSubmit={handleCreateProject}
                />
            </Modal>
        </>
    )
}
export default ModalCreateProject