//@ts-check
"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { setupAccount } from "@/client/api/auth";
import { AppContext } from "@/client/context";
import useErrorMessage from "@/client/hooks/useErrorMessage";

export const useSetupHooks = () => {

    const { csrf } = React.useContext(AppContext)
    const router = useRouter()
    const ErrorMessage = useErrorMessage()

    const handleSetup = async (form) => {
        try {
            await setupAccount(csrf, form)
            router.push(`/dashboard`)
        } catch (e) {
            ErrorMessage(e)
        }
    }

    return {
        handleSetup
    };
};
