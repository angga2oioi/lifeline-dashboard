//@ts-check

import React from "react"
import { Button } from "@mantine/core"

export const SecondaryButton = ({ children, ...props }) => {
    return (
        <>
            <Button
                {...props}
                className="!bg-white !text-black border-black px-3 py-2 rounded"
            >
                {children}
            </Button>
        </>
    )
}