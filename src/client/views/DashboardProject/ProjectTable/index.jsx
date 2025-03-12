//@ts-check
"use client"
import React from "react"
import { Table } from "@mantine/core"
import Link from "next/link"
import { MdOutlineFolderOff } from "react-icons/md"

export const ProjectTable = ({ list }) => {

    return (
        <>
            {
                list?.length > 0 ?
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Services</Table.Th>
                                <Table.Th>Instances</Table.Th>
                                <Table.Th>Events</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody >
                            {
                                list?.map((n, i) => <TableRow
                                    key={n?.id}
                                    item={n}
                                />)
                            }
                        </Table.Tbody>
                    </Table> :
                    <>
                        <div className="w-full px-3 py-4 flex justify-center h-[320px]">
                            <div className="flex flex-col justify-center items-center">
                                <div><MdOutlineFolderOff size={20} /></div>
                                <div>No Data</div>
                            </div>
                        </div>

                    </>
            }
            
        </>
    )
}

const TableRow = ({ item }) => {
    return (
        <Table.Tr >
            <Table.Td>
                <Link href={`/dashboard/projects/${item?.id}`}>
                    <span className="font-bold">{item.name}</span>
                </Link>
            </Table.Td>
            <Table.Td>{item.totalServices}</Table.Td>
            <Table.Td>{item.totalInstances}</Table.Td>
            <Table.Td>{item.totalEvents}</Table.Td>
            <Table.Td className="flex justify-end space-x-2">
                {
                    item?.action
                }
            </Table.Td>
        </Table.Tr>
    )
}