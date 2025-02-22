//@ts-check
"use client"
import React from "react"

import useErrorMessage from "@/client/hooks/useErrorMessage"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge, Pagination } from "@mantine/core"
import useQueryString from "@/client/hooks/useQueryString"
import { paginateAccount } from "@/client/api/account"
import { Table } from '@mantine/core';

export const AccountTable = () => {

    const ErrorMessage = useErrorMessage()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const { createQueryString } = useQueryString(searchParams)

    const [list, setList] = React.useState({})
    const fetchData = async () => {
        try {
            const query = Object.fromEntries(searchParams.entries())

            let l = await paginateAccount(query)
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

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Username</Table.Th>
                        <Table.Th>Roles</Table.Th>
                        <Table.Th>Projects</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {
                        list?.results?.map((n, i) => {
                            return (
                                <>
                                    <Table.Tr key={i}>
                                        <Table.Td>{n.username}</Table.Td>
                                        <Table.Td className="space-x-2">
                                            {n?.roles?.map((m, k) => {
                                                return <Badge key={k}>{m}</Badge>
                                            })}
                                        </Table.Td>
                                        <Table.Td className="space-x-2">
                                            {n?.projects?.map((m, k) => {
                                                return <Badge key={k}>{m}</Badge>
                                            })}
                                        </Table.Td>
                                        
                                    </Table.Tr>
                                </>
                            )
                        })
                    }
                </Table.Tbody>
            </Table>
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