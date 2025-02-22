//@ts-check
import { AppContext } from "@/client/context"
import React from "react"
import DropdownMenu from "./DropdownMenu"
import { Avatar } from "@mantine/core"


const Header = () => {
    const { account } = React.useContext(AppContext)

    return (
        <>
            <div className="w-full flex justify-center">
                <div className="w-full max-w-[1440px] bg-black px-3 py-4 text-white flex justify-end">
                    <DropdownMenu account={account} >
                        <Avatar name={account?.username} className="cursor-pointer" />
                    </DropdownMenu>
                </div>
            </div>
        </>
    )
}


export default Header