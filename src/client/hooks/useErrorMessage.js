// @ts-check
import React from "react";
import { FaTimes } from "react-icons/fa"
import { showNotification } from "@mantine/notifications";
import { UNKNOWN_ERR_MESSAGE } from "@/global/utils/constant";
import { parseError } from "@/global/utils/functions";

const useErrorMessage = () => {
    const showMessage = (e) => {
        let err = parseError(e);
        showNotification({
            message: err?.message || UNKNOWN_ERR_MESSAGE,
            autoClose: 3000,
            color: 'red',
            withBorder: true,
            classNames: {
                root: '!rounded-xl flex justify-center',
            },
            icon: <FaTimes className='text-white' />,
        });
    };
    return showMessage;
};

export default useErrorMessage;
