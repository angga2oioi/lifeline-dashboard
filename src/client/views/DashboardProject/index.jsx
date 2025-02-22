//@ts-check
import React from "react"

import { PrimaryButton } from "@/client/component/buttons/PrimaryButton"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { createProject } from "@/client/api/project"
import { ProjectTable } from "./ProjectTable"
const DashboardProjectViews = () => {

    const ErrorMessage = useErrorMessage()

    const handleCreateProject = async(e)=>{
        try{

            await createProject(e)

        }catch(e){
            ErrorMessage(e)
        }
    }

    return (
        <>
            <div className="w-full space-y-3">
                <div className="flex justify-end">
                    <PrimaryButton>
                        Create Project
                    </PrimaryButton>
                </div>
                <ProjectTable />
            </div>
        </>
    )
}

export default DashboardProjectViews