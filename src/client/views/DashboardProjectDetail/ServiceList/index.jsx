//@ts-check
import { removeService } from "@/client/api/service"
import { DangerButton } from "@/client/component/buttons/DangerButton";
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton";
import ModalManageService from "@/client/component/modals/ModalManageService";
import { useConfirmDialog } from "@/client/hooks/useConfirmDialog"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { Tooltip } from "@mantine/core";
import React from "react"
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { MdOutlineFolderOff } from "react-icons/md";

const ServiceList = ({ list, onUpdate }) => {
    const { openConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
    const ErrorMessage = useErrorMessage()
    const [formUpdate, setFormUpdate] = React.useState(null)
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false)

    const handleRemove = async (id) => {
        openConfirmDialog({
            title: 'Remove Service',
            message: 'Are you sure you want to remove this service? This action cannot be undone.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                try {
                    await removeService(id)
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
                list?.length > 0 ?
                    <>
                        {
                            list?.map((n) => <ServiceItem
                                key={n?.id}
                                item={n}
                                onRemoveClick={() => {
                                    handleRemove(n?.id)
                                }}
                                onUpdateClick={() => {
                                    handleUpdate(n)
                                }}
                            />)
                        }
                    </> :
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
            {isEditModalVisible &&
                <ModalManageService
                    mode={`edit`}
                    title={`Update Service`}
                    initialValue={formUpdate}
                    onCancel={() => {
                        setIsEditModalVisible(false)
                    }}
                    onSubmit={() => {
                        setIsEditModalVisible(false)
                        onUpdate()
                    }}
                />}
        </>
    )
}

const ServiceItem = ({ item, onRemoveClick, onUpdateClick }) => {

    return (
        <div className="border border-gray-200 rounded-xl w-full px-3 py-4 space-y-2">
            <div className="w-full flex justify-between">
                <div className="text-lg">{item?.name}</div>
                <div className="flex justify-end space-x-2">
                    <Tooltip label={`Update Service`}>
                        <SecondaryButton onClick={onUpdateClick}>
                            <FaPencilAlt />
                        </SecondaryButton>
                    </Tooltip>
                    <Tooltip label={`Remove Account`}>
                        <DangerButton onClick={onRemoveClick}>
                            <FaTrash />
                        </DangerButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}
export default ServiceList