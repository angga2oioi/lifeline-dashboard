//@ts-check
"use client"
import React from "react";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useSearchParams } from "next/navigation";
import { findServicedById } from "@/client/api/service";
import { findInstanceById } from "@/client/api/instances";
import { paginateInstancesEvents } from "@/client/api/events";

export const useInstanceHooks = (params) => {

    const searchParams = useSearchParams()
    const ErrorMessage = useErrorMessage()

    const [instance, setInstance] = React.useState(null)
    const [service, setService] = React.useState(null)
    const [list, setList] = React.useState({})

    const fetchData = React.useCallback(async () => {
        try {
            const i = await findInstanceById(params?.id)
            setInstance(i)

            const s = await findServicedById(i?.service)
            setService(s)

            const query = Object.fromEntries(searchParams.entries())
            let l = await paginateInstancesEvents(params?.id, query)

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
        instance,
        service
    };
};
