//@ts-check
"use client"
import React from "react"

import { PrimaryButton } from "@/client/component/buttons/PrimaryButton"
import { AccountTable } from "./AccountTable"
import SearchInput from "@/client/component/inputs/SearchInput"
import ModalManageAccount from "@/client/component/modals/ModalManageAccount"
import { useAccountHooks } from "./hooks"
import { Badge, Tooltip } from "@mantine/core"
import { AppContext } from "@/client/context"
import { SecondaryButton } from "@/client/component/buttons/SecondaryButton"
import { IoReload } from "react-icons/io5"
import { FaPencilAlt, FaTrash } from "react-icons/fa"
import { DangerButton } from "@/client/component/buttons/DangerButton"
import ModalShowPassword from "@/client/component/modals/ModalShowPassword"
import PaginationButtons from "@/client/component/buttons/PaginationButtons"
const DashboardAccountViews = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false)
    const { account: me } = React.useContext(AppContext)

    const {
        list,
        fetchData,
        handleRemove,
        handleUpdate,
        handleReset,
        isSecretModalVisible,
        setIsSecretModalVisible,
        secretKey,
        isEditModalVisible,
        setIsEditModalVisible,
        formUpdate,
        ConfirmDialogComponent
    } = useAccountHooks()


    const formattedAccounts = list?.results?.map((n) => ({
        username: n?.username,
        roles: (
            <>
                {n?.roles?.map((m, i) => (
                    <Badge key={i}>{m}</Badge>
                ))}
            </>
        ),
        projects: (
            <>
                {n?.projects?.map((m, i) => (
                    <Badge key={i}>{m?.name}</Badge>
                ))}
            </>
        ),
        action:
            n?.id !== me?.id && (
                <>
                    <Tooltip label="Reset Password">
                        <SecondaryButton onClick={() => handleReset(n?.id)}>
                            <IoReload />
                        </SecondaryButton>
                    </Tooltip>
                    <Tooltip label="Edit">
                        <SecondaryButton onClick={() => handleUpdate(n)}>
                            <FaPencilAlt />
                        </SecondaryButton>
                    </Tooltip>
                    <Tooltip label="Remove">
                        <DangerButton onClick={() => handleRemove(n?.id)}>
                            <FaTrash />
                        </DangerButton>
                    </Tooltip>
                </>
            )
    }));

    return (
        <>
            <div className="w-full space-y-3">
                <div className="flex justify-end space-x-2">
                    <SearchInput />
                    <PrimaryButton onClick={() => {
                        setIsCreateModalVisible(true)
                    }}>
                        Create Account
                    </PrimaryButton>
                </div>
                <AccountTable accounts={formattedAccounts} />
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

            {
                isCreateModalVisible &&
                <ModalManageAccount
                    title={`Create Account`}
                    onCancel={() => {
                        setIsCreateModalVisible(false)
                    }}
                    onSubmit={() => {
                        setIsCreateModalVisible(false)
                        fetchData()
                    }}
                />
            }
            <ConfirmDialogComponent />
            {
                isEditModalVisible &&
                <ModalManageAccount
                    mode={"edit"}
                    title={`Update Account`}
                    initialValue={formUpdate}
                    onSubmit={() => {
                        setIsEditModalVisible(false)
                        fetchData()
                    }}
                    onCancel={() => {
                        setIsEditModalVisible(false)
                    }}
                />
            }
            {
                isSecretModalVisible &&
                <ModalShowPassword
                    secretKey={secretKey}
                    onClose={() => {
                        setIsSecretModalVisible(false)
                    }}
                />
            }
        </>
    )
}

export default DashboardAccountViews