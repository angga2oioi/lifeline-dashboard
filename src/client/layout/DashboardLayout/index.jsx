//@ts-check
"use client"
import React from "react";
import Header from "./Header";
import Statistic from "./Statistic";

const DashboardLayoutViews = ({ children }) => {
    return (
        <>
            <div className="w-full h-full space-y-3">
                <Header />
                <Statistic />
                <div className="px-3">
                    {children}
                </div>
            </div>
        </>
    )
}

export default DashboardLayoutViews