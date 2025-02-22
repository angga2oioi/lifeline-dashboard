//@ts-check
import React from "react"

const CardStatistic = ({ icon, title, total }) => {
    return (
        <div className="w-full flex flex-col p-5 rounded-[20px] bg-[#F9F9F9] shrink-0 snap-center ">
            <div className="flex items-center space-x-2">
                {icon}
                <span className="text-[14px] font-[500]">
                    {title}
                </span>
            </div>
            <div className="flex justify-end">
                <span className="text-[28px] font-[700]">
                    {total}
                </span>
            </div>
        </div>
    )
}

export default CardStatistic