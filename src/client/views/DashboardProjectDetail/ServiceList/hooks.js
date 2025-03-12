//@ts-check
"use client"
import React from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useSearchParams } from "next/navigation";
import { listServiceInstances } from "@/client/api/instances";

export const useServiceHooks = (serviceId) => {

    const searchParams = useSearchParams()
    const ErrorMessage = useErrorMessage()

    const [list, setList] = React.useState({})

    const fetchData = React.useCallback(async () => {
        try {
            let l = await listServiceInstances(serviceId)
            setList(l)

        } catch (e) {
            ErrorMessage(e);
        }
    }, [searchParams, ErrorMessage]);

    React.useEffect(() => {
        fetchData()
    }, [fetchData])


    return {
        list,

    };
};
