// @ts-check
"use client"
import FormLogin from "@/client/component/forms/FormLogin";
import React from "react";
import { useLoginHooks } from "./hooks";

const LoginViews = ({ }) => {
    const {
        handleLogin
    } = useLoginHooks()


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