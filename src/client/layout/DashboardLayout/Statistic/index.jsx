//@ts-check
import React, { useEffect } from "react"
import { MdWorkOutline, MdMiscellaneousServices, MdStorage, MdEvent } from "react-icons/md";
import CardStatistic from "../../../component/cards/CardStatistic";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { getMyStatuses } from "@/client/api/account";
import Link from "next/link";

const Statistic = () => {
    const [status, setStatuses] = React.useState([])
    const ErrorMessage = useErrorMessage()

    const fetchData = async () => {
        try {
            let r = await getMyStatuses()
            setStatuses(r)
        } catch (e) {
            ErrorMessage(e)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            <div className="w-full grid grid-cols-2 gap-2 lg:grid-cols-4 px-3">
                <Link href={`/dashboard/projects`} className="cursor-pointer">
                    <CardStatistic icon={<MdWorkOutline size={20} className="text-[#7E3BEB]" />} title={`Project`} total={status?.totalProjects} />
                </Link>
                <CardStatistic icon={<MdMiscellaneousServices size={20} className="text-[#7E3BEB]" />} title={`Service`} total={status?.totalServices} />
                <CardStatistic icon={<MdStorage size={20} className="text-[#7E3BEB]" />} title={`Instance`} total={status?.totalInstances} />
                <CardStatistic icon={<MdEvent size={20} className="text-[#7E3BEB]" />} title={`Events`} total={status?.totalEvents} />
            </div>
        </>
    )
}

export default Statistic