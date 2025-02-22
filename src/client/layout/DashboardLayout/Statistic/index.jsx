//@ts-check
import React, { useEffect } from "react"
import { MdWorkOutline, MdMiscellaneousServices, MdStorage, MdEvent } from "react-icons/md";
import CardStatistic from "../../../component/cards/CardStatistic";
import useErrorMessage from "@/client/hooks/useErrorMessage";
import { getMyStatuses } from "@/client/api/account";

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
                <CardStatistic icon={<MdWorkOutline size={20} className="text-[#7E3BEB]" />} title={`Project`} total={0} />
                <CardStatistic icon={<MdMiscellaneousServices size={20} className="text-[#7E3BEB]" />} title={`Service`} total={0} />
                <CardStatistic icon={<MdStorage size={20} className="text-[#7E3BEB]" />} title={`Instance`} total={0} />
                <CardStatistic icon={<MdEvent size={20} className="text-[#7E3BEB]" />} title={`Events`} total={0} />
            </div>
        </>
    )
}

export default Statistic