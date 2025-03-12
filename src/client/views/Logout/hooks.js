//@ts-check
"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { accountLogout } from "@/client/api/auth";
import useErrorMessage from "@/client/hooks/useErrorMessage";

export const useLogoutHooks = () => {

    const ErrorMessage = useErrorMessage()
    const router = useRouter()
    const handleLogout = async () => {
        try {

            await accountLogout()
            router.replace("/")

        } catch (e) {
            ErrorMessage(e)
        }
    }
    React.useEffect(() => {
        handleLogout()
    }, [])

    return null
};
