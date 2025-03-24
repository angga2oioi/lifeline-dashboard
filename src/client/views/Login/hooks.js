//@ts-check
"use client"
import React from "react";
import { accountLogin } from "@/client/api/auth";
import { AppContext } from "@/client/context";
import useErrorMessage from "@/client/hooks/useErrorMessage";

export const useLoginHooks = () => {

    const ErrorMessage = useErrorMessage()

    const handleLogin = async (form) => {
        try {
            await accountLogin(form)
            window.location.href = `/dashboard`
        } catch (e) {
            ErrorMessage(e)
        }
    }


    return {
        handleLogin
    };
};
