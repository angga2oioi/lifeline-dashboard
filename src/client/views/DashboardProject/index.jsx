//@ts-check
import React from "react"
import Header from "./Header"
import { PrimaryButton } from "@/client/component/buttons/PrimaryButton"
const DashboardProjectViews = () => {

    return (
        <>
            <div className="w-full space-y-3">
                <div className="flex justify-end">
                    <PrimaryButton>
                        Create Project
                    </PrimaryButton>
                </div>
                <Header />
            </div>
        </>
    )
}

export default DashboardProjectViews