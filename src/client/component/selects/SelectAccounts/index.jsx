//@ts-check
"use client"
import { listAllAccount } from "@/client/api/account"
import { AppContext } from "@/client/context"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { MultiSelect } from "@mantine/core"
import React from "react"
const SelectAccounts = ({ ...props }) => {

    const ErrorMessage = useErrorMessage()
    const [list, setList] = React.useState([])
    const { account: me } = React.useContext(AppContext)

    const fetchData = async () => {
        try {
            let l = await listAllAccount()
            setList(l)
        } catch (e) {
            ErrorMessage(e)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <MultiSelect
                {...props}
                data={list?.map((n) => {
                    return {
                        value: n?.id,
                        label: n?.username
                    }
                })}

            />
        </>
    )
}

export default SelectAccounts