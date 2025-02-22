//@ts-check
"use client"
import React from "react"

import { PrimaryButton } from "@/client/component/buttons/PrimaryButton"
import { AccountTable } from "./AccountTable"
import ModalCreateAccount from "@/client/component/modals/ModalCreateAccount"
import { useRouter, useSearchParams } from "next/navigation"
import { paginateAccount } from "@/client/api/account"
import useErrorMessage from "@/client/hooks/useErrorMessage"
const DashboardAccountViews = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false)
    const searchParams = useSearchParams()
    const ErrorMessage = useErrorMessage()

    const [list, setList] = React.useState({})

    const fetchData = async () => {
        try {
            const query = Object.fromEntries(searchParams.entries())

            let l = await paginateAccount(query)
            setList(l)

        } catch (e) {
            ErrorMessage(e)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [searchParams])

    return (
        <>
            <div className="w-full space-y-3">
                <div className="flex justify-end">
                    <PrimaryButton onClick={() => {
                        setIsCreateModalVisible(true)
                    }}>
                        Create Account
                    </PrimaryButton>
                </div>
                <AccountTable list={list} fetchData={fetchData}/>
            </div>

            {
                isCreateModalVisible &&
                <ModalCreateAccount
                    onCancel={() => {
                        setIsCreateModalVisible(false)
                    }}
                    onSubmit={()=>{
                        setIsCreateModalVisible(false)
                        fetchData()
                    }}
                />
            }
        </>
    )
}

export default DashboardAccountViews