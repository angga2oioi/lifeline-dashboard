//@ts-check
import { AppContext } from "@/client/context"
import { MANAGE_ACCOUNT_ROLES } from "@/global/utils/constant";
import { Avatar, Menu } from "@mantine/core"
import Link from "next/link";
import React from "react"
import { FaUsers } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

const Header = () => {
    const { account } = React.useContext(AppContext)

    return (
        <>
            <div className="w-full flex justify-center">
                <div className="w-full max-w-[1440px] bg-black px-3 py-4 text-white flex justify-end">
                    <DropdownMenu account={account} />
                </div>
            </div>
        </>
    )
}

const DropdownMenu = ({ account }) => {
    return (
        <Menu shadow="md" >
            <Menu.Target>
                <Avatar name={account?.username} className="cursor-pointer" />
            </Menu.Target>
            <Menu.Dropdown>
                {
                    account?.roles?.includes(MANAGE_ACCOUNT_ROLES) &&
                    <>
                        <Menu.Item leftSection={<FaUsers size={14} />}>
                            Manage Users
                        </Menu.Item>
                        <Menu.Divider />
                    </>
                }
                <Link href={`/logout`}>
                    <Menu.Item
                        color="red"
                        leftSection={<IoMdLogOut size={14} />}
                    >
                        Logout
                    </Menu.Item>
                </Link>
            </Menu.Dropdown>
        </Menu>
    )
}
export default Header