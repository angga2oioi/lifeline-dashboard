"use client";
import "regenerator-runtime/runtime";

import { AppContext } from "../context";
import { ContextMenuProvider } from "mantine-contextmenu";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider } from "@mantine/core";
const App = ({ children, nonce, account }) => {

    return (
        <MantineProvider
            defaultColorScheme="light"

        >
            <Notifications />
            <ModalsProvider>
                <ContextMenuProvider>
                    <AppContext.Provider value={{ nonce, account }}>
                        {children}
                    </AppContext.Provider>
                </ContextMenuProvider>
            </ModalsProvider>
        </MantineProvider>
    );
};

export default App;
