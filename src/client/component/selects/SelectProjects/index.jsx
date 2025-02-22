//@ts-check
"use client"
import { listAllMyProject } from "@/client/api/project"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { MultiSelect } from "@mantine/core"
import React from "react"
const SelectProject = ({ ...props }) => {

    const ErrorMessage = useErrorMessage()
    const [list, setList] = React.useState([])

    const fetchData = async () => {
        try {
            let l = await listAllMyProject()
            setList(l)
        } catch (e) {
            ErrorMessage(e)
        }
    }

    React.useEffect(()=>{
        fetchData()
    },[])

    return (
        <>
            <MultiSelect
                {...props}
                data={list?.map((n) => {
                    return {
                        value: n?.id,
                        label: n?.name
                    }
                })}

            />
        </>
    )
}

export default SelectProject