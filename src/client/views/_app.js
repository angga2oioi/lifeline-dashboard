"use client";
import "regenerator-runtime/runtime";

import { AppContext } from "../context";
import { ContextMenuProvider } from "mantine-contextmenu";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import dynamic from "next/dynamic";
const MantineProvider = dynamic(() => import("@mantine/core").then((n) => { return n.MantineProvider }), { ssr: false })

const App = ({ children, nonce, csrf }) => {

    return (
        <MantineProvider
            defaultColorScheme="light"

        >
            <Notifications />
            <ModalsProvider>
                <ContextMenuProvider>
                    <AppContext.Provider value={{ nonce, csrf }}>
                        {children}
                    </AppContext.Provider>
                </ContextMenuProvider>
            </ModalsProvider>
        </MantineProvider>
    );
};

export default App;
