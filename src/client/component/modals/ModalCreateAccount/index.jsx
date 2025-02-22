//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import FormAccount from "../../forms/FormAccount"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { createAccount } from "@/client/api/account"
const ModalCreateAccount = ({ onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleCreateAccount = async(e)=>{
        if(isSubmitting){
            return null
        }
        try{
            setIsSubmitting(true)
            await createAccount(e)
            onSubmit()
        }catch(e){
            ErrorMessage(e)
        }finally{
            setIsSubmitting(false)
        }
    }
    return (
        <>
            <Modal opened={true} onClose={onCancel} title="Create Account">
                <FormAccount
                    loading={isSubmitting}
                    onSubmit={handleCreateAccount}
                />
            </Modal>
        </>
    )
}
export default ModalCreateAccount