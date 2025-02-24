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

export const AccountTable = ({ list, onUpdate }) => {

    const ErrorMessage = useErrorMessage()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const { createQueryString } = useQueryString(searchParams)
    const { account: me } = React.useContext(AppContext)
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
    const [formUpdate, setFormUpdate] = React.useState(null)
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false)
    const [isSecretModalVisible, setIsSecretModalVisible] = React.useState(false)
    const [secreteKey, setSecretKey] = React.useState({})

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

    const handleReset = async (id) => {
        try {
            let password = await resetAccountPassword(id)
            setSecretKey(password)
            setIsSecretModalVisible(true)
        } catch (e) {
            ErrorMessage(e)
        }
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
                            list?.results?.map((n, i) => <TableRow
                                key={i}
                                me={me}
                                item={n}
                                onRemoveClick={() => {
                                    handleRemove(n?.id)
                                }}
                                onUpdateClick={() => {
                                    handleUpdate(n)
                                }}
                                onResetClick={() => {
                                    handleReset(n?.id)
                                }}
                            />)
                        }
                    </Table.Tbody>

                </Table>
            }
            <ConfirmDialogComponent />
            {
                list?.totalResults > 0 &&
                <div className="w-full flex justify-end">
                    <PaginationButtons
                        total={list?.totalPages || 1}
                        value={list?.page || 1}
                    />
                </div>
            }
            {
                isEditModalVisible &&
                <ModalManageAccount
                    mode={"edit"}
                    title={`Update Account`}
                    initialValue={formUpdate}
                    onSubmit={() => {
                        setIsEditModalVisible(false)
                        onUpdate()
                    }}
                    onCancel={() => {
                        setIsEditModalVisible(false)
                    }}
                />
            }
            {
                isSecretModalVisible &&
                <ModalShowPassword
                    secretKey={secreteKey}
                    onClose={() => {
                        setIsSecretModalVisible(false)
                    }}
                />
            }
        </>
    )
}



const TableRow = ({ me, item, onRemoveClick, onUpdateClick, onResetClick }) => {
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
                    return <Badge key={k}>{m?.name}</Badge>
                })}
            </Table.Td>
            <Table.Td className="flex justify-end space-x-2">
                {
                    item?.id !== me?.id &&
                    <>
                        <Tooltip label={`Reset Password`}>
                            <SecondaryButton onClick={onResetClick}>
                                <IoReloadOutline />
                            </SecondaryButton>
                        </Tooltip>
                        <Tooltip label={`Edit Account`}>
                            <SecondaryButton onClick={onUpdateClick}>
                                <FaPencilAlt />
                            </SecondaryButton>
                        </Tooltip>
                        <Tooltip label={`Remove Account`}>
                            <DangerButton onClick={onRemoveClick}>
                                <FaTrash />
                            </DangerButton>
                        </Tooltip>
                    </>
                }
            </Table.Td>
        </Table.Tr>
    )
}