//@ts-check
import React from "react"
const TableHeader = () => {
    return (
        <>
            <div className="px-3 py-2 rounded-full w-full min-w-[640px] overflow-auto flex justify-between border">
                <div>Name</div>
                <div>Services</div>
                <div>Instances</div>
                <div>Events</div>
                <div></div>
            </div>
        </>
    )
}

export default TableHeader