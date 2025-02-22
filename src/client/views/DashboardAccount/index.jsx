//@ts-check
import React from "react"

import { PrimaryButton } from "@/client/component/buttons/PrimaryButton"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { AccountTable } from "./AccountTable"
const DashboardAccountViews = () => {

    const ErrorMessage = useErrorMessage()


    return (
        <>
            <div className="w-full space-y-3">
                <div className="flex justify-end">
                    <PrimaryButton>
                        Create Account
                    </PrimaryButton>
                </div>
                <AccountTable />
            </div>
        </>
    )
}

export default DashboardAccountViews