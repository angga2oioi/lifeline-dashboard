//@ts-check
import ModalChangePassword from "@/client/component/modals/ModalChangePassword";
import { MANAGE_ACCOUNT_ROLES } from "@/global/utils/constant"
import { Menu } from "@mantine/core"
import Link from "next/link";
import React from "react"
import { FaUsers } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { TbLockPassword } from "react-icons/tb";

const DropdownMenu = ({ children, account }) => {
    const [isPasswordModalVisible, setIsPasswordModalVisible] = React.useState(false)

    return (
        <>
            <Menu shadow="md" >
                <Menu.Target>
                    {children}
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<TbLockPassword size={14} />}
                        onClick={()=>{
                            setIsPasswordModalVisible(true)
                        }}
                    >
                        Change Password
                    </Menu.Item>
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
                            className="text-red-500"
                            leftSection={<IoMdLogOut size={14} />}
                        >
                            Logout
                        </Menu.Item>
                    </Link>
                </Menu.Dropdown>
            </Menu>
            {
                isPasswordModalVisible && 
                <ModalChangePassword 
                    onCancel={()=>{
                        setIsPasswordModalVisible(false)
                    }}
                    onSubmit={()=>{
                        setIsPasswordModalVisible(false)
                    }}
                />
            }
        </>
    )
}

export default DropdownMenu