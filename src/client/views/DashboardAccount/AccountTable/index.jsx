//@ts-check
"use client"
import React from "react"

import { Table } from '@mantine/core';

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