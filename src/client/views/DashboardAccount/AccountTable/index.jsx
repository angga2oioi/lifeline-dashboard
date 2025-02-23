//@ts-check
"use client"
import React from "react"

import useErrorMessage from "@/client/hooks/useErrorMessage"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge, Pagination } from "@mantine/core"
import useQueryString from "@/client/hooks/useQueryString"
import { paginateAccount, removeAccount } from "@/client/api/account"
import { Table } from '@mantine/core';
import { AppContext } from "@/client/context"
import { DangerButton } from "@/client/component/buttons/DangerButton"
import { FaPencilAlt, FaTrash } from "react-icons/fa"
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog"
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton"
import ModalEditAccount from "@/client/component/modals/ModalEditAccount"

export const AccountTable = ({ list, onUpdate }) => {

    const ErrorMessage = useErrorMessage()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const { createQueryString } = useQueryString(searchParams)
    const { account: me } = React.useContext(AppContext)
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
    const [formUpdate, setFormUpdate] = React.useState(null)
    const [isEditModalVisible,setIsEditModalVisible] = React.useState(false)

    const handleRemove = async (id) => {
        openConfirmDialog({
            title: 'Remove Account',
            message: 'Are you sure you want to remove this account? This action cannot be undone.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                try {
                    await removeAccount(id)
                    onUpdate()
                } catch (e) {
                    ErrorMessage(e)
                }
            },
            onCancel: () => console.log('Delete cancelled'),
        })
    }

    const handleUpdate = async (item) => {
        setFormUpdate(item)
        setIsEditModalVisible(true)
    }

    return (
        <>

            {
                list?.results &&
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
                            list?.results?.map((n, i) => {
                                return (
                                    <>
                                        <TableRow
                                            key={i}
                                            me={me}
                                            item={n}
                                            onRemoveClick={() => {
                                                handleRemove(n?.id)
                                            }}
                                            onUpdateClick={() => {
                                                handleUpdate(n)
                                            }}
                                        />
                                    </>
                                )
                            })
                        }
                    </Table.Tbody>
                </Table>
            }
            <ConfirmDialogComponent />
            {
                list?.totalResults > 0 &&
                <div className="w-full flex justify-end">
                    <Pagination total={list?.totalPages || 1} value={list?.page || 1} onChange={(e) => {
                        router.push(pathname + '?' + createQueryString('page', e))
                    }} />
                </div>
            }
            {
                isEditModalVisible && 
                <ModalEditAccount 
                    initialValue={formUpdate}
                    onSubmit={()=>{
                        setIsEditModalVisible(false)
                        onUpdate()
                    }}
                    onCancel={()=>{
                        setIsEditModalVisible(false)
                    }}
                />
            }
        </>
    )
}

const TableRow = ({ me, item, onRemoveClick, onUpdateClick }) => {
    return (
        <Table.Tr >
            <Table.Td>{item.username}</Table.Td>
            <Table.Td className="space-x-2">
                {item?.roles?.map((m, k) => {
                    return <Badge key={k}>{m}</Badge>
                })}
            </Table.Td>
            <Table.Td className="space-x-2">
                {item?.projects?.map((m, k) => {
                    return <Badge key={k}>{m}</Badge>
                })}
            </Table.Td>
            <Table.Td className="flex justify-end space-x-2">
                {
                    item?.id !== me?.id &&
                    <>
                        <SecondaryButton onClick={onUpdateClick}>
                            <FaPencilAlt />
                        </SecondaryButton>
                        <DangerButton onClick={onRemoveClick}>
                            <FaTrash />
                        </DangerButton>
                    </>
                }
            </Table.Td>
        </Table.Tr>
    )
}