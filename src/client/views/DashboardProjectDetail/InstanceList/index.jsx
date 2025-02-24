//@ts-check
"use client"
import React from "react"
import { MdOutlineFolderOff } from "react-icons/md"
import moment from "moment-timezone"
import useErrorMessage from "@/client/hooks/useErrorMessage"
import { getInstanceStatus } from "@/client/api/instances"
import { delay } from "@/global/utils/functions"
import Link from "next/link"

const InstanceList = ({ list }) => {

    return (
        <>
            {
                list?.length > 0 ?
                    <>
                        {
                            list?.map((n) => <InstanceItem
                                key={n?.id}
                                item={n}
                            />)
                        }
                    </> :
                    <>
                        <div className="w-full px-3 py-4 flex justify-center">
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

const InstanceItem = ({ item }) => {
    const ErrorMessage = useErrorMessage()
    const [status, setStatus] = React.useState(null)

    const fetchStatus = async () => {
        try {
            if (status !== null) {
                await delay(30000)
            }

            let s = await getInstanceStatus(item?.id)
            setStatus(s)
        } catch (e) {
            ErrorMessage(e)
        }
    }

    React.useEffect(() => {
        fetchStatus()
    }, [status])

    return (
        <>
            <div className="w-full mt-2 px-3 py-2 flex items-center justify-between border-t border-gray-200">
                <div>
                    <div className="flex flex-col">
                        <span className="text-xs">ID</span>
                        <Link href={`/dashboard/instances/${item?.id}`}>
                            <span>{item?.slug}</span>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <div className="flex flex-col">
                        <span className="text-xs">Started</span>
                        <span className="text-center">{moment(new Date(item?.createdAt)).fromNow()}</span>
                    </div>
                    <div className="flex flex-col ">
                        <span className="text-xs">Average Beats</span>
                        <span className="text-center">{status?.avg}/min</span>
                    </div>
                    <div className="flex flex-col ">
                        <span className="text-xs">Last Beat At</span>
                        <span className="text-center">{status?.lastBeatAt ? moment(new Date(status?.lastBeatAt)).fromNow() : ""}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs">Total Events</span>
                        <span className="text-center">{status?.totalEvents}</span>
                    </div>
                    <div className="flex flex-col ">
                        <span className="text-xs">Status</span>
                        <span className={status?.lasMinuteBeat > 0 ? "text-green-500" : "text-red-500"}>{status?.lasMinuteBeat > 0 ? "Online" : "Offline"}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InstanceList