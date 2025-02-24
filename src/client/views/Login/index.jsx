// @ts-check
"use client"
import FormLogin from "@/client/component/forms/FormLogin";
import React from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { accountLogin } from "@/client/api/auth";
import { redirect, useRouter } from "next/navigation";
import { AppContext } from "@/client/context";

const LoginViews = ({ }) => {
    const ErrorMessage = useErrorMessage()
    const { csrf } = React.useContext(AppContext)
    const router = useRouter()

    const handleLogin = async (form) => {
        try {
            await accountLogin(csrf, form)
            window.location.href = `/dashboard`
        } catch (e) {
            ErrorMessage(e)
        }
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="p-6 w-full max-w-[400px] space-y-3">
                    <h1 className="flex justify-center text-lg">Login</h1>
                    <FormLogin
                        onSubmit={handleLogin}
                    />
                </div>
            </div>
        </>
    )
}

export default LoginViews;