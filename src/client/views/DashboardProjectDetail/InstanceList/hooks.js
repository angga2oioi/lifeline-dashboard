//@ts-check
"use client"
import React from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useSearchParams } from "next/navigation";
import {  getInstanceStatus } from "@/client/api/instances";

export const useInstanceHooks = (instanceId) => {

    const searchParams = useSearchParams()
    const ErrorMessage = useErrorMessage()

    const [status, setStatus] = React.useState(null)

    const fetchData = React.useCallback(async () => {
        try {
            let s = await getInstanceStatus(instanceId)
            setStatus(s)

        } catch (e) {
            ErrorMessage(e);
        }
    }, [searchParams, ErrorMessage]);

    React.useEffect(() => {
        fetchData()
    }, [fetchData])


    return {
        status
    };
};
