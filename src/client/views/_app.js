"use client";
import "regenerator-runtime/runtime";

import { AppContext } from "../context";
import { ContextMenuProvider } from "mantine-contextmenu";
import dynamic from "next/dynamic";
const MantineProvider = dynamic(() => import("@mantine/core").then((n) => { return n.MantineProvider }), { ssr: false })

const App = ({ children, nonce }) => {

    return (
        <MantineProvider
            defaultColorScheme="light"
            getStyleNonce={() => {
                return nonce;
            }}
        >
            <ContextMenuProvider>
                <AppContext.Provider value={{ nonce }}>
                    {children}
                </AppContext.Provider>
            </ContextMenuProvider>
        </MantineProvider>
    );
};

export default App;
