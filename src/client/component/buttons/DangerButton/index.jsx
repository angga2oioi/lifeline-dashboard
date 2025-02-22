//@ts-check

import React from "react"
import { Button } from "@mantine/core"

export const DangerButton = ({ children, ...props }) => {
    return (
        <>
            <Button
                {...props}
                className="!bg-red-700 text-white px-3 py-2 rounded"
            >
                {children}
            </Button>
        </>
    )
}