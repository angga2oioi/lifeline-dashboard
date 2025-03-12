// @ts-check
"use client"
import FormLogin from "@/client/component/forms/FormLogin";
import React from "react";
import { useSetupHooks } from "./hooks";

const SetupViews = ({ }) => {

    const {
        handleSetup
    } = useSetupHooks()

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