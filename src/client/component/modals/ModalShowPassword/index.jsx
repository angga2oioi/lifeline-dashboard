//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
const ModalShowPassword = ({ onClose, secretKey }) => {
    return (
        <>
            <Modal opened={true} onClose={onClose} title={`Account password`}>
                <div>Here is the new password. </div>
                <div className="flex justify-center px-3 py-4 border-gray-200 rounded-xl">
                    <pre>{secretKey}</pre>
                </div>
            </Modal>
        </>
    )
}

export default ModalShowPassword