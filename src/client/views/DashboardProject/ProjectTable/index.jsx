//@ts-check
"use client"
import React, { useCallback } from "react"
import TableHeader from "./TableHeader"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { paginateMyProject } from "@/client/api/project"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from "@mantine/core"
import useQueryString from "@/client/hooks/useQueryString"

export const ProjectTable = () => {

    const ErrorMessage = useErrorMessage()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const { createQueryString } = useQueryString(searchParams)

    const [list, setList] = React.useState({})
    const fetchData = async () => {
        try {
            const query = Object.fromEntries(searchParams.entries())

            let l = await paginateMyProject(query)
            setList(l)

        } catch (e) {
            ErrorMessage(e)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [searchParams])

    return (
        <>
            <TableHeader />

            {
                list?.totalResults > 0 &&
                <div className="w-full flex justify-end">
                    <Pagination total={list?.totalPages || 1} value={list?.page || 1} onChange={(e) => {
                        router.push(pathname + '?' + createQueryString('page', e))
                    }} />
                </div>
            }
        </>
    )
}