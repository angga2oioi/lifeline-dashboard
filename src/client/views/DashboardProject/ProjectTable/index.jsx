//@ts-check
"use client"
import React from "react"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Table, Tooltip } from "@mantine/core"
import useQueryString from "@/client/hooks/useQueryString"
import { AppContext } from "@/client/context"
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton"
import { FaFileDownload, FaPencilAlt, FaTrash } from "react-icons/fa"
import { DangerButton } from "@/client/component/buttons/DangerButton"
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { removeProject } from "@/client/api/project"
import Link from "next/link"
import PaginationButtons from "@/client/component/buttons/PaginationButtons"
import { MdOutlineFolderOff } from "react-icons/md"
import ModalManageProject from "@/client/component/modals/ModalManageProject"
import { listProjectServices } from "@/client/api/service"
import useSuccessMessage from "@/client/hooks/useSuccessMessage"

export const ProjectTable = ({ list, onUpdate }) => {


    const { account: me } = React.useContext(AppContext)
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
    const ErrorMessage = useErrorMessage()
    const SuccessMessage = useSuccessMessage()

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

    const handleDownload = async (id) => {
        try {

            let services = await listProjectServices(id)
            const { hostname, protocol } = window.location

            let env = [
                `LIFELINE_BASE_URL=${protocol}//${hostname}/api`,
                `LIFELINE_PROJECT_ID=${id}`,
                ...services?.map((n) => {
                    return `${n?.name?.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}_LIFELINE_SERVICE=${n?.id}`
                })]?.join("\n")

            await navigator.clipboard.writeText(env)

            SuccessMessage('Text copied to clipboard')
        } catch (e) {
            ErrorMessage(e)
        }
    }

    return (
        <>


            {
                list?.results?.length > 0 ?
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
                                    onDownloadClick={() => {
                                        handleDownload(n?.id)
                                    }}
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
                <ModalManageProject
                    initialValue={formUpdate}
                    title={`Update Project`}
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

const TableRow = ({ me, item, onRemoveClick, onUpdateClick, onDownloadClick }) => {
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
                        <Tooltip label={`Download env`}>
                            <SecondaryButton onClick={onDownloadClick}>
                                <FaFileDownload />
                            </SecondaryButton>
                        </Tooltip>
                        <Tooltip label={`Edit Project`}>
                            <SecondaryButton onClick={onUpdateClick}>
                                <FaPencilAlt />
                            </SecondaryButton>
                        </Tooltip>
                        <Tooltip label={`Delete Project`}>
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