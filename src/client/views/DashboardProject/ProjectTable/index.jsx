//@ts-check
"use client"
import React, { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge, Pagination, Table } from "@mantine/core"
import useQueryString from "@/client/hooks/useQueryString"
import { AppContext } from "@/client/context"
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton"
import { FaPencilAlt, FaTrash } from "react-icons/fa"
import { DangerButton } from "@/client/component/buttons/DangerButton"
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { removeProject } from "@/client/api/project"
import ModalEditProject from "@/client/component/modals/ModalEditProject"
import Link from "next/link"
import PaginationButtons from "@/client/component/buttons/PaginationButtons"

export const ProjectTable = ({ list, onUpdate }) => {

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const { createQueryString } = useQueryString(searchParams)
    const { account: me } = React.useContext(AppContext)
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
    const ErrorMessage = useErrorMessage()
    const [formUpdate, setFormUpdate] = React.useState(null)
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false)

    const handleRemove = async (id) => {
        openConfirmDialog({
            title: 'Remove Account',
            message: 'Are you sure you want to remove this project? This action cannot be undone.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                try {
                    await removeProject(id)
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
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Services</Table.Th>
                            <Table.Th>Instances</Table.Th>
                            <Table.Th>Events</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody >
                        {
                            list?.results?.map((n, i) => <TableRow
                                key={n?.id}
                                me={me}
                                item={n}
                                onRemoveClick={() => {
                                    handleRemove(n?.id)
                                }}
                                onUpdateClick={() => {
                                    handleUpdate(n)
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
                <ModalEditProject
                    initialValue={formUpdate}
                    onCancel={() => {
                        setIsEditModalVisible(false)
                    }}
                    onSubmit={() => {
                        setIsEditModalVisible(false)
                        onUpdate()
                    }}
                />
            }
        </>
    )
}

const TableRow = ({ me, item, onRemoveClick, onUpdateClick }) => {
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