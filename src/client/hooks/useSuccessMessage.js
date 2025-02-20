// @ts-check
import React from "react";
import { FaCheck, } from "react-icons/fa"
import { showNotification } from "@mantine/notifications";

const useSuccessMessage = () => {
    const showMessage = (e) => {
        showNotification({
            message: e,
            autoClose: 3000,
            color: 'red',
            withBorder: true,
            classNames: {
                root: '!rounded-xl flex justify-center',
            },
            icon: <FaCheck className='text-white' />,
        });
    };
    return showMessage;
};

export default useSuccessMessage;
