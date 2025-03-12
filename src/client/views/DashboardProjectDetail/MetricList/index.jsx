//@ts-check
import React from "react"
import CardStatistic from "@/client/component/cards/CardStatistic"
import { GoCpu } from "react-icons/go";
import { FaMemory } from "react-icons/fa";
import {  formatBytes, num2Percent } from "@/global/utils/functions";
import { CiHardDrive } from "react-icons/ci";
const MetricList = ({ metrics }) => {

    return (
        <>
            <div className="border border-gray-200 rounded-xl w-full px-3 py-4 space-y-2">
                {
                    metrics?.map((n, i) => {
                        return <div key={n?.slug} className="w-full flex flex-col space-y-2">
                            <div className="text-lg">Instance ID :{n?.slug}</div>
                            <div className="w-full grid grid-cols-2 gap-2 lg:grid-cols-3 ">
                                <CardStatistic icon={<GoCpu size={20} className="text-[#7E3BEB]" />} title={`CPU Load`} total={num2Percent(n?.metrics?.cpu)} />
                                <CardStatistic icon={<FaMemory size={20} className="text-[#7E3BEB]" />} title={`Free Memory`} total={`${formatBytes(n?.metrics?.memory.free)} (${num2Percent(n?.metrics?.memory.free / n?.metrics?.memory.total)})`} />
                                <CardStatistic icon={<CiHardDrive size={20} className="text-[#7E3BEB]" />} title={`Disk Space available`} total={`${formatBytes(n?.metrics?.disk.free)} (${num2Percent(n?.metrics?.disk.free / n?.metrics?.disk.total)})`} />
                            </div>
                        </div>
                    })
                }
            </div>
        </>
    )
}

export default MetricList