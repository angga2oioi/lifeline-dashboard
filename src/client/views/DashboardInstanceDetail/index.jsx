//@ts-check
"use client"
import PaginationButtons from "@/client/component/buttons/PaginationButtons";
import { Table } from "@mantine/core";
import moment from "moment-timezone";
import React from "react";
import { MdOutlineFolderOff } from "react-icons/md";
import { useInstanceHooks } from "./hooks";

const DashboardInstanceDetailViews = ({ params }) => {

    const {
        service,
        instance,
        list,
    } = useInstanceHooks(params)

    return (
        <>

            <div className="flex justify-start">
                <h1 className="text-lg">{service?.name} ({instance?.slug})</h1>
            </div>
            <div className="w-full space-y-2">
                {
                    list?.results?.length > 0 ?
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Events</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody >
                                {
                                    list?.results?.map((n, i) => <TableRow
                                        key={`title-${i}`}
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
                {
                    list?.totalResults > 0 &&
                    <div className="w-full flex justify-end">
                        <PaginationButtons
                            total={list?.totalPages || 1}
                            value={list?.page || 1}
                        />
                    </div>
                }

            </div>
        </>
    )
}

const TableRow = ({ item, }) => {
    return (
        <Table.Tr >
            <Table.Td>
                <span className="font-bold">{item.title}</span>
                <MessageList title={item?.title} messages={item?.messages} />
            </Table.Td>
        </Table.Tr>
    )
}

const MessageList = ({ title, messages }) => {
    return (
        <>
            {messages?.map((n, i) => <div key={`message-${title}-${i}`} className="w-full mt-2 px-3 py-2 border-t bg-gray-200 rounded-xl">
                <div>
                    {n?.message}
                </div>
                <div className="w-full flex justify-end space-x-2">
                    <span>Total: {n?.total}</span>
                    <span>Last Message At: {moment(new Date(n?.lastCreatedAt)).fromNow()}</span>
                </div>
            </div>)}
        </>
    )
}

export default DashboardInstanceDetailViews