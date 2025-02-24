//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { changeMyPassword,  } from "@/client/api/account"
import FormPassword from "../../forms/FormPassword"

const ModalChangePassword = ({  onCancel, onSubmit }) => {

    const ErrorMessage = useErrorMessage()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleChangePassword = async (e) => {
        if (isSubmitting) {
            return null
        }
        try {
            setIsSubmitting(true)
            await changeMyPassword(e)
            onSubmit()
        } catch (e) {
            ErrorMessage(e)
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <>
            <Modal opened={true} onClose={onCancel} title={`Change Password`}>
                <FormPassword
                    loading={isSubmitting}
                    onSubmit={handleChangePassword}
                />
            </Modal>
        </>
    )
}
export default ModalChangePassword