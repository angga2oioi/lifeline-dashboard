//@ts-check

import React from "react"
import { Button } from "@mantine/core"

export const PrimaryButton = ({ children, ...props }) => {
    return (
        <>
            <Button
                {...props}
                className="!bg-black text-white px-3 py-2 rounded"
            >
                {children}
            </Button>
        </>
    )
}