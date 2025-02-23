//@ts-check
import { Modal } from "@mantine/core"
import React from "react"
const ModalShowSecret = ({ onClose, secretKey }) => {
    return (
        <>
            <Modal opened={true} onClose={onClose}>
                <div>Here is your secret Key.
                    You will not be able to view this key again once you close this window,
                    so be sure to store it somewhere save.
                </div>
                <div className="flex justify-center px-3 py-4 border-gray-200 rounded-xl">
                    <pre>{secretKey}</pre>
                </div>
            </Modal>
        </>
    )
}

export default ModalShowSecret