//@ts-check
"use client"
import React from "react";
import Header from "./Header";

const DashboardLayoutViews = ({ children }) => {
    return (
        <>
            <div className="w-full h-full ">
                <Header />
                
                {children}
            </div>
        </>
    )
}

export default DashboardLayoutViews