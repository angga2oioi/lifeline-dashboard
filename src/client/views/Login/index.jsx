// @ts-check
"use client"
import FormLogin from "@/client/component/forms/FormLogin";
import React from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { accountLogin } from "@/client/api/auth";
import { redirect } from "next/navigation";

const LoginViews = ({ }) => {
    const ErrorMessage = useErrorMessage()
    const handleLogin = async (form) => {
        try {
            await accountLogin(form)
            redirect(`/dashboard`)
        } catch (e) {
            ErrorMessage(e)
        }
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="p-6 w-full max-w-[400px] space-y-3">
                    <FormLogin
                        onSubmit={handleLogin}
                    />
                </div>
            </div>
        </>
    )
}

export default LoginViews;