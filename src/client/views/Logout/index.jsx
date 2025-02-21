// @ts-check
"use client"
import { accountLogout } from "@/client/api/auth";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useRouter } from "next/navigation";

import React from "react";

const LogoutViews = ({ }) => {

    const ErrorMessage = useErrorMessage()
    const router = useRouter()
    const handleLogout = async()=>{
        try{

            await accountLogout()
            router.replace("/")

        }catch(e){
            ErrorMessage(e)
        }
    }
    React.useEffect(()=>{
        handleLogout()
    },[])
    return (
        <>
            

        </>
    )
}

export default LogoutViews;