"use server"

import SetupViews from "@/client/views/Setup"
import { isSetupNeeded } from "@/server/module/auth/auth.service"

const SetupPage = async () => {
    const isNeeded = await isSetupNeeded()
    if(!isNeeded){
        redirect("/login")
    }

    return (
        <SetupViews />
    )
}

export default SetupPage