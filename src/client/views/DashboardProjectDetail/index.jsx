//@ts-check
"use client"
import { listProjectServices } from "@/client/api/service";
import { PrimaryButton } from "@/client/component/buttons/PrimaryButton";
import SearchInput from "@/client/component/inputs/SearchInput";
import ModalManageService from "@/client/component/modals/ModalManageService";
import ModalCreateService from "@/client/component/modals/ModalManageService";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { useSearchParams } from "next/navigation";
import React from "react";
import ServiceList from "./ServiceList";
const DashboardProjectDetailViews = ({ params }) => {
    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false)
    const [list, setList] = React.useState([])

    const ErrorMessage = useErrorMessage()
    const searchParams = useSearchParams()

    const fetchData = async () => {
        try {
            let l = await listProjectServices(params?.id)
            setList(l)

        } catch (e) {
            ErrorMessage(e)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [searchParams])
    return (
        <>
            <div className="w-full space-y-3">
                <div className="flex justify-end space-x-2">
                    <SearchInput />
                    <PrimaryButton
                        onClick={() => {
                            setIsCreateModalVisible(true)
                        }}
                    >
                        Create Service
                    </PrimaryButton>
                </div>
                <ServiceList
                    list={list}
                    onUpdate={fetchData}
                />
            </div>
            {
                isCreateModalVisible &&
                <ModalManageService
                    initialValue={{
                        project: params?.id
                    }}
                    title={`Create Service`}
                    onCancel={() => {
                        setIsCreateModalVisible(false)
                    }}
                    onSubmit={() => {
                        fetchData()
                        setIsCreateModalVisible(false)
                    }}
                />
            }
        </>
    )
}

export default DashboardProjectDetailViews;