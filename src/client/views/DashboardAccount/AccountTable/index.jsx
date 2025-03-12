//@ts-check
"use client"
import React from "react"

import useErrorMessage from "@/client/hooks/useErrorMessage"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge, Pagination, Tooltip } from "@mantine/core"
import useQueryString from "@/client/hooks/useQueryString"
import { paginateAccount, removeAccount, resetAccountPassword } from "@/client/api/account"
import { Table } from '@mantine/core';
import { AppContext } from "@/client/context"
import { DangerButton } from "@/client/component/buttons/DangerButton"
import { FaPencilAlt, FaTrash } from "react-icons/fa"
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog"
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton"
import PaginationButtons from "@/client/component/buttons/PaginationButtons"
import ModalManageAccount from "@/client/component/modals/ModalManageAccount"
import { IoReloadOutline } from "react-icons/io5";
import ModalShowPassword from "@/client/component/modals/ModalShowPassword"

export const AccountTable = ({ accounts }) => {

    return (
        <>

            {
                accounts &&
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Username</Table.Th>
                            <Table.Th>Roles</Table.Th>
                            <Table.Th>Projects</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody >
                        {
                            accounts?.map((n, i) => <TableRow
                                key={i}
                                item={n}
                            />)
                        }
                    </Table.Tbody>

                </Table>
            }

        </>
    )
}



const TableRow = ({ item }) => {
    return (
        <Table.Tr >
            <Table.Td>{item.username}</Table.Td>
            <Table.Td className="space-x-2">
                {item?.roles}
            </Table.Td>
            <Table.Td className="space-x-2">
                {item?.projects}
            </Table.Td>
            <Table.Td className="flex justify-end space-x-2">
                {item?.action}
            </Table.Td>
        </Table.Tr>
    )
}