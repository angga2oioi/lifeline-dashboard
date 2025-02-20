//@ts-check

import React from "react"
import {  TextInput } from "@mantine/core"

export const InputText = ({ ...props }) => {
    return (
        <>
            <TextInput
                {...props}
                classNames={{
                    root: "space-y-1",
                    input: "border w-full px-3 py-1"
                }}
            />
        </>
    )
}