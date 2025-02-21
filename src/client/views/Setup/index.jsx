// @ts-check
"use client"
import FormLogin from "@/client/component/forms/FormLogin";
import React from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { accountLogin, setupAccount } from "@/client/api/auth";
import { AppContext } from "@/client/context";
import { useRouter } from "next/navigation";

const SetupViews = ({ }) => {
    const ErrorMessage = useErrorMessage();
    const { csrf } = React.useContext(AppContext)
    const router = useRouter()

    const handleSetup = async (form) => {
        try {
            await setupAccount(csrf, form)
            router.push(`/dashboard`)
        } catch (e) {
            ErrorMessage(e)
        }
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="p-6 w-full max-w-[400px] space-y-3">
                    <h1 className="flex justify-center text-lg">Create Account</h1>
                    <FormLogin
                        onSubmit={handleSetup}
                    />
                </div>
            </div>
        </>
    )
}

export default SetupViews;