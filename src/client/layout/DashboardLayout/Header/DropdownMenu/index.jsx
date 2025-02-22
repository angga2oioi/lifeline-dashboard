//@ts-check
import { MANAGE_ACCOUNT_ROLES } from "@/global/utils/constant"
import { Menu } from "@mantine/core"
import Link from "next/link";
import React from "react"
import { FaUsers } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

const DropdownMenu = ({ children, account }) => {
    return (
        <Menu shadow="md" >
            <Menu.Target>
                {children}
            </Menu.Target>
            <Menu.Dropdown>
                {
                    account?.roles?.includes(MANAGE_ACCOUNT_ROLES) &&
                    <>
                        <Link href={`/dashboard/accounts`}>
                            <Menu.Item leftSection={<FaUsers size={14} />}>
                                Manage Users
                            </Menu.Item>
                        </Link>
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

export default DropdownMenu