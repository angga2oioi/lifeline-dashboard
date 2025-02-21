"use server"

import LoginViews from "@/client/views/Login"
import { isSetupNeeded } from "@/server/module/auth/auth.service"
import { redirect } from "next/navigation"

export default async function LoginPage() {
    
    const isNeeded = await isSetupNeeded()
    if(isNeeded){
        redirect("/setup")
    }

    return (
        <>
            <LoginViews />
        </>
    )
}
